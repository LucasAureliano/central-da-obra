import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'rectangular' | 'circular' | 'glass';
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '8px', 
  variant = 'rectangular',
  className = '',
  style
}: SkeletonProps) {
  
  const baseClass = variant === 'glass' ? 'skeleton-glass' : 'skeleton';
  
  return (
    <div 
      className={`${baseClass} ${className}`}
      style={{
        width,
        height,
        borderRadius: variant === 'circular' ? '50%' : borderRadius,
        ...style
      }}
    />
  );
}
