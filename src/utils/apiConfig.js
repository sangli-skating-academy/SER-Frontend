/**
 * Centralized API configuration
 * Use this across all components instead of redefining API_BASE_URL
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";
