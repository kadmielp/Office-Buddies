import { clippyApi } from '../clippyApi';
import { Chat } from './Chat';

export function Bubble() {
  const containerStyle = {
    width: 'calc(100% - 6px)',
    height: 'calc(100% - 6px)',
    margin: 0,
    overflow: 'hidden',
  }

  const chatStyle = {
    maxHeight: 'calc(100% - 30px)',
    overflow: 'auto' as const,
    padding: '15px',
    height: 'calc(100% - 30px)'
  };

  return (
    <div className="bubble-container window" style={containerStyle}>
      <div className='app-drag title-bar'>
        <div className='title-bar-text'>Chat with Clippy</div>
        <div className="title-bar-controls app-no-drag">
          <button aria-label="Minimize" onClick={() => clippyApi.minimizeChatWindow()}></button>
          <button aria-label="Maximize" onClick={() => clippyApi.maximizeChatWindow()}></button>
          <button aria-label="Close" onClick={() => clippyApi.toggleChatWindow()}></button>
        </div>
      </div>
      <div className='window-content'>
        <Chat style={chatStyle} />
      </div>
    </div>
  );
}
