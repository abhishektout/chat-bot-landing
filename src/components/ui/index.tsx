"use client";

import React from "react";
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

// ==========================================
// 1. BUTTON COMPONENT
// ==========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, variant = "primary", size = "md", isLoading, icon, disabled, ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary: "bg-[var(--accent)] hover:opacity-95 text-white shadow-lg hover:shadow-[var(--accent-glow)]",
      secondary: "bg-[var(--muted-bg)] hover:bg-[var(--card-border)] text-[var(--fg)] border border-[var(--card-border)]",
      outline: "bg-transparent border border-[var(--card-border)] hover:border-[var(--accent)] text-[var(--fg)] hover:bg-[var(--accent-glow)]",
      danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/10",
      ghost: "bg-transparent hover:bg-[var(--muted-bg)] text-[var(--fg)]",
    };

    const sizes = {
      sm: "p-[10px] text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && icon && <span className="flex items-center">{icon}</span>}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ==========================================
// 2. INPUT COMPONENT
// ==========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--fg)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div style={{
              position: "absolute",
              left: "12px",
              color: "var(--muted-fg)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
            }}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            style={{
              width: "100%",
              padding: icon ? "11px 14px 11px 36px" : "11px 14px",
              borderRadius: "10px",
              background: "var(--muted-bg)",
              border: error ? "1.5px solid #ef4444" : "1px solid var(--card-border)",
              color: "var(--fg)",
              fontSize: "14px",
              fontWeight: 500,
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={e => {
              if (!error) {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
              }
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = error ? "#ef4444" : "var(--card-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
            className={className}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#ef4444", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
            <AlertCircle style={{ width: "13px", height: "13px" }} />
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ==========================================
// 3. SELECT COMPONENT
// ==========================================
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--fg)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          <select
            ref={ref}
            style={{
              width: "100%",
              padding: "11px 36px 11px 14px",
              borderRadius: "10px",
              background: "var(--muted-bg)",
              border: error ? "1.5px solid #ef4444" : "1px solid var(--card-border)",
              color: "var(--fg)",
              fontSize: "14px",
              fontWeight: 600,
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
              appearance: "none",
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            className={className}
            {...props}
          >
            {children}
          </select>
          <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted-fg)" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
        {error && (
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#ef4444", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
            <AlertCircle style={{ width: "13px", height: "13px" }} />
            {error}
          </span>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

// ==========================================
// 4. TEXTAREA COMPONENT
// ==========================================
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, rows = 4, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--fg)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "var(--muted-bg)",
            border: error ? "1.5px solid #ef4444" : "1px solid var(--card-border)",
            color: "var(--fg)",
            fontSize: "14px",
            fontWeight: 500,
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            resize: "vertical",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = error ? "#ef4444" : "var(--card-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
          className={className}
          {...props}
        />
        {error && (
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#ef4444", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
            <AlertCircle style={{ width: "13px", height: "13px" }} />
            {error}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ==========================================
// 5. CARD COMPONENT
// ==========================================
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", children, hoverEffect = true, glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-[0_2px_16px_var(--shadow)] ${glass ? "backdrop-blur-xl bg-[var(--glass-bg)]" : ""
          } ${hoverEffect
            ? "hover:-translate-y-0.5 hover:border-[var(--card-border-hover)] hover:shadow-[0_8px_32px_var(--shadow)] transition-all duration-300"
            : ""
          } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

// ==========================================
// 6. BADGE COMPONENT
// ==========================================
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "error" | "warning" | "info" | "neutral";
}

export const Badge = ({ className = "", children, variant = "neutral", ...props }: BadgeProps) => {
  const styles = {
    success: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    error: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60",
    warning: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    info: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
    neutral: "bg-[var(--muted-bg)] text-[var(--fg)] border border-[var(--card-border)]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border tracking-wide uppercase ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// ==========================================
// 7. ALERT COMPONENT
// ==========================================
export interface AlertProps {
  variant?: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  className?: string;
}

export const Alert = ({ variant = "info", title, description, className = "" }: AlertProps) => {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    error: "bg-red-500/10 border-red-500/20 text-red-500",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  };

  const IconComponent = icons[variant];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${colors[variant]} ${className}`}>
      <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h5 className="font-bold text-sm leading-snug">{title}</h5>
        {description && <p className="text-xs mt-1 opacity-90 font-medium leading-relaxed">{description}</p>}
      </div>
    </div>
  );
};

// ==========================================
// 8. LOADER COMPONENT (SKELETONS / SPINNERS)
// ==========================================
export const Loader = ({ size = "md", label }: { size?: "sm" | "md" | "lg"; label?: string }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div
        className={`${sizes[size]} rounded-full border-[var(--accent-glow)] border-t-[var(--accent)] animate-spin`}
      />
      {label && <span className="text-xs font-semibold text-[var(--muted-fg)]">{label}</span>}
    </div>
  );
};

export const Skeleton = ({ className = "" }: { className?: string }) => {
  return <div className={`animate-pulse bg-[var(--muted-bg)] rounded-xl ${className}`} />;
};

// ==========================================
// 9. MODAL COMPONENT
// ==========================================
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidthClass = "max-w-2xl" }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`card-gradient-border bg-[var(--card-bg)] rounded-3xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[var(--card-border)]">
          <h3 className="text-xl font-bold text-[var(--fg)]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[var(--muted-fg)] hover:text-[var(--fg)] p-1.5 hover:bg-[var(--muted-bg)] rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 text-[var(--fg)] text-sm leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex gap-4 justify-end pt-4 border-t border-[var(--card-border)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
