import './css/App.css'

import { useState, useCallback } from 'react'
import { Clippy } from './Clippy'
import { SettingsProvider } from '../contexts/SettingsContext'
import { ChatProvider } from '../contexts/ChatContext'
import { WindowPortal } from './WindowPortal'
import { Bubble } from './Bubble'

export function App() {
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);

  const toggleChatWindow = useCallback(() => {
    setIsChatWindowOpen(!isChatWindowOpen);
  }, [isChatWindowOpen]);

  const handleCloseChatWindow = useCallback(() => {
    setIsChatWindowOpen(false);
  }, []);

  return (
    <SettingsProvider>
      <ChatProvider>
        <div style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%'
        }}>
          <Clippy toggleChat={toggleChatWindow} />
          <WindowPortal
            width={450}
            height={600}
            isOpen={isChatWindowOpen}
            onClose={handleCloseChatWindow}
          >
            <Bubble />
          </WindowPortal>
        </div>
      </ChatProvider>
    </SettingsProvider>
  )
}
