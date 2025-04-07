
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'clippy';
}

export function Message({ message }: { message: Message }) {
  return (
    <div>
      <p>{message.content}</p>
    </div>
  );
}
