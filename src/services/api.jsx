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

  if (!res.ok) {
    // Try to parse error response as JSON
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      // If not JSON, use text
      errorData = { error: await res.text() };
    }

    // Create error object with response data
    const error = new Error(
      errorData.message || errorData.error || "Request failed"
    );
    error.response = {
      status: res.status,
      data: errorData,
    };
    throw error;
  }

  return res.json();
}
