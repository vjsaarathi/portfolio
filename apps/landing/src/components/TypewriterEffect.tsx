import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  text: string;
  speed?: number;
}

export function TypewriterEffect({ text, speed = 80 }: TypewriterEffectProps) {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let index = 0;
    setTypedText('');
    const interval = setInterval(() => {
      setTypedText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="hero__title animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <span className="hero__typed">{typedText}</span>
      <span className="hero__cursor" />
    </div>
  );
}
