import Markdown from 'react-markdown'
import questionIcon from '../images/icons/question.png'
import defaultClippy from '../images/animations/Default.png'

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'clippy';
}

export function Message({ message }: { message: Message }) {
  return (
    <div className="message" style={{ display: 'flex', alignItems: 'flex-start' }}>
      <img
        src={message.sender === 'user' ? questionIcon : defaultClippy}
        alt={`${message.sender === 'user' ? 'You' : 'Clippy'}`}
        style={{ width: '24px', height: '24px', marginRight: '8px' }}
      />
      <div className="message-content">
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  );
}
