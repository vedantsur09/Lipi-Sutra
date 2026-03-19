import { useState } from "react";
import { analyzeDocument } from "../services/gemini";
import { getConfidenceScores } from "../services/vision";
import { saveDocument, saveCorrection } from "../services/firebase";
import ResultCard from "./ResultCard";

const box = (border = "#8B6914") => ({
  background: "#2a1800", borderRadius: 12, padding: 24,
  marginBottom: 20, border: `1px solid ${border}`
});

export default function HistorianView() {
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [result, setResult] = useState(null);
  const [words, setWords] = useState([]);
  const [corrections, setCorrections] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setSaved(false);
    try {
      const [gemini, visionWords] = await Promise.all([
        analyzeDocument(base64),
        getConfidenceScores(base64)
      ]);
      setResult(gemini);
      setWords(visionWords);
      await saveDocument(gemini, "historian");
    } catch (err) { alert("Error: " + err.message); }
    setLoading(false);
  }

  async function handleSaveCorrections() {
    await saveCorrection({ corrections, script: result?.script, era: result?.era });
    setSaved(true);
  }

  // Confidence heatmap
  function Heatmap() {
    if (!words.length) return null;
    return (
      <div style={{ lineHeight: 2.4, fontSize: 17, marginTop: 12 }}>
        {words.map((w, i) => {
          const c = w.confidence;
          const bg = c > 0.85 ? "transparent" : c > 0.6 ? "#FEF9C3" : "#FEE2E2";
          const color = c > 0.85 ? "#f5e6c8" : c > 0.6 ? "#5a3e00" : "#7c0000";
          const border = c <= 0.6 ? "1px dashed #EF4444" : "none";
          return (
            <span key={i} title={`${Math.round(c * 100)}% confidence`}
              style={{ background: bg, color, padding: "2px 5px", borderRadius: 4,
                margin: "0 2px", border, cursor: c <= 0.6 ? "pointer" : "default" }}>
              {w.word}
            </span>
          );
        })}
        <div style={{ marginTop: 12, fontSize: 12, color: "#c9a96e" }}>
          <span style={{ background: "#FEF9C3", color: "#5a3e00", padding: "2px 8px", borderRadius: 4, marginRight: 8 }}>Yellow = Uncertain (60–85%)</span>
          <span style={{ background: "#FEE2E2", color: "#7c0000", padding: "2px 8px", borderRadius: 4 }}>Red = AI Predicted (&lt;60%) — edit below</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "#1a3a1a", borderRadius: 10, padding: "12px 18px",
        marginBottom: 20, border: "1px solid #065F46" }}>
        <strong style={{ color: "#6ee7b7" }}>🏛️ Historian Mode</strong>
        <span style={{ color: "#a7f3d0", fontSize: 13, marginLeft: 10 }}>
          Expert review + RLHF correction loop — your edits train the model
        </span>
      </div>

      {/* Upload */}
      <div style={{ border: "2px dashed #065F46", borderRadius: 12, padding: 28,
        textAlign: "center", marginBottom: 24, background: "#1a2a1a" }}>
        <h2 style={{ color: "#6ee7b7" }}>Upload Document for Expert Review</h2>
        <input type="file" accept="image/*" onChange={handleFile} style={{ marginTop: 14 }} />
        {image && <img src={image} alt="doc"
          style={{ maxWidth: "100%", maxHeight: 260, marginTop: 14, borderRadius: 8, border: "1px solid #065F46" }} />}
        {base64 && (
          <button onClick={handleAnalyze} disabled={loading}
            style={{ background: "#065F46", color: "#D1FAE5", border: "none",
              padding: "12px 28px", borderRadius: 8, fontSize: 15, cursor: "pointer",
              fontWeight: "bold", marginTop: 14 }}>
            {loading ? "⏳ Analyzing..." : "🔬 Analyze + Confidence Scan"}
          </button>
        )}
      </div>

      {result && (
        <>
          <ResultCard result={result} />

          {/* Heatmap */}
          <div style={box("#065F46")}>
            <h3 style={{ color: "#6ee7b7" }}>🔍 Confidence Heatmap</h3>
            <Heatmap />
          </div>

          {/* Correction panel */}
          {result.predictedWords?.length > 0 && (
            <div style={{ ...box("#EF4444"), background: "#2a1010" }}>
              <h3 style={{ color: "#FCA5A5", marginBottom: 6 }}>✏️ Correction Mode — Red Words</h3>
              <p style={{ color: "#fca5a5", fontSize: 13, marginBottom: 16 }}>
                AI is uncertain about these words. Correct them — your input directly improves the model.
              </p>
              {result.predictedWords.map((pw, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <label style={{ color: "#FCA5A5", fontSize: 13 }}>
                    Word #{i + 1} — AI predicted: <strong style={{ color: "#f87171" }}>"{pw.predicted}"</strong>
                    <span style={{ color: "#c9a96e", marginLeft: 8 }}>
                      ({Math.round(pw.confidence * 100)}% confidence)
                    </span>
                  </label>
                  <input
                    placeholder="Type correct word (leave blank if AI is right)"
                    value={corrections[pw.predicted] || ""}
                    onChange={e => setCorrections(prev => ({ ...prev, [pw.predicted]: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 6, padding: 10,
                      borderRadius: 8, background: "#1a0f00", color: "#f5e6c8",
                      border: "1px solid #EF4444", fontSize: 14 }} />
                </div>
              ))}
              {saved
                ? <p style={{ color: "#6ee7b7", fontWeight: "bold" }}>✅ Saved to training database!</p>
                : <button onClick={handleSaveCorrections}
                    style={{ background: "#7f1d1d", color: "#FCA5A5", border: "1px solid #EF4444",
                      padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>
                    Submit Corrections to Training Data
                  </button>
              }
            </div>
          )}
        </>
      )}
    </div>
  );
}