const GOOGLE_KEY = "AIzaSyCycvn7VgYU4V3ydmCna_z2U3P4Ll_7QGE";

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