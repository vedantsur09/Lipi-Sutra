export function speakText(text, langCode = "hi-IN") {
  // Strip all XML prediction/reconstruction tags before speaking
  const cleanText = (text || "")
    .replace(/<predict[^>]*>/g, "")
    .replace(/<\/predict>/g, "")
    .replace(/<reconstruct>/g, "")
    .replace(/<\/reconstruct>/g, "");

  if (!window.speechSynthesis) {
    console.error("Web Speech API not supported in this browser.");
    return;
  }

  // Cancel any stuck silent queues
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = langCode;
  utterance.volume = 1;
  utterance.rate = 0.9;
  utterance.pitch = 1;

  function assignVoiceAndSpeak() {
    const voices = window.speechSynthesis.getVoices();
    // Try to find a voice matching the requested language code
    const langPrefix = langCode.split("-")[0];
    const matchingVoice = voices.find(v =>
      v.lang === langCode ||
      v.lang.startsWith(langPrefix)
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    window.speechSynthesis.speak(utterance);
  }

  // Chrome async bug: getVoices() is empty on first call — wait for onvoiceschanged
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    assignVoiceAndSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null; // prevent repeated firing
      assignVoiceAndSpeak();
    };
  }
}

export function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}