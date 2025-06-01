import { apiFetch } from "./api";

export async function sendContactMessage({
  name,
  email,
  phone,
  subject,
  message,
}) {
  return apiFetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, subject, message }),
  });
}
