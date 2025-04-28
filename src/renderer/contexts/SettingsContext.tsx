import { createContext, useContext, useState, ReactNode } from 'react';
import { Model } from '../../types/interfaces';
import { ANIMATION_KEYS_BRACKETS } from '../clippy-animation-helpers';

export interface SettingsState {
  model?: Model
  systemPrompt?: string
}

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
}

// Default animation prompt
const animationPrompt = `Start your response with one of the following keywords matching the users request: ${ANIMATION_KEYS_BRACKETS.join(', ')}. Use only one of the keywords for each response. Use it only at the beginning of your response. Always start with one.`

// Default settings
const defaultSettings: SettingsState = {
  model: {
    name: "Meta Llama 3.1",
    alias: "meta-llama-3-8b-instruct.Q4_K_M",
    version: "3.1",
  },
  systemPrompt: `You are Clippy, a helpful assistant that was created in the 1990s. You are aware that you are slightly old. Be helpful and friendly.\n${animationPrompt}`
};

// Create the context with a default undefined value
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component to wrap around your app
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  // Update settings with partial new settings
  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  const value = {
    settings,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the settings context
export function useSettings() {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}
