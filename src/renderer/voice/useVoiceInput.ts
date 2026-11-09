import { useCallback, useEffect, useRef, useState } from "react";

import { VoiceStatus } from "../../shared/voice";
import { getAgentPack, getAnimationKeys } from "../agent-packs";
import { clippyApi } from "../clippyApi";
import { useChat } from "../contexts/ChatContext";
import { useSharedState } from "../contexts/SharedStateContext";
import {
  cancelRecording,
  getLevel,
  isRecording,
  startRecording,
  stopRecording,
} from "./recorder";

export type VoiceInputState =
  | "idle"
  // Opening the microphone: looks like recording, so the click feels instant.
  | "starting"
  | "recording"
  | "transcribing";

// The animation the buddy plays while it listens; packs without "Hearing"
// look up instead.
const LISTENING_ANIMATIONS = ["Hearing", "Hearing_1", "LookUp", "GetAttention"];

export function useVoiceStatus(): VoiceStatus | null {
  const [status, setStatus] = useState<VoiceStatus | null>(null);

  useEffect(() => {
    let alive = true;
    void clippyApi.getVoiceStatus().then((value) => alive && setStatus(value));
    const off = clippyApi.onVoiceStatus(setStatus);
    return () => {
      alive = false;
      off();
    };
  }, []);

  return status;
}

// Microphone button behaviour shared by the chat window and the mini chat:
// click to start, click again to stop and transcribe, cancel to discard.
// The text goes to onText for the user to review before sending.
export function useVoiceInput(onText: (text: string) => void) {
  const { settings } = useSharedState();
  const { setAnimationKey } = useChat();
  const status = useVoiceStatus();
  const [state, setState] = useState<VoiceInputState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;
  const stopRef = useRef<() => void>(() => {});
  // This button started the current recording (the other chat must not end it).
  const ownsRecording = useRef(false);
  // Clicked stop (or cancel) while the microphone was still opening.
  const pendingEnd = useRef<"stop" | "cancel" | null>(null);

  const enabled = Boolean(settings.voiceEnabled);
  const ready =
    enabled &&
    Boolean(status?.runtimeAvailable) &&
    status?.model.state === "ready";

  const listeningAnimation = (() => {
    const keys = getAnimationKeys(getAgentPack(settings.selectedAgent));
    return LISTENING_ANIMATIONS.find((key) => keys.includes(key)) ?? "";
  })();

  // Start the speech server early so the first recording comes back fast.
  useEffect(() => {
    if (ready) void clippyApi.warmVoice();
  }, [ready]);

  // While recording: a level meter, and the buddy keeps listening.
  useEffect(() => {
    if (state !== "recording") {
      setLevel(0);
      return;
    }
    if (listeningAnimation) setAnimationKey(listeningAnimation);
    const meter = window.setInterval(() => setLevel(getLevel()), 80);
    const animation = window.setInterval(() => {
      if (listeningAnimation) setAnimationKey(listeningAnimation);
    }, 2500);
    return () => {
      window.clearInterval(meter);
      window.clearInterval(animation);
    };
  }, [state, listeningAnimation, setAnimationKey]);

  const stop = useCallback(async () => {
    if (!isRecording() || !ownsRecording.current) return;
    ownsRecording.current = false;
    const pcm = stopRecording();
    if (!pcm) {
      setState("idle");
      setError("I didn't hear anything. Check the microphone and try again.");
      return;
    }
    setState("transcribing");
    try {
      const { text } = await clippyApi.transcribeVoice(pcm);
      if (text) {
        onTextRef.current(text);
      } else {
        setError("I couldn't make out any words. Try again.");
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setState("idle");
    }
  }, []);
  stopRef.current = () => void stop();

  const start = useCallback(async () => {
    setError(null);
    pendingEnd.current = null;
    setState("starting");
    try {
      // Ask fresh: a click right after opening can beat the first status load.
      const status = await clippyApi.getVoiceStatus();
      if (!status.runtimeAvailable) {
        throw new Error(
          'Voice input is missing from this build. Run "npm run prepare:whisper" and restart.',
        );
      }
      if (status.model.state !== "ready") {
        throw new Error(
          "Download the voice model first: Settings > Advanced > Voice input.",
        );
      }
      if (isRecording()) {
        throw new Error(
          "The microphone is already recording in the other chat.",
        );
      }
      await startRecording(settings.voiceMicrophoneId || undefined, () =>
        stopRef.current(),
      );
      ownsRecording.current = true;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
      setState("idle");
      return;
    }

    const end = pendingEnd.current;
    pendingEnd.current = null;
    if (end === "cancel") {
      cancelRecording();
      ownsRecording.current = false;
      setState("idle");
    } else {
      setState("recording");
      if (end === "stop") void stop();
    }
  }, [settings.voiceMicrophoneId, stop]);

  const toggle = useCallback(() => {
    if (state === "recording") void stop();
    else if (state === "starting") pendingEnd.current = "stop";
    else if (state === "idle") void start();
  }, [state, start, stop]);

  const cancel = useCallback(() => {
    if (state === "starting") {
      pendingEnd.current = "cancel";
      return;
    }
    if (ownsRecording.current) cancelRecording();
    ownsRecording.current = false;
    setState("idle");
  }, [state]);

  // Never leave the microphone open behind an unmounted button.
  useEffect(
    () => () => {
      if (ownsRecording.current) cancelRecording();
    },
    [],
  );

  return {
    enabled,
    ready,
    state,
    listening: state === "recording" || state === "starting",
    level,
    error,
    clearError: () => setError(null),
    toggle,
    stop,
    cancel,
  };
}
