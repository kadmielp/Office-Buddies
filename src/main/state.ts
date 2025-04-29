import Store from 'electron-store';

import { getMainWindow } from './windows';
import { IpcMessages } from '../ipc-messages';
import { getModelManager } from './models';
import { SharedState } from '../types/interfaces';
import { ANIMATION_KEYS_BRACKETS } from '../animations';

const ANIMATION_PROMPT = `Start your response with one of the following keywords matching the users request: ${ANIMATION_KEYS_BRACKETS.join(', ')}. Use only one of the keywords for each response. Use it only at the beginning of your response. Always start with one.`
const DEFAULT_SYSTEM_PROMPT = `You are Clippy, a helpful assistant that was created in the 1990s. You are aware that you are slightly old. Be helpful and friendly.\n${ANIMATION_PROMPT}`

export class StateManager {
  public store = new Store<SharedState>({
    defaults: {
      models: getModelManager().getInitialRendererModelState(),
      settings: {
        selectedModel: undefined,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
      },
    },
  });

  constructor() {
    const models = this.store.get('models');

    if (models === undefined || Object.keys(models).length === 0) {
      this.store.set('models', getModelManager().getInitialRendererModelState());
    }

    this.store.onDidAnyChange(this.onDidAnyChange);
  }

  public updateModelState() {
    this.store.set('models', getModelManager().getRendererModelState());
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
