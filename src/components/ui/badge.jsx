import React from "react";
import { cn } from "../../lib/utils";

// Simple variant utility for badge (replace cva)
function badgeVariants({ variant = "default", className = "" } = {}) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border-border",
  };
  return cn(base, variants[variant] || variants.default, className);
}

/**
 * @param {object} props
 * @param {string} [props.variant] - Badge style variant
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} props.children - Badge content
 * @returns {JSX.Element}
 */
function Badge({ className = "", variant = "default", children, ...props }) {
  return (
    <div className={badgeVariants({ variant, className })} {...props}>
      {children}
    </div>
  );
}

export default Badge;
// If you need badgeVariants elsewhere, move it to a separate file.
