import { useEffect, useState } from "react";

const TYPE_STYLES = {
  success: {
    bar:  "bg-green-500",
    icon: "✓",
    ring: "ring-green-200 dark:ring-green-900",
    bg:   "bg-white dark:bg-slate-800",
    text: "text-slate-800 dark:text-slate-100",
    iconBg: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  error: {
    bar:  "bg-red-500",
    icon: "✕",
    ring: "ring-red-200 dark:ring-red-900",
    bg:   "bg-white dark:bg-slate-800",
    text: "text-slate-800 dark:text-slate-100",
    iconBg: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  },
  info: {
    bar:  "bg-blue-500",
    icon: "ℹ",
    ring: "ring-blue-200 dark:ring-blue-900",
    bg:   "bg-white dark:bg-slate-800",
    text: "text-slate-800 dark:text-slate-100",
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  warning: {
    bar:  "bg-amber-500",
    icon: "⚠",
    ring: "ring-amber-200 dark:ring-amber-900",
    bg:   "bg-white dark:bg-slate-800",
    text: "text-slate-800 dark:text-slate-100",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
};

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const s = TYPE_STYLES[toast.type] || TYPE_STYLES.info;

  function handleDismiss() {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 220);
  }

  useEffect(() => {
    const t = setTimeout(handleDismiss, toast.duration);
    return () => clearTimeout(t);
  }, [toast.duration]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl shadow-xl ring-1
        ${s.bg} ${s.ring}
        ${exiting ? "toast-exit" : "toast-enter"}
        w-80 max-w-[calc(100vw-2rem)]
      `}
    >
      {/* Body */}
      <div className="flex items-start gap-3 px-4 py-3.5">
        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.iconBg}`}>
          {s.icon}
        </span>
        <p className={`flex-1 text-sm leading-5 ${s.text}`}>{toast.message}</p>
        <button
          onClick={handleDismiss}
          className="mt-0.5 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${s.bar} toast-bar`}
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </div>
  );
}

/**
 * ToastContainer — place once near app root.
 * Props: toasts (array), onDismiss (id => void)
 */
export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
