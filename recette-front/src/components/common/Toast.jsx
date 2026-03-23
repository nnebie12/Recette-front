import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ToastContext } from '../../context/ToastContext';
const VARIANTS = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    iconColor: 'text-green-500',
    closeColor: 'text-green-400 hover:text-green-600',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-500',
    closeColor: 'text-red-400 hover:text-red-600',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-800',
    iconColor: 'text-yellow-500',
    closeColor: 'text-yellow-400 hover:text-yellow-600',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
    closeColor: 'text-blue-400 hover:text-blue-600',
  },
};

const ToastItem = ({ toast, onRemove }) => {
  const variant = VARIANTS[toast.type] || VARIANTS.info;
  const IconComponent = variant.icon;

  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(
      () => onRemove(toast.id),
      toast.duration ?? 4000
    );
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full
        ${variant.bg}`}
      role="alert"
    >
      <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${variant.iconColor}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-semibold ${variant.text}`}>{toast.title}</p>
        )}
        <p className={`text-sm ${variant.text} ${toast.title ? 'opacity-80' : ''}`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={`flex-shrink-0 ${variant.closeColor} transition-colors`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message, options = {}) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [
      ...prev,
      { id, message, type: 'info', duration: 4000, ...options },
    ]);
    return id;
  }, []);

  // Raccourcis pratiques
  const toast = {
    success: (message, opts) => add(message, { type: 'success', ...opts }),
    error: (message, opts) => add(message, { type: 'error', duration: 6000, ...opts }),
    warning: (message, opts) => add(message, { type: 'warning', ...opts }),
    info: (message, opts) => add(message, { type: 'info', ...opts }),
    custom: add,
    remove,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Zone d'affichage — coin inférieur droit */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;