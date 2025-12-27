import { API_BASE_URL } from "../utils/apiConfig";
import { getAuthToken } from "../utils/authHelpers";

// Centralized API handler with proper auth and error handling
export async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  const opts = {
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  };
  // If body is FormData, remove Content-Type so browser sets it correctly
  if (opts.body instanceof FormData) {
    delete opts.headers["Content-Type"];
    delete opts.headers["content-type"];
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
