import Store from 'electron-store';

import { getMainWindow } from './windows';
import { IpcMessages } from '../ipc-messages';
import { getModelManager } from './models';
import { SettingsState, SharedState } from '../types/interfaces';
import { ANIMATION_KEYS_BRACKETS } from '../animations';
import { BUILT_IN_MODELS } from '../models';

const ANIMATION_PROMPT = `Start your response with one of the following keywords matching the users request: ${ANIMATION_KEYS_BRACKETS.join(', ')}. Use only one of the keywords for each response. Use it only at the beginning of your response. Always start with one.`
const DEFAULT_SYSTEM_PROMPT = `You are Clippy, a helpful assistant that was created in the 1990s. You are aware that you are slightly old. Be helpful and friendly.\n${ANIMATION_PROMPT}`

export class StateManager {
  public store = new Store<SharedState>({
    defaults: {
      models: getModelManager().getInitialRendererModelState(),
      settings: {
        selectedModel: undefined,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        alwaysOnTop: true,
        alwaysOpenChat: true,
      },
    },
  });

  constructor() {
    this.ensureCorrectModelState();
    this.ensureCorrectSettingsState();

    this.store.onDidAnyChange(this.onDidAnyChange);

    // Handle settings changes
    this.store.onDidChange('settings', (newValue, oldValue) => {
      this.onSettingsChange(newValue, oldValue);
    });
  }

  public updateModelState() {
    this.store.set('models', getModelManager().getRendererModelState());
  }

  private ensureCorrectSettingsState() {
    const settings = this.store.get('settings');

    // Default model exists?
    if (settings.selectedModel) {
      const model = this.store.get('models')[settings.selectedModel];

      if (!model || !getModelManager().getIsModelDownloaded(model)) {
        const settings = this.store.get('settings');
        settings.selectedModel = undefined;
        this.store.set('settings', settings);
      }
    }
  }

  private ensureCorrectModelState() {
    const models = this.store.get('models');

    if (models === undefined || Object.keys(models).length === 0) {
      this.store.set('models', getModelManager().getInitialRendererModelState());
      return;
    }

    // Make sure we update the fs state for all models
    for (const modelName of Object.keys(models)) {
      const model = models[modelName];

      model.downloaded = getModelManager().getIsModelDownloaded(model);
      model.path = getModelManager().getModelPath(model);
    }

    // Make sure all models from the constant are in state
    for (const model of BUILT_IN_MODELS) {
      if (!(model.name in models)) {
        models[model.name] = getModelManager().getManagedModelFromModel(model);
      } else {
        models[model.name].description = model.description;
        models[model.name].homepage = model.homepage;
        models[model.name].size = model.size;
        models[model.name].url = model.url;
      }
    }

    this.store.set('models', models)
  }

  /**
   * Handles settings changes.
   *
   * @param newValue
   * @param oldValue
   */
  private onSettingsChange(newValue: SettingsState, oldValue?: SettingsState) {
    if (!oldValue) {
      return;
    }

    if (oldValue.alwaysOnTop !== newValue.alwaysOnTop) {
      getMainWindow()?.setAlwaysOnTop(newValue.alwaysOnTop);
    }
  }

  /**
   * Notifies the renderer that the state has changed.
   *
   * @param newValue
   */
  private onDidAnyChange(newValue: SharedState = this.store.store) {
    getMainWindow()?.webContents.send(IpcMessages.STATE_CHANGED, newValue);
  }
}

let _stateManager: StateManager | null = null;

export function getStateManager() {
  if (!_stateManager) {
    _stateManager = new StateManager();
  }

  return _stateManager;
}
