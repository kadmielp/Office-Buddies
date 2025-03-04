import { useEffect, useState } from "react";

import { ANIMATIONS, Animation } from "./clippy-animations";
import { EMPTY_ANIMATION, getRandomIdleAnimation } from "./clippy-animation-helpers";

type ClippyNamedStatus = 'welcome' | 'idle' | 'thinking' | 'waiting' | 'goodbye'

const WAIT_TIME = 6000;
const ENABLE_DRAG_DEBUG = false;

export function Clippy() {
  const [animation, setAnimation] = useState<Animation>(EMPTY_ANIMATION);
  const [status, setStatus] = useState<ClippyNamedStatus>('welcome');

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
      }, WAIT_TIME + randomIdleAnimation.length);
    };

    if (status === 'welcome' && animation === EMPTY_ANIMATION) {
      setAnimation(ANIMATIONS.Show);
      setTimeout(() => setStatus('idle'), ANIMATIONS.Show.length + 200);
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

  return (
    <div>
      <div className="app-drag" style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: ENABLE_DRAG_DEBUG ? 'blue' : 'transparent',
        opacity: 0.5,
        zIndex: 5,
      }}>
        <div className="app-no-drag" style={{
          position: 'absolute',
          height: '80px',
          width: '45px',
          backgroundColor: ENABLE_DRAG_DEBUG ? 'red' : 'transparent',
          top: 'calc(50% - 95px)',
          left: 'calc(50% - 60px)',
          zIndex: 10,
        }} onClick={() => {
          console.log('clicked')
        }}></div>
      </div>
      <img
        className="app-no-select"
        src={animation.src}
        draggable={false}
        alt="Clippy"
      />
    </div>
  );
}
