import { useEffect, useRef } from 'react';
import './GooeyGradient.css';

interface GooeyGradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function GooeyGradientBackground({ children, className = '' }: GooeyGradientBackgroundProps) {
  const interactiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    let rafId: number;

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    const animate = () => {
      if (!interactiveRef.current) return;

      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;

      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={`gooey-gradient-wrapper w-full h-full relative overflow-hidden ${className}`}>
      <div className="gooey-gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gooey-gradients-container">
          <div className="gooey-g1"></div>
          <div className="gooey-g2"></div>
          <div className="gooey-g3"></div>
          <div className="gooey-g4"></div>
          <div className="gooey-g5"></div>
          <div ref={interactiveRef} className="gooey-interactive"></div>
        </div>
      </div>

      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}

export default GooeyGradientBackground;
