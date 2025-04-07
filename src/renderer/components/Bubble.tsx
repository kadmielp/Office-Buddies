import { Chat } from './Chat';

interface BubbleProps {
  onDismiss?: () => void;
}

export function Bubble({ onDismiss }: BubbleProps) {
  return (
    <div className="bubble-container" style={{
      position: 'absolute',
      bottom: '120px',
      right: '20px',
      width: '350px',
      zIndex: 100,
    }}>
      <div className="bubble" style={{
        backgroundColor: '#ffffc8',
        border: '1px solid #000',
        borderRadius: '10px',
        boxShadow: '3px 3px 0 rgba(0, 0, 0, 0.2)',
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '14px',
        color: '#000',
        position: 'relative',
        maxHeight: 'calc(100vh - 200px)',
      }}>

        <Chat style={{
          maxHeight: 'calc(100vh - 230px)',
          overflow: 'auto',
          padding: '15px',
        }} />

        {/* Bubble tail/pointer */}
        <div className="bubble-tail" style={{
          position: 'absolute',
          bottom: '-20px',
          right: '30px',
          width: '20px',
          height: '20px',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '0',
            width: '18px',
            height: '18px',
            backgroundColor: '#ffffc8',
            border: '1px solid #000',
            borderRadius: '3px',
            transform: 'rotate(45deg)',
          }}></div>
        </div>
      </div>
    </div>
  );
}
