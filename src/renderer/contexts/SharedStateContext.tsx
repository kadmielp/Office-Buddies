import { createContext, useContext, useEffect, useState } from "react";
import { SharedState } from "../../sharedState";
import { clippyApi } from "../clippyApi";

const EMPTY_SHARED_STATE: SharedState = {
  models: {},
  settings: {
    selectedModel: undefined,
    systemPrompt: undefined,
    alwaysOnTop: false,
    alwaysOpenChat: true,
  },
};

export const SharedStateContext = createContext<SharedState>(EMPTY_SHARED_STATE);

export const SharedStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [sharedState, setSharedState] = useState<SharedState>(EMPTY_SHARED_STATE);

  useEffect(() => {
    const fetchSharedState = async () => {
      const state = await clippyApi.getFullState();
      setSharedState(state);
    };

    fetchSharedState();

    clippyApi.offStateChanged();
    clippyApi.onStateChanged((state) => {
      setSharedState(state);
    });

    return () => {
      clippyApi.offStateChanged();
    };
  }, []);

  return (
    <SharedStateContext.Provider value={sharedState}>
      {children}
    </SharedStateContext.Provider>
  )
};

export const useSharedState = () => {
  const sharedState = useContext(SharedStateContext);

  if (!sharedState) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }

  return sharedState;
};
