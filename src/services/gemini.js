const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

export async function analyzeDocument(base64Image) {
  const prompt = `You are an expert in Indian historical scripts and archival documents.
Analyze this document image carefully. It may contain Modi script, Devanagari, archaic Marathi, Persian, or Sanskrit.
Return ONLY a valid JSON object with no markdown formatting, no backticks, no explanation before or after:
{
  "script": "detected script name",
  "era": "estimated historical period",
  "transcript": "full transcribed text in original script",
  "modernMarathi": "normalized modern Marathi version of the text",
  "summary": "2-3 sentence English summary of what this document is about",
  "missingWords": [],
  "predictedWords": [],
  "locations": []
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType: "image/jpeg", data: base64Image } },
              { text: prompt }
            ]
          }]
        })
      }
    );
    const data = await response.json();
    if (!data.candidates) {
      console.error("Gemini API error:", JSON.stringify(data));
      throw new Error(data.error?.message || "Gemini API returned no result");
    }
    const raw = data.candidates[0].content.parts[0].text;
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Gemini Error:", err);
    throw err;
  }
}