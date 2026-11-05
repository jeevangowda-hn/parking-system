import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm ${
        hover ? 'hover:border-primary hover:shadow-md transition-all cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

