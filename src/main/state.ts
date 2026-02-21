import Store from "electron-store";
import { safeStorage } from "electron";

import {
  getMainWindow,
  setMainWindowAlwaysOnTop,
  setChatWindowAlwaysOnTop,
  setFont,
  setFontSize,
} from "./windows";
import { IpcMessages } from "../ipc-messages";
import { getModelManager, getModelPath, isModelOnDisk } from "./models";
import {
  DEFAULT_SYSTEM_PROMPT,
  EMPTY_SHARED_STATE,
  SettingsState,
  SharedState,
} from "../sharedState";
import { BUILT_IN_MODELS } from "../models";
import { getLogger } from "./logger";
import { setupAppMenu } from "./menu";

const ENCRYPTED_PREFIX = "ob_enc_v1:";
type SensitiveSettingsKey = "openAiApiKey" | "geminiApiKey" | "maritacaApiKey";

const SENSITIVE_SETTINGS_KEYS: SensitiveSettingsKey[] = [
  "openAiApiKey",
  "geminiApiKey",
  "maritacaApiKey",
];

function isSensitiveSettingsPath(path: string): boolean {
  return SENSITIVE_SETTINGS_KEYS.some((key) => path === `settings.${key}`);
}

function isSensitiveSettingsKey(
  key: keyof SettingsState,
): key is SensitiveSettingsKey {
  return (SENSITIVE_SETTINGS_KEYS as string[]).includes(key);
}

function isEncryptedValue(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(ENCRYPTED_PREFIX);
}

function encryptSecret(value: unknown): unknown {
  if (typeof value !== "string" || value.length === 0 || isEncryptedValue(value)) {
    return value;
  }

  if (!safeStorage.isEncryptionAvailable()) {
    return value;
  }

  try {
    const encrypted = safeStorage.encryptString(value).toString("base64");
    return `${ENCRYPTED_PREFIX}${encrypted}`;
  } catch (error) {
    getLogger().warn("Failed to encrypt API key for storage", error);
    return value;
  }
}

function decryptSecret(value: unknown): unknown {
  if (!isEncryptedValue(value)) {
    return value;
  }

  if (!safeStorage.isEncryptionAvailable()) {
    return value;
  }

  try {
    const payload = value.slice(ENCRYPTED_PREFIX.length);
    return safeStorage.decryptString(Buffer.from(payload, "base64"));
  } catch (error) {
    getLogger().warn("Failed to decrypt API key from storage", error);
    return value;
  }
}

export class StateManager {
  public store = new Store<SharedState>({
    defaults: {
      ...EMPTY_SHARED_STATE,
      models: getModelManager().getInitialRendererModelState(),
    },
  });

  constructor() {
    this.ensureCorrectModelState();
    this.ensureCorrectSettingsState();

    this.store.onDidAnyChange((newValue) => this.onDidAnyChange(newValue));

    // Handle settings changes
    this.store.onDidChange("settings", (newValue, oldValue) => {
      this.onSettingsChange(newValue, oldValue);
    });
  }

  public updateModelState() {
    this.store.set("models", getModelManager().getRendererModelState());
  }

  public getSettings(): SettingsState {
    return this.fromStoredSettings(this.store.get("settings"));
  }

  public getSharedStateForRenderer(): SharedState {
    const state = this.store.store;
    return {
      ...state,
      settings: this.fromStoredSettings(state.settings),
    };
  }

  public getStateValueForRenderer(key: string): any {
    if (key === "settings") {
      return this.getSettings();
    }

    if (isSensitiveSettingsPath(key)) {
      return decryptSecret(this.store.get(key as any));
    }

    return this.store.get(key as any);
  }

  public setStateValue(key: string, value: any) {
    if (key === "settings") {
      this.store.set("settings", this.toStoredSettings(value || {}));
      return;
    }

    if (isSensitiveSettingsPath(key)) {
      this.store.set(key as any, encryptSecret(value) as any);
      return;
    }

    this.store.set(key as any, value);
  }

  private ensureCorrectSettingsState() {
    const settings = this.getSettings();

    // Default model exists?
    if (settings.selectedModel) {
      const model = this.store.get("models")[settings.selectedModel];

      if (!model || !isModelOnDisk(model)) {
        settings.selectedModel = undefined;
      }
    }

    if (settings.topK === undefined) {
      settings.topK = 10;
    }

    if (settings.temperature === undefined) {
      settings.temperature = 0.7;
    }

    if (settings.remoteMaxTokens === undefined) {
      settings.remoteMaxTokens = 512;
    }

    if (!settings.selectedAgent) {
      settings.selectedAgent = "Clippy";
    }

    if (!settings.aiProvider) {
      settings.aiProvider = "local";
    }

    if (!settings.systemPrompt) {
      settings.systemPrompt = DEFAULT_SYSTEM_PROMPT;
    }

    this.store.set("settings", this.toStoredSettings(settings));
  }

  private ensureCorrectModelState() {
    const models = this.store.get("models");

    if (models === undefined || Object.keys(models).length === 0) {
      this.store.set(
        "models",
        getModelManager().getInitialRendererModelState(),
      );
      return;
    }

    // Make sure we update the fs state for all models
    for (const modelName of Object.keys(models)) {
      const model = models[modelName];

      if (model.imported) {
        if (!isModelOnDisk(model)) {
          delete models[modelName];
        }
      } else {
        model.downloaded = isModelOnDisk(model);
        model.path = getModelPath(model);
      }
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

    this.store.set("models", models);
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

    const nextSettings = this.fromStoredSettings(newValue);
    const previousSettings = this.fromStoredSettings(oldValue);

    if (previousSettings.clippyAlwaysOnTop !== nextSettings.clippyAlwaysOnTop) {
      setMainWindowAlwaysOnTop(nextSettings.clippyAlwaysOnTop);
    }

    if (previousSettings.chatAlwaysOnTop !== nextSettings.chatAlwaysOnTop) {
      setChatWindowAlwaysOnTop(nextSettings.chatAlwaysOnTop);
    }

    if (previousSettings.defaultFontSize !== nextSettings.defaultFontSize) {
      setFontSize(nextSettings.defaultFontSize);
    }

    if (previousSettings.defaultFont !== nextSettings.defaultFont) {
      setFont(nextSettings.defaultFont);
    }

    // Update the menu, which contains state
    setupAppMenu();

    // Log the settings change by getting a deep diff
    const diff = Object.keys(nextSettings).reduce(
      (acc, key) => {
        const typedKey = key as keyof SettingsState;
        if (nextSettings[typedKey] !== previousSettings[typedKey]) {
          acc[typedKey] = isSensitiveSettingsKey(typedKey)
            ? "[REDACTED]"
            : nextSettings[typedKey];
        }

        return acc;
      },
      {} as Record<string, unknown>,
    );
    getLogger().info("Settings changed", diff);
  }

  /**
   * Notifies the renderer that the state has changed.
   *
   * @param newValue
   */
  public onDidAnyChange(_newValue: SharedState = this.store.store) {
    getMainWindow()?.webContents.send(
      IpcMessages.STATE_CHANGED,
      this.getSharedStateForRenderer(),
    );
  }

  private toStoredSettings(settings: SettingsState): SettingsState {
    const storedSettings = { ...settings };

    for (const key of SENSITIVE_SETTINGS_KEYS) {
      storedSettings[key] = encryptSecret(storedSettings[key]) as string | undefined;
    }

    return storedSettings;
  }

  private fromStoredSettings(settings: SettingsState): SettingsState {
    const runtimeSettings = { ...settings };

    for (const key of SENSITIVE_SETTINGS_KEYS) {
      runtimeSettings[key] = decryptSecret(runtimeSettings[key]) as string | undefined;
    }

    return runtimeSettings;
  }
}

let _stateManager: StateManager | null = null;

export function getStateManager() {
  if (!_stateManager) {
    _stateManager = new StateManager();
  }

  return _stateManager;
}
