import { useEffect, useState } from "react";

import { ANIMATIONS, Animation } from "../clippy-animations";
import { EMPTY_ANIMATION, getRandomIdleAnimation } from "../clippy-animation-helpers";
import { Bubble } from "./Bubble";

type ClippyNamedStatus = 'welcome' | 'idle' | 'thinking' | 'waiting' | 'goodbye'

const WAIT_TIME = 6000;
const ENABLE_DRAG_DEBUG = false;

export function Clippy() {
  const [animation, setAnimation] = useState<Animation>(EMPTY_ANIMATION);
  const [status, setStatus] = useState<ClippyNamedStatus>('welcome');
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;

    const playRandomIdleAnimation = () => {
      if (status !== 'idle') return;

      const randomIdleAnimation = getRandomIdleAnimation(animation);
      setAnimation(randomIdleAnimation);

      // Reset back to default after 6 seconds and schedule next animation
      timeoutId = window.setTimeout(() => {
        setAnimation(ANIMATIONS.Default);
        timeoutId = window.setTimeout(playRandomIdleAnimation, WAIT_TIME);
      }, randomIdleAnimation.length);
    };

    if (status === 'welcome' && animation === EMPTY_ANIMATION) {
      setAnimation(ANIMATIONS.Show);
      setTimeout(() => {
        setStatus('idle');
        setShowBubble(true);
      }, ANIMATIONS.Show.length + 200);
    } else if (status === 'idle') {
      if (!timeoutId) {
        playRandomIdleAnimation()
      }
    }

    // Clean up timeouts when component unmounts or status changes
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [status]);

  const handleLetterHelp = () => {
    console.log('User wants help with writing a letter');
    setShowBubble(false);
  };

  const handleNoHelp = () => {
    console.log('User wants to type without help');
    setShowBubble(false);
  };

  const handleDismiss = () => {
    console.log('User doesn\'t want to see this tip again');
    setShowBubble(false);
  };

  return (
    <div>
      <div className="app-drag" style={{
        position: 'absolute',
        height: '93px',
        width: '124px',
        backgroundColor: ENABLE_DRAG_DEBUG ? 'blue' : 'transparent',
        opacity: 0.5,
        zIndex: 5,
      }}>
        <div className="app-no-drag" style={{
          position: 'absolute',
          height: '80px',
          width: '45px',
          backgroundColor: ENABLE_DRAG_DEBUG ? 'red' : 'transparent',
          zIndex: 10,
          right: '40px',
          top: '2px',
        }} onClick={() => {
            setShowBubble(!showBubble);
        }}></div>
      </div>
      {showBubble && (
        <Bubble onDismiss={handleDismiss} />
      )}
      <img
        className="app-no-select"
        src={animation.src}
        draggable={false}
        alt="Clippy"
      />
    </div>
  );
}
