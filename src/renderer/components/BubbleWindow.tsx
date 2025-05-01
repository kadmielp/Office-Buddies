import { clippyApi } from '../clippyApi';
import { Chat } from './Chat';
import { Settings } from './Settings';
import { useBubbleView } from '../contexts/BubbleViewContext';

export function Bubble() {
  const { currentView, setCurrentView } = useBubbleView();

  const containerStyle = {
    width: 'calc(100% - 6px)',
    height: 'calc(100% - 6px)',
    margin: 0,
    overflow: 'hidden',
  }

  const chatStyle = {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-end',
    minHeight: 'calc(100% - 35px)',
    overflowAnchor: 'none' as const,
  };

  let content = null;

  if (currentView === 'chat') {
    content = <Chat style={chatStyle} />;
  } else if (currentView.startsWith('settings')) {
    content = <Settings onClose={() => setCurrentView('chat')} />;
  }

  return (
    <div className="bubble-container window" style={containerStyle}>
      <div className='app-drag title-bar'>
        <div className='title-bar-text'>Chat with Clippy</div>
        <div className="title-bar-controls app-no-drag">
          <button style={{ marginRight: '8px', paddingLeft: '8px', paddingRight: '8px' }} onClick={() => setCurrentView('settings')}>Settings</button>
          <button aria-label="Minimize" onClick={() => clippyApi.minimizeChatWindow()}></button>
          <button aria-label="Maximize" onClick={() => clippyApi.maximizeChatWindow()}></button>
          <button aria-label="Close" onClick={() => clippyApi.toggleChatWindow()}></button>
        </div>
      </div>
      <div className='window-content'>
        {content}
        <div className="scroll-anchor" />
      </div>
    </div>
  );
}
