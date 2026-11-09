// The global voice shortcut reaches the buddy window; when the chat window is
// open, the press is passed on to its microphone through here.
const listeners = new Set<() => void>();

export function onChatVoiceToggle(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Returns false when no chat microphone is listening for the shortcut.
export function toggleChatVoice(): boolean {
  listeners.forEach((listener) => listener());
  return listeners.size > 0;
}
