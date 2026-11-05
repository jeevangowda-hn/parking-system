import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className = '',
    containerClassName = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full py-2 bg-surface-container-lowest border rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${
            error ? 'border-error text-error' : 'border-outline-variant'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-tertiary">{helperText}</p>}
    </div>
  );
});

