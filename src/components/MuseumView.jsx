import { useState } from "react";
import { analyzeDocument } from "../services/gemini";
import { saveDocument } from "../services/firebase";

const MOCK_STATS = {
  museum: "Raja Dinkar Kelkar Museum, Pune",
  total: 47, processed: 31, pending: 16,
  scripts: [
    { name: "Modi Script", count: 23, color: "#D4A017" },
    { name: "Devanagari", count: 18, color: "#6ee7b7" },
    { name: "Persian", count: 6,  color: "#93C5FD" }
  ],
  avgConfidence: 71,
  recentDocs: [
    { name: "Land Grant — Nashik 1782",  script: "Modi",       status: "✅ Done" },
    { name: "Temple Register — 1840",    script: "Devanagari", status: "✅ Done" },
    { name: "Peshwa Order — 1796",       script: "Modi",       status: "⏳ Pending" },
    { name: "Persian Firman — 1650",     script: "Persian",    status: "✅ Done" },
    { name: "Village Record — 1901",     script: "Devanagari", status: "⏳ Pending" }
  ]
};

export default function MuseumView() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState([]);

  function handleFiles(e) {
    setFiles(Array.from(e.target.files));
  }

  async function handleBulkProcess() {
    setProcessing(true);
    const results = [];
    for (const file of files) {
      const b64 = await new Promise(res => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.readAsDataURL(file);
      });
      try {
        const gemini = await analyzeDocument(b64);
        await saveDocument(gemini, "museum");
        results.push({ name: file.name, script: gemini.script, status: "✅ Done" });
      } catch {
        results.push({ name: file.name, script: "—", status: "❌ Failed" });
      }
    }
    setDone(results);
    setProcessing(false);
  }

  const s = MOCK_STATS;

  return (
    <div>
      <div style={{ background: "#3a2a00", borderRadius: 10, padding: "12px 18px",
        marginBottom: 20, border: "1px solid #F59E0B" }}>
        <strong style={{ color: "#FCD34D" }}>🏛️ Museum Admin Mode</strong>
        <span style={{ color: "#FDE68A", fontSize: 13, marginLeft: 10 }}>
          {s.museum}
        </span>
      </div>

      {/* Analytics dashboard */}
      <div style={{ background: "#2a1800", borderRadius: 12, padding: 24,
        marginBottom: 20, border: "1px solid #8B6914" }}>
        <h3 style={{ color: "#D4A017", marginBottom: 16 }}>📊 Collection Analytics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          {[
            { label: "Total Docs", value: s.total, color: "#D4A017" },
            { label: "Digitized",  value: s.processed, color: "#6ee7b7" },
            { label: "Pending",    value: s.pending, color: "#FCA5A5" },
            { label: "Avg Confidence", value: s.avgConfidence + "%", color: "#93C5FD" }
          ].map((stat, i) => (
            <div key={i} style={{ background: "#1a0f00", borderRadius: 8, padding: 16,
              textAlign: "center", border: "1px solid #5a3e00" }}>
              <div style={{ fontSize: 30, fontWeight: "bold", color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: "#c9a96e", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Script breakdown bars */}
        <div style={{ marginTop: 20 }}>
          <strong style={{ color: "#D4A017", fontSize: 13 }}>Scripts in Collection</strong>
          {s.scripts.map(sc => (
            <div key={sc.name} style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                fontSize: 12, color: "#c9a96e", marginBottom: 4 }}>
                <span>{sc.name}</span><span>{sc.count} docs</span>
              </div>
              <div style={{ background: "#1a0f00", borderRadius: 4, height: 8 }}>
                <div style={{ background: sc.color, borderRadius: 4, height: "100%",
                  width: `${(sc.count / s.total) * 100}%`, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent docs table */}
        <div style={{ marginTop: 20 }}>
          <strong style={{ color: "#D4A017", fontSize: 13 }}>Recent Documents</strong>
          <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #5a3e00" }}>
                {["Document", "Script", "Status"].map(h => (
                  <th key={h} style={{ color: "#c9a96e", textAlign: "left", padding: "6px 8px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...s.recentDocs, ...done].map((doc, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #2a1800" }}>
                  <td style={{ padding: "8px", color: "#f5e6c8" }}>{doc.name}</td>
                  <td style={{ padding: "8px", color: "#c9a96e" }}>{doc.script}</td>
                  <td style={{ padding: "8px" }}>{doc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk upload */}
      <div style={{ border: "2px dashed #F59E0B", borderRadius: 12, padding: 28,
        textAlign: "center", background: "#2a1800" }}>
        <h3 style={{ color: "#FCD34D" }}>📁 Bulk Upload Pipeline</h3>
        <p style={{ color: "#FDE68A", fontSize: 13, marginTop: 8, marginBottom: 16 }}>
          Select multiple document images — all processed automatically
        </p>
        <input type="file" accept="image/*" multiple onChange={handleFiles} />
        {files.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: "#c9a96e", fontSize: 13 }}>{files.length} file(s) selected</p>
            <button onClick={handleBulkProcess} disabled={processing}
              style={{ background: "#F59E0B", color: "#1a0f00", border: "none",
                padding: "12px 28px", borderRadius: 8, fontSize: 15,
                cursor: "pointer", fontWeight: "bold", marginTop: 12 }}>
              {processing ? `⏳ Processing ${files.length} files...` : "⚙️ Process All Documents"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}