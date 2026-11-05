import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);
  const warning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning, toasts }}>
      {children}
      {/* Toast Render container */}
      <div className="toast-container" role="region" aria-live="polite">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast flex items-start justify-between gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 ${
              t.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : t.type === 'error'
                ? 'bg-red-50 text-red-900 border-red-200'
                : t.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-white text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex-1">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 font-bold ml-2 text-base leading-none"
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

