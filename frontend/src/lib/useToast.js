import { useState, useCallback } from "react";

let _toastId = 0;

/**
 * useToast — lightweight toast system.
 * Returns { toasts, toast } where toast({ message, type, duration }) triggers a notification.
 * Render <ToastContainer toasts={toasts} onDismiss={dismiss} /> anywhere near the root.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ message, type = "info", duration = 3500 }) => {
      const id = ++_toastId;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      setTimeout(() => dismiss(id), duration + 300); // +300 for exit animation
    },
    [dismiss]
  );

  return { toasts, toast, dismiss };
}
