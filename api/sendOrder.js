// /api/sendOrder.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxN77-hJCEVaPz5yvmAfWmBrKBMKBEqf1d11SZArH6t0Fo8g5mCwj1jhIx1vaS4BdGs/exec",
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
