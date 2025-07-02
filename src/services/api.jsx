// Example: central API handler
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const opts = {
    credentials: "include",
    ...options,
  };
  // If body is FormData, remove Content-Type so browser sets it correctly
  if (opts.body instanceof FormData) {
    if (opts.headers) {
      delete opts.headers["Content-Type"];
      delete opts.headers["content-type"];
    }
  }
  const res = await fetch(`${baseUrl}${endpoint}`, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
