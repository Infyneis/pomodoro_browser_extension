import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TimerMode } from '../../../lib/types';

interface ConfettiProps {
  isActive: boolean;
  mode: TimerMode | null;
}

export function Confetti({ isActive, mode }: ConfettiProps) {
  useEffect(() => {
    if (!isActive || !mode) return;

    const colors = mode === 'work'
      ? ['#9B7EDE', '#A78BFA', '#C4B5FD', '#DDD6FE', '#7C3AED']
      : ['#6EE7B7', '#A7F3D0', '#7DD3FC', '#BAE6FD', '#5EEAD4'];

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        ticks: 200,
        gravity: 1.2,
        scalar: 1.2,
        drift: 0,
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        ticks: 200,
        gravity: 1.2,
        scalar: 1.2,
        drift: 0,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors,
      ticks: 300,
      gravity: 0.8,
      scalar: 1.2,
    });

    frame();

    return () => {
      confetti.reset();
    };
  }, [isActive, mode]);

  return null;
}
