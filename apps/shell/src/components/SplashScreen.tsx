import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/splash-screen.css';

interface SplashScreenProps {
  children: React.ReactNode;
}

export function SplashScreen({ children }: SplashScreenProps) {
  // Check session storage so splash screen only runs ONCE per browser session / shell load
  const [shouldAnimate] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('nrssi_splash_shown');
    } catch {
      return true;
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem('nrssi_splash_shown', 'true');
          } catch (e) {
            // ignore storage errors
          }
        },
      });

      // 1. Initial State
      gsap.set(lettersRef.current, { y: '100%', opacity: 0 });
      gsap.set(progressLineRef.current, { width: '0%', opacity: 0 });
      gsap.set(mainRef.current, { autoAlpha: 0 });

      // 2. Splash Sequence: Elegant reveal
      tl.to(lettersRef.current, {
        duration: 1.2,
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power4.out',
      })
      // Subtle breathing effect (slight scale)
      .to(lettersRef.current, {
        duration: 2,
        scale: 1.02,
        stagger: 0.05,
        ease: 'sine.inOut',
      }, '-=0.5')
      // Minimal progress line expands
      .to(progressLineRef.current, {
        duration: 1.5,
        width: '200px',
        opacity: 0.5,
        ease: 'expo.inOut',
      }, '-=2.2')

      // 3. Splash Exit: Fade out gently
      .to(lettersRef.current, {
        duration: 0.8,
        opacity: 0,
        y: -20,
        stagger: 0.05,
        ease: 'power2.in',
      }, '+=0.2')
      .to(progressLineRef.current, {
        duration: 0.5,
        scaleX: 0,
        opacity: 0,
        ease: 'power2.in',
      }, '<')
      // Hide splash container
      .set(splashRef.current, { display: 'none' })

      // 4. Main Content Reveal: Clean and structured
      .to(mainRef.current, {
        duration: 1,
        autoAlpha: 1,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [shouldAnimate]);

  const addToLetters = (el: HTMLSpanElement | null) => {
    if (el && !lettersRef.current.includes(el)) {
      lettersRef.current.push(el);
    }
  };

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  const letters = ['N', 'R', 'S', 'S', 'I'];

  return (
    <div ref={containerRef} className="splash-wrapper">
      {/* Splash Screen Overlay */}
      <div ref={splashRef} className="splash-overlay">
        <div className="splash-letters">
          {letters.map((char, index) => (
            <span key={index} ref={addToLetters} className="splash-char">
              {char}
            </span>
          ))}
        </div>
        <div ref={progressLineRef} className="splash-line"></div>
      </div>

      {/* Main App Content Container */}
      <div ref={mainRef} className="splash-main-content">
        {children}
      </div>
    </div>
  );
}
