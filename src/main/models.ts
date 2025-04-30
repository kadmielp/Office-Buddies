import { app, DownloadItem, session } from "electron";
import path from "path";
import fs from "fs";

import { ManagedModel, ModelState, Model, BUILT_IN_MODELS } from "../models";
import { DownloadState } from "../types/interfaces";
import { getStateManager } from "./state";

class ModelManager {
  private downloadItems: Record<string, DownloadItem> = {};

  constructor() {
    session.defaultSession.on("will-download", (event, downloadItem) => this.onSessionWillDownload(event, downloadItem));
  }

  private get models() {
    return getStateManager().store.get('models');
  }

  private set models(models: ModelState) {
    getStateManager().store.set('models', models);
  }

  /**
   * Returns a managed model from a model
   *
   * @param model
   * @returns
   */
  public getManagedModelFromModel(model: Model): ManagedModel {
    return {
      ...model,
      downloaded: this.getIsModelDownloaded(model),
      path: this.getModelPath(model),
    };
  }

  /**
   * Downloads a model by name
   *
   * @param name
   */
  public async downloadModelByName(name: string) {
    const model = this.models[name];

    if (!model) {
      throw new Error(`Model not found: ${name}`);
    }

    session.defaultSession.downloadURL(model.url);
  }

  /**
   * Deletes a model by name
   *
   * @param name
   * @returns
   */
  public async deleteModelByName(name: string): Promise<boolean> {
    const model = this.models[name];

    if (!model || !model.path) {
      throw new Error(`Model not found: ${name}`);
    }

    if (!fs.existsSync(model.path)) {
      return true;
    }

    try {
      await fs.promises.unlink(model.path);

      model.downloaded = false;
      model.path = undefined;

      if (this.downloadItems[name] && this.downloadItems[name].getState() !== "completed") {
        try {
          this.downloadItems[name].cancel();
        } catch (error) {
          console.error(`ModelManager: Error canceling download: ${name}`, error);
        }

        delete this.downloadItems[name];
      }

      return true;
    } catch (error) {
      console.error(`ModelManager: Error deleting model: ${name}`, error);
      return false;
    }
  }

  /**
   * Returns a model by name
   *
   * @param name
   * @returns
   */
  public getModelByName(name: string): ManagedModel | undefined {
    return this.models[name];
  }

  /**
   * Deletes all models
   */
  public async deleteAllModels() {
    try {
      await fs.promises.rm(path.join(app.getPath("userData"), "models"), { recursive: true });
    } catch (error) {
      console.error(`ModelManager: Error deleting all models`, error);
    }
  }

  /**
   * Polls the renderer model state
   */
  public pollRendererModelState() {
    getStateManager().store.set('models', this.getRendererModelState());
  }

  /**
   * Returns the initial renderer model state
   *
   * @returns
   */
  public getInitialRendererModelState(): ModelState {
    const result: ModelState = {};

    for (const model of BUILT_IN_MODELS) {
      result[model.name] = this.getManagedModelFromModel(model);
    }

    return result;
  }

  /**
   * Returns the state of the models for the renderer
   *
   * @returns
   */
  public getRendererModelState(): ModelState {
    const result: ModelState = {};

    for (const model of Object.values(this.models)) {
      const downloadItem = this.downloadItems[model.name];
      const downloadState: DownloadState | undefined = downloadItem ? {
        totalBytes: downloadItem.getTotalBytes(),
        receivedBytes: downloadItem.getReceivedBytes(),
        percentComplete: downloadItem.getPercentComplete(),
        startTime: downloadItem.getStartTime(),
        savePath: downloadItem.getSavePath(),
        currentBytesPerSecond: downloadItem.getCurrentBytesPerSecond(),
        state: downloadItem.getState(),
      } : undefined;

      result[model.name] = {
        name: model.name,
        company: model.company,
        size: model.size,
        url: model.url,
        path: model.path,
        description: model.description,
        homepage: model.homepage,
        downloaded: this.getIsModelDownloaded(model),
        downloadState
      };
    }

    return result;
  }

  /**
   * Returns true if the model exists on disk and is not downloading
   *
   * @param model
   * @returns
   */
  public getIsModelDownloaded(model: ManagedModel | Model): boolean {
    const filePath = 'path' in model ? model.path : this.getModelPath(model);
    const existsOnDisk = fs.existsSync(filePath);
    const hasDownloadItem = this.downloadItems[model.name];
    const isDownloading = hasDownloadItem && this.downloadItems[model.name].getState() !== "completed";

    return existsOnDisk || (hasDownloadItem && !isDownloading);
  }

  /**
   * Returns the path to the model on disk
   *
   * @param model
   * @returns
   */
  public getModelPath(model: Model): string {
    return path.join(app.getPath("userData"), "models", this.getModelFileName(model));
  }

  /**
   * Returns the file name of the model
   *
   * @param model
   * @returns
   */
  private getModelFileName(model: Model): string {
    return path.basename(new URL(model.url).pathname);
  }

  /**
   * Handles the will-download event
   *
   * @param downloadItem
   */
  private onSessionWillDownload(event: Electron.Event, downloadItem: DownloadItem) {
    const urlChain = downloadItem.getURLChain();
    const urlStr = urlChain[0];
    const modelKey = Object.keys(this.models).find((k) => this.models[k].url === urlStr);
    const model = this.models[modelKey];

    if (!model) {
      console.log(`ModelManager: Handling will-download event for ${urlStr}, but did not find matching model. Disallowing download.`);
      event.preventDefault();
      return false;
    } else {
      console.log(`ModelManager: Handling will-download event for model ${model.name}. Allowing download.`);
    }

    model.path = this.getModelPath(model);
    model.downloaded = false;
    this.downloadItems[model.name] = downloadItem;

    downloadItem.setSavePath(model.path);

    return true;
  }
}

let _modelManager: ModelManager;
export function getModelManager() {
  if (!_modelManager) {
    _modelManager = new ModelManager();
  }

  return _modelManager;
}
