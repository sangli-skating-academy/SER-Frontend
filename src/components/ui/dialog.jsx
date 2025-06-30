import React, { forwardRef } from "react";
// Remove Radix and lucide-react imports for plain JSX version
import { cn } from "../../lib/utils";

// Basic Dialog implementation for JSX (no Radix)
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  // Handler to stop propagation inside modal
  const handleModalClick = (e) => e.stopPropagation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
      <div className="fixed inset-0 bg-black/80" onClick={onOpenChange} />
      <div
        className="relative z-10 w-full max-w-lg bg-white p-2 sm:p-6 shadow-lg rounded-lg max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={handleModalClick}
      >
        {children}
        {/* <button
          className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={onOpenChange}
          aria-label="Close"
          type="button"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button> */}
      </div>
    </div>
  );
};

const DialogHeader = ({ className = "", ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

const DialogFooter = ({ className = "", ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

const DialogTitle = forwardRef(function DialogTitle(
  { className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
});

const DialogDescription = forwardRef(function DialogDescription(
  { className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export { Dialog, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
