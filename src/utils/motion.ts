import { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Standard luxury easing curve for KBYK:
 * Soft acceleration into a long, elegant deceleration.
 */
export const LUXURY_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const GENTLE_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'blur';

export interface MotionConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
}

/**
 * Hook to detect when an element enters the viewport using native IntersectionObserver.
 * Respects `prefers-reduced-motion`.
 */
export function useScrollReveal(config: MotionConfig = {}) {
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  // Check user's OS reduced-motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    // If reduced motion is preferred, reveal immediately without scroll delay
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    // Fallback if IntersectionObserver isn't supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion]);

  return { ref: elementRef, isVisible, prefersReducedMotion };
}

/**
 * Generate inline style transforms for clean GPU-accelerated reveals.
 */
export function getRevealStyle(
  isVisible: boolean,
  direction: RevealDirection = 'up',
  delayMs = 0,
  durationMs = 600,
  prefersReducedMotion = false
): React.CSSProperties {
  if (prefersReducedMotion) {
    return {
      opacity: 1,
      transform: 'none',
      transition: 'none',
    };
  }

  const baseTransition = `opacity ${durationMs}ms ${LUXURY_EASE} ${delayMs}ms, transform ${durationMs}ms ${LUXURY_EASE} ${delayMs}ms, filter ${durationMs}ms ${LUXURY_EASE} ${delayMs}ms`;

  let hiddenTransform = 'translate3d(0, 24px, 0)';
  let hiddenFilter = 'none';

  switch (direction) {
    case 'up':
      hiddenTransform = 'translate3d(0, 24px, 0)';
      break;
    case 'down':
      hiddenTransform = 'translate3d(0, -20px, 0)';
      break;
    case 'left':
      hiddenTransform = 'translate3d(24px, 0, 0)';
      break;
    case 'right':
      hiddenTransform = 'translate3d(-24px, 0, 0)';
      break;
    case 'scale':
      hiddenTransform = 'scale3d(0.96, 0.96, 1)';
      break;
    case 'blur':
      hiddenTransform = 'translate3d(0, 16px, 0)';
      hiddenFilter = 'blur(6px)';
      break;
    case 'fade':
    default:
      hiddenTransform = 'none';
      break;
  }

  if (isVisible) {
    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
      filter: 'none',
      transition: baseTransition,
      willChange: 'opacity, transform',
    };
  }

  return {
    opacity: 0,
    transform: hiddenTransform,
    filter: hiddenFilter,
    transition: baseTransition,
    willChange: 'opacity, transform',
  };
}
