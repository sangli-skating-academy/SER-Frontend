// Example: date formatting utility
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}
