import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 shadow-sm';

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-on-primary',
    secondary: 'bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface',
    outline: 'border border-primary text-primary hover:bg-primary-fixed/20',
    destructive: 'bg-error text-on-error hover:opacity-90',
    ghost: 'text-secondary hover:text-on-surface hover:bg-surface-container shadow-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}

