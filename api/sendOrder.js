// /api/sendOrder.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwo6jz1r50a1nuExg1qba6iRCOv9vONtYEZg6XIiqcCMX86VkHJE52_2WiilzZBFu-X/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();
    res.status(200).json({ success: true, data: text });
  } catch (err) {
    console.error("API Route Error:", err);
    res.status(500).json({ success: false, error: err.toString() });
  }
}
