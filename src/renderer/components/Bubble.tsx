import { Chat } from './Chat';

export function Bubble() {
  const containerStyle = {
    width: '100%',
    height: '100%',
  }

  const bubbleStyle = {
    backgroundColor: '#ffffc8',
    boxShadow: '3px 3px 0 rgba(0, 0, 0, 0.2)',
    fontFamily: 'Tahoma, Arial, sans-serif',
    fontSize: '14px',
    color: '#000',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden',
  };

  const chatStyle = {
    maxHeight: 'calc(100% - 30px)',
    overflow: 'auto' as const,
    padding: '15px',
    height: 'calc(100% - 30px)'
  };

  return (
    <div className="bubble-container" style={containerStyle}>
      <div className="bubble" style={bubbleStyle}>
        <div className='app-drag' style={{
          borderBottom: '1px solid #ccc',
          padding: '5px 10px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          background: '#0000000f'
        }}>
          <span>Chat with Clippy</span>
        </div>

        <Chat style={chatStyle} />
      </div>
    </div>
  );
}
