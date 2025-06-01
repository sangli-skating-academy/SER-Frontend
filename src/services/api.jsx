// Example: central API handler
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}${endpoint}`, {
    credentials: "include",
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
