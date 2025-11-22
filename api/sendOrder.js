// sendOrder.js
export async function sendOrder(formData) {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxN77-hJCEVaPz5yvmAfWmBrKBMKBEqf1d11SZArH6t0Fo8g5mCwj1jhIx1vaS4BdGs/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Order Send Error:", error);
    return { success: false, error };
  }
}
