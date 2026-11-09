import { useVoiceInput } from "./useVoiceInput";

type Voice = ReturnType<typeof useVoiceInput>;

// The microphone button: idle, recording (with a level ring), transcribing.
export function MicButton({
  voice,
  className = "",
  disabled = false,
}: {
  voice: Voice;
  className?: string;
  disabled?: boolean;
}) {
  if (!voice.enabled) return null;

  const recording = voice.state === "recording" || voice.state === "starting";
  const transcribing = voice.state === "transcribing";
  const label = recording
    ? "Stop recording and transcribe (Enter). Esc discards it."
    : transcribing
      ? "Transcribing…"
      : "Speak instead of typing";

  return (
    <button
      type="button"
      className={`voice-mic-button${recording ? " is-recording" : ""}${
        transcribing ? " is-transcribing" : ""
      } ${className}`}
      aria-label={label}
      aria-pressed={recording}
      title={label}
      disabled={disabled || transcribing}
      onMouseDown={(event) => event.preventDefault()}
      onClick={voice.toggle}
      style={
        recording
          ? ({ "--voice-level": voice.level.toFixed(2) } as React.CSSProperties)
          : undefined
      }
    >
      {transcribing ? (
        <span className="voice-mic-spinner" aria-hidden="true" />
      ) : (
        <svg
          className="voice-mic-icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
        >
          {recording ? (
            <rect
              x="7"
              y="7"
              width="10"
              height="10"
              rx="2"
              fill="currentColor"
            />
          ) : (
            <>
              <rect
                x="9"
                y="3"
                width="6"
                height="11"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      )}
    </button>
  );
}

// A one-line problem report under the input (no microphone, model missing…).
export function VoiceError({
  voice,
  className = "",
}: {
  voice: Voice;
  className?: string;
}) {
  if (!voice.error) return null;
  return (
    <div className={`voice-error ${className}`} role="status">
      <span>{voice.error}</span>
      <button
        type="button"
        className="voice-error-dismiss"
        aria-label="Dismiss"
        onClick={voice.clearError}
      >
        ×
      </button>
    </div>
  );
}
