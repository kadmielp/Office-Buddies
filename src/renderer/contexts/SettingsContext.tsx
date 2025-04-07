import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Model } from '../../types/interfaces';

export interface SettingsState {
  model?: Model
}

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
}

// Default settings
const defaultSettings: SettingsState = {
  model: {
    name: "Meta Llama 3.1",
    path: "/Users/felix/Downloads/meta-llama-3-8b-instruct.Q4_K_M.gguf",
    version: "3.1",
  }
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
