const GOOGLE_KEY = import.meta.env.VITE_VISION_KEY;

export async function translateText(text, targetLang) {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "mr", target: targetLang })
    }
  );
  const data = await response.json();
  return data.data.translations[0].translatedText;
}