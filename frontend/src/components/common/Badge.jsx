import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) {
  const variants = {
    default: 'bg-surface-container text-on-surface-variant border border-outline-variant/60',
    primary: 'bg-primary-fixed/40 text-on-primary-fixed-variant border border-primary/20',
    success: 'bg-[#ECFDF5] text-primary border border-primary/20',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-error-container text-on-error-container border border-error/20',
    info: 'bg-secondary-container text-on-secondary-container border border-secondary/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success' || variant === 'primary'
              ? 'bg-primary animate-pulse'
              : variant === 'warning'
              ? 'bg-amber-600'
              : variant === 'danger'
              ? 'bg-error'
              : 'bg-secondary'
          }`}
        />
      )}
      {children}
    </span>
  );
}

