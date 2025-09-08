// API endpoint to keep Render backend alive
export default async function handler(req, res) {
  // Only allow GET requests for security
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Your Render backend URL - update this with your actual URL
    // You can also set this as BACKEND_URL environment variable in Vercel
    const BACKEND_URL = "https://ser-backend-cjdn.onrender.com";

    console.log("Sending keep-alive ping to:", BACKEND_URL);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      headers: {
        "User-Agent": "Vercel-KeepAlive-Bot/1.0",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const timestamp = new Date().toISOString();

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      console.log(
        `✅ Keep-alive successful at ${timestamp} - Status: ${response.status}`
      );
      res.status(200).json({
        message: "Keep-alive successful",
        status: response.status,
        timestamp,
        backend_url: BACKEND_URL,
        backend_response: data,
      });
    } else {
      console.log(
        `⚠️ Keep-alive returned non-200 status at ${timestamp} - Status: ${response.status}`
      );
      res.status(200).json({
        message: "Backend responded but with non-200 status",
        status: response.status,
        timestamp,
        backend_url: BACKEND_URL,
      });
    }
  } catch (error) {
    const timestamp = new Date().toISOString();

    if (error.name === "AbortError") {
      console.error(`⏰ Keep-alive timeout at ${timestamp}`);
      res.status(500).json({
        error: "Keep-alive timeout",
        message: "Request timed out after 30 seconds",
        timestamp,
      });
    } else {
      console.error(`❌ Keep-alive failed at ${timestamp}:`, error.message);
      res.status(500).json({
        error: "Keep-alive failed",
        message: error.message,
        timestamp,
      });
    }
  }
}
