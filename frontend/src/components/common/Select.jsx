import React, { forwardRef } from 'react';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    icon: Icon,
    options = [],
    children,
    className = '',
    containerClassName = '',
    id,
    ...props
  },
  ref
) {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full py-2 bg-surface-container-lowest border rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer ${
            Icon ? 'pl-9 pr-8' : 'px-3 pr-8'
          } ${
            error ? 'border-error text-error' : 'border-outline-variant'
          } ${className}`}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-tertiary">{helperText}</p>}
    </div>
  );
});

