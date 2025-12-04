import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface GenerationModalProps {
  isOpen: boolean;
  progress?: number; // 0-100
  onClose?: () => void;
}

export const GenerationModal: React.FC<GenerationModalProps> = ({
  isOpen,
  progress = 0,
  onClose,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0); // Stable percentage for display
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);
  const lastPercentageRef = useRef(0);

  // Ensure component is mounted (for SSR compatibility)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Smooth progress animation - smoothly follow the progress prop
  useEffect(() => {
    if (!isOpen) {
      setDisplayProgress(0);
      setDisplayPercentage(0);
      lastProgressRef.current = 0;
      lastPercentageRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Prevent body scroll when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

      // Smooth animation function using requestAnimationFrame
      const animate = () => {
        const targetProgress = Math.max(0, Math.min(100, progress || 0));
        const current = lastProgressRef.current;
        
        // Only update if there's a meaningful difference (avoid micro-oscillations)
        if (Math.abs(targetProgress - current) > 0.01) {
          // Smooth interpolation - move towards target gradually
          const diff = targetProgress - current;
          const step = diff * 0.08; // Small step for smooth, gradual movement
          
          const newProgress = current + step;
          const finalProgress = Math.abs(diff) < 0.1 ? targetProgress : newProgress;
          
          lastProgressRef.current = finalProgress;
          setDisplayProgress(finalProgress);
          
          // Update percentage display only when it changes by at least 1%
          const newPercentage = Math.floor(finalProgress);
          if (newPercentage !== lastPercentageRef.current) {
            lastPercentageRef.current = newPercentage;
            setDisplayPercentage(newPercentage);
          }
        } else if (Math.abs(targetProgress - current) > 0.001) {
          // Snap to target when very close to avoid infinite tiny updates
          lastProgressRef.current = targetProgress;
          setDisplayProgress(targetProgress);
          
          const newPercentage = Math.floor(targetProgress);
          if (newPercentage !== lastPercentageRef.current) {
            lastPercentageRef.current = newPercentage;
            setDisplayPercentage(newPercentage);
          }
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, progress]);

  if (!isOpen || !mounted) return null;
  
  // Safety check for document.body
  if (typeof document === 'undefined' || !document.body) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        style={{
          animation: isOpen ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out',
        }}
      />

      {/* Modal Content */}
      <div
        className="relative bg-white dark:bg-zinc-800/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-zinc-700/50 w-full max-w-md transform transition-all duration-300 animate-modal-float"
        style={{
          animation: isOpen
            ? 'modalEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), modalFloat 3s ease-in-out infinite'
            : 'modalExit 0.3s ease-in',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(139, 92, 246, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Music Note Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative animate-icon-rotate">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30 animate-icon-glow">
              <svg
                className="w-12 h-12 animate-music-note"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="musicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path
                  d="M9 18V5l9-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm9-5c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"
                  stroke="url(#musicGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Text */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-zinc-100 mb-2 animate-text-fade">
          Generating your music...
        </h2>

        {/* Sub-text */}
        <p className="text-sm text-center text-gray-500 dark:text-zinc-400 mb-8 animate-text-fade-delay">
          This may take a few moments
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-2.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full relative"
              style={{
                width: `${Math.max(0, Math.min(100, displayProgress || 0))}%`,
                transition: 'none', // No CSS transition - we handle animation in JS
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-center mb-6">
          <span className="text-2xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent tabular-nums">
            {displayPercentage}%
          </span>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-bounce"
              style={{
                animationDelay: `${index * 0.15}s`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalExit {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes modalFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.01);
          }
        }

        @keyframes iconRotate {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes iconGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.5);
          }
        }

        @keyframes musicNote {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes textFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-modal-float {
          animation: modalFloat 3s ease-in-out infinite;
        }

        .animate-icon-rotate {
          animation: iconRotate 4s ease-in-out infinite;
        }

        .animate-icon-glow {
          animation: iconGlow 2s ease-in-out infinite;
        }

        .animate-music-note {
          animation: musicNote 2s ease-in-out infinite;
        }

        .animate-text-fade {
          animation: textFade 0.6s ease-out;
        }

        .animate-text-fade-delay {
          animation: textFade 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );

  // Use portal to render modal at document body level
  try {
    return createPortal(modalContent, document.body);
  } catch (error) {
    console.error('Error rendering modal:', error);
    // Fallback: render directly if portal fails
    return modalContent;
  }
};

