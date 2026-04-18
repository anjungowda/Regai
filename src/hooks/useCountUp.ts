import { useState, useEffect } from 'react';

// Easing function: easeOutQuart
const easeOutQuart = (x: number): number => {
  return 1 - Math.pow(1 - x, 4);
};

export function useCountUp(target: number, duration: number = 800) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Only trigger when target is a real number > 0
    if (typeof target !== 'number' || target === 0) {
      setCount(0);
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const currentVal = Math.floor(target * easeOutQuart(percentage));
      setCount(currentVal);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return hasStarted && target > 0 ? count : target;
}
