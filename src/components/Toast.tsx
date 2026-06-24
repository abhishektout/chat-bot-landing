"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: any) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const widgetChatUrl = process.env.NEXT_PUBLIC_WIDGET_URL || "http://bot.a4tool.com";

  const showToast = (type: ToastType, title: string, description?: any) => {
    const id = Math.random().toString(36).substring(2, 9);

    let cleanTitle = typeof title === "string" ? title : JSON.stringify(title);
    let cleanDescription = description;

    if (description && typeof description !== "string") {
      if (Array.isArray(description)) {
        cleanDescription = description
          .map((err: any) => {
            if (err && typeof err === "object") {
              const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : null;
              return field ? `${field}: ${err.msg || "Invalid value"}` : (err.msg || JSON.stringify(err));
            }
            return String(err);
          })
          .join(", ");
      } else {
        cleanDescription = description.message || description.msg || JSON.stringify(description);
      }
    }

    setToasts((prev) => [...prev, { id, type, title: cleanTitle, description: cleanDescription }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container portal/position overlay */}
      <div
        className="fixed bottom-6 right-6 z-[99999] p-6 flex flex-col gap-3 max-w-md w-[calc(100%-48px)] pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      color: "text-emerald-500",
      icon: CheckCircle2,
      border: "border-emerald-500/20 dark:border-emerald-500/10",
      glow: "shadow-emerald-500/5",
    },
    error: {
      color: "text-red-500",
      icon: AlertCircle,
      border: "border-red-500/20 dark:border-red-500/10",
      glow: "shadow-red-500/5",
    },
    warning: {
      color: "text-amber-500",
      icon: AlertTriangle,
      border: "border-amber-500/20 dark:border-amber-500/10",
      glow: "shadow-amber-500/5",
    },
    info: {
      color: "text-[var(--accent)]",
      icon: Info,
      border: "border-[var(--glass-border)]",
      glow: "shadow-[var(--accent-glow)]",
    },
  };

  const current = config[toast.type] || config.info;
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      style={{ padding: '10px' }}
      className={`pointer-events-auto flex items-start gap-3.5 p-5 rounded-2xl glass border ${current.border} shadow-2xl ${current.glow} transition-colors`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${current.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-[var(--fg)] leading-snug">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-xs text-[var(--muted-fg)] mt-1 font-medium leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        aria-label="Close notification"
        onClick={onClose}
        className="cursor-pointer flex-shrink-0 text-[var(--muted-fg)] hover:text-[var(--fg)] p-1 hover:bg-[var(--muted-bg)] rounded-lg transition-all"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
