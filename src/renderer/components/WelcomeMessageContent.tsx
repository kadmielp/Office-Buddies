import React from 'react';
import { useBubbleView } from '../contexts/BubbleViewContext';

export const WelcomeMessageContent: React.FC = () => {
  const { setCurrentView } = useBubbleView();

  return (
    <div>
      <strong>Welcome to Clippy!</strong>
      <p>
        This little app is a love letter and homage to the late, great Clippy, the assistant from Microsoft Office 1997. The character was designed by illustrator Kevan Atteberry, who created more than 15 potential characters for Microsoft's Office Assistants. It is <i>not</i> affiliated, approved, or supported by Microsoft. Consider it software satire.
      </p>
      <p>
        This version of Clippy can run a Large Language Model (LLM) locally, so that you can chat with it offline.
      </p>
      <p>It supports a variety of models, including Google's Gemma3, Meta's Llama3, or Microsoft's Phi-4 Mini. We've already started downloading the smallest model for you in the background. You can choose a bigger, more powerful model in the settings.</p>
      <button
        onClick={() => setCurrentView('settings-model')}
      >
        Open Model Settings
      </button>
    </div>
  );
};
