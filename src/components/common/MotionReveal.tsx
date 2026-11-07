import React from 'react';
import { useScrollReveal, getRevealStyle, RevealDirection } from '../../utils/motion';

export type MotionVariant = 'fade-up' | 'fade-down' | 'slide-left' | 'slide-right' | 'fade';

interface MotionRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  variant?: MotionVariant | string;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  as?: keyof HTMLElementTagNameMap;
}

export const MotionReveal: React.FC<MotionRevealProps> = ({
  children,
  direction,
  variant,
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.1,
  as: Component = 'div',
}) => {
  // Map variant to direction if provided
  let effectiveDirection: RevealDirection = direction || 'up';
  if (variant) {
    if (variant === 'fade-up') effectiveDirection = 'up';
    else if (variant === 'fade-down') effectiveDirection = 'down';
    else if (variant === 'slide-left') effectiveDirection = 'left';
    else if (variant === 'slide-right') effectiveDirection = 'right';
    else if (variant === 'fade') effectiveDirection = 'fade';
  }

  const { ref, isVisible, prefersReducedMotion } = useScrollReveal({ threshold });

  const style = getRevealStyle(isVisible, effectiveDirection, delay, duration, prefersReducedMotion);

  return (
    // @ts-ignore dynamic tag
    <Component ref={ref} className={className} style={style}>
      {children}
    </Component>
  );
};
