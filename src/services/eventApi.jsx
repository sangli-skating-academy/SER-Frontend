import { apiFetch } from "./api";

// Fetch events with support for ageGroup, featured, and includePast
export async function fetchEvents({ ageGroup, featured, includePast } = {}) {
  let endpoint = "/api/events";
  const params = [];
  if (featured) params.push(`featured=true`);
  if (ageGroup) params.push(`ageGroup=${encodeURIComponent(ageGroup)}`);
  if (includePast) params.push(`includePast=true`);
  if (params.length) endpoint += `?${params.join("&")}`;
  return apiFetch(endpoint);
}

export async function fetchEventById(id) {
  return apiFetch(`/api/events/${id}`);
}
