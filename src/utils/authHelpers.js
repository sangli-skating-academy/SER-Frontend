/**
 * Authentication utility functions
 * Centralized helpers to avoid code duplication
 */

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The auth token or null if not found
 */
export const getAuthToken = () => localStorage.getItem("auth_token");

/**
 * Set the authentication token in localStorage
 * @param {string} token - The auth token to store
 */
export const setAuthToken = (token) =>
  localStorage.setItem("auth_token", token);

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => localStorage.removeItem("auth_token");
