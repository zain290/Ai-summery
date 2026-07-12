import React, { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  opacity?: number;
  stagger?: number;
  start?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 1,
  y = 30,
  opacity = 0,
  stagger = 0,
  start = 'top 85%',
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: opacity, y: y },
      {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: start,
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      if (ScrollTrigger.getById(el.id)) {
        ScrollTrigger.getById(el.id)?.kill();
      }
    };
  }, [delay, duration, y, opacity, stagger, start]);

  return (
    <div ref={containerRef} className={className} {...rest}>
      {children}
    </div>
  );
};

export default ScrollReveal;
