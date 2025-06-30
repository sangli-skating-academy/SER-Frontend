import React from "react";
import { useToast } from "../../hooks/use-toasts";

const ToastViewport = () => {
  const { toasts, dismiss } = useToast();
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 280,
        maxWidth: 360,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: 16,
            color: "#222",
            fontSize: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 240,
            maxWidth: 340,
          }}
        >
          {toast.title && <div style={{ fontWeight: 600 }}>{toast.title}</div>}
          {toast.description && (
            <div style={{ fontSize: 14 }}>{toast.description}</div>
          )}
          {toast.action && <div>{toast.action}</div>}
          <button
            onClick={() => dismiss(toast.id)}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: 13,
              marginTop: 4,
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;
