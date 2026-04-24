'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { Toast, ToastVariant } from '@/types';

interface ToastContextValue {
  showToast: (variant: ToastVariant, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (variant: ToastVariant, title: string, message?: string) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, variant, title, message }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-green-400 bg-green-50 text-green-900',
  error: 'border-red-400 bg-red-50 text-red-900',
  warning: 'border-amber-400 bg-amber-50 text-amber-900',
  info: 'border-blue-400 bg-blue-50 text-blue-900',
};

const icons: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-xl animate-toast-in ${variantStyles[t.variant]}`}
        >
          <span className="font-bold text-base mt-px shrink-0">{icons[t.variant]}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-snug">{t.title}</p>
            {t.message && (
              <p className="text-xs opacity-80 mt-1 leading-snug">{t.message}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
