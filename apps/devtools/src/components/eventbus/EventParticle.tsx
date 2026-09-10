import React, { useEffect, useState } from 'react';

interface EventParticleProps {
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete: () => void;
}

export function EventParticle({ color, startX, startY, endX, endY, onComplete }: EventParticleProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    let frame: number;

    function animate(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const x = startX + (endX - startX) * progress;
  const y = startY + (endY - startY) * progress;
  const opacity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;

  return (
    <circle
      cx={x}
      cy={y}
      r="4"
      fill={color}
      opacity={opacity}
      filter="url(#glow)"
    />
  );
}
