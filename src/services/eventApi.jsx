const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Example: central API handler for events
export async function fetchEvents({ ageGroup, featured } = {}) {
  let url = `${API_URL}/api/events`;
  const params = [];
  if (featured) params.push(`featured=true`);
  if (ageGroup) params.push(`ageGroup=${encodeURIComponent(ageGroup)}`);
  if (params.length) url += `?${params.join("&")}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchEventById(id) {
  const url = `${API_URL}/api/events/${id}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
