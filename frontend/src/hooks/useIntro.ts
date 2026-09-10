import { useState, useEffect, useCallback, useRef } from 'react';
import { IntroStep } from '../types/intro.types';
import { storage } from '../utils/storage';

export const useIntro = () => {
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(() => storage.getIntroSeen());
  const [step, setStep] = useState<IntroStep>(() => (storage.getIntroSeen() ? 'CLOSED' : 'INTRO'));
  const isTransitioningRef = useRef<boolean>(false);

  // Transition to auth screen (triggered by scroll or video completion)
  const transitionToAuth = useCallback(() => {
    if (isTransitioningRef.current || step === 'CLOSED' || step === 'AUTH_VISIBLE') return;
    isTransitioningRef.current = true;
    storage.setIntroSeen(true);
    setHasSeenIntro(true);
    setStep('AUTH_VISIBLE');
  }, [step]);

  // Explicit close button trigger
  const closeIntro = useCallback(() => {
    isTransitioningRef.current = true;
    storage.setIntroSeen(true);
    setHasSeenIntro(true);
    setStep('CLOSED');
  }, []);

  // Video playback completion trigger
  const onVideoEnded = useCallback(() => {
    transitionToAuth();
  }, [transitionToAuth]);

  // Reset intro seen status (useful for testing or re-triggering intro)
  const resetIntro = useCallback(() => {
    storage.clearIntroSeen();
    isTransitioningRef.current = false;
    setHasSeenIntro(false);
    setStep('INTRO');
  }, []);

  // Scroll and touch event handling while intro is active
  useEffect(() => {
    if (step === 'CLOSED' || step === 'AUTH_VISIBLE') {
      return;
    }

    let touchStartY = 0;
    const scrollThreshold = 15; // Minimum scroll delta

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > scrollThreshold) {
        transitionToAuth();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      if (Math.abs(touchStartY - currentY) > scrollThreshold * 2) {
        transitionToAuth();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'Space', 'Enter'].includes(e.code)) {
        transitionToAuth();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, transitionToAuth]);

  return {
    step,
    setStep,
    hasSeenIntro,
    transitionToAuth,
    closeIntro,
    onVideoEnded,
    resetIntro,
  };
};
