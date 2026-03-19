const GOOGLE_KEY = "AIzaSyCycvn7VgYU4V3ydmCna_z2U3P4Ll_7QGE";

export async function speakText(text, langCode = "mr-IN") {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: langCode, ssmlGender: "FEMALE" },
        audioConfig: { audioEncoding: "MP3" }
      })
    }
  );
  const data = await response.json();
  const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
  audio.play();
}