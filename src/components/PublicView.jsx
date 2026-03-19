import { useState } from "react";
import { analyzeDocument } from "../services/gemini";
import { getConfidenceScores } from "../services/vision";
import { translateText } from "../services/translate";
import { speakText } from "../services/tts";
import { saveDocument } from "../services/firebase";
import ResultCard from "./ResultCard";
import MapSection from "./MapSection";

const btn = (color = "#D4A017") => ({
  background: color, color: "#1a0f00", border: "none",
  padding: "12px 28px", borderRadius: 8, fontSize: 15,
  cursor: "pointer", fontWeight: "bold", margin: 5
});

export default function PublicView() {
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [result, setResult] = useState(null);
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => setBase64(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  }

  async function handleAnalyze() {
    if (!base64) return;
    setLoading(true);
    try {
      const [gemini] = await Promise.all([
        analyzeDocument(base64),
        getConfidenceScores(base64)
      ]);
      setResult(gemini);
      await saveDocument(gemini, "public");
    } catch (err) { alert("Error: " + err.message); }
    setLoading(false);
  }

  const langCodes = { en: "en-US", hi: "hi-IN", gu: "gu-IN", te: "te-IN" };

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: 20 }}>
        <input placeholder="🔍  Search historical documents, scripts, locations..."
          style={{ width: "100%", padding: "14px 18px", borderRadius: 10, fontSize: 15,
            background: "#2a1800", color: "#f5e6c8", border: "1px solid #8B6914",
            outline: "none" }} />
      </div>

      {/* Upload */}
      <div style={{ border: "2px dashed #8B6914", borderRadius: 12, padding: 30,
        textAlign: "center", marginBottom: 24, background: "#2a1800" }}>
        <h2 style={{ color: "#D4A017" }}>📜 Discover Historical Documents</h2>
        <p style={{ color: "#c9a96e", marginTop: 8, marginBottom: 16 }}>
          Upload a document image — we'll decode and explain it in your language
        </p>
        <input type="file" accept="image/*" onChange={handleFile} />
        {image && <img src={image} alt="doc"
          style={{ maxWidth: "100%", maxHeight: 260, marginTop: 14, borderRadius: 8, border: "1px solid #8B6914" }} />}
        {base64 && (
          <div>
            <button style={btn()} onClick={handleAnalyze} disabled={loading}>
              {loading ? "⏳ Decoding..." : "🔍 Decode Document"}
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <>
          <ResultCard result={result} />
          {/* Accessibility — TTS prominent */}
          <div style={{ background: "#1e3a1a", borderRadius: 12, padding: 24,
            marginBottom: 20, border: "1px solid #065F46", textAlign: "center" }}>
            <h3 style={{ color: "#6ee7b7", marginBottom: 8 }}>🔊 Listen in Your Language</h3>
            <p style={{ color: "#a7f3d0", fontSize: 13, marginBottom: 16 }}>
              Accessibility feature — hear the document read aloud
            </p>
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ padding: 10, borderRadius: 8, marginRight: 10,
                background: "#1a0f00", color: "#f5e6c8", border: "1px solid #8B6914", fontSize: 14 }}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
              <option value="te">తెలుగు</option>
            </select>
            <button style={btn("#065F46")}
              onClick={async () => {
                const t = await translateText(result.modernMarathi || result.transcript, lang);
                setTranslation(t);
              }}>
              Translate
            </button>
            {translation && (
              <>
                <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.8, color: "#f5e6c8" }}>
                  {translation}
                </p>
                <button style={{ ...btn("#0a4a2a"), marginTop: 8 }}
                  onClick={() => speakText(translation, langCodes[lang])}>
                  ▶ Read Aloud
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Map always visible for public */}
      <MapSection />
    </div>
  );
}