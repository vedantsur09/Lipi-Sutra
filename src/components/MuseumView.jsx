import { useState } from "react";
import { analyzeDocument } from "../services/gemini";
import { saveDocument } from "../services/firebase";

const MOCK_STATS = {
  museum: "Raja Dinkar Kelkar Museum, Pune",
  total: 47, processed: 31, pending: 16,
  scripts: [
    { name: "Modi Script", count: 23, color: "bg-gold-500" },
    { name: "Devanagari", count: 18, color: "bg-emerald-400" },
    { name: "Persian", count: 6,  color: "bg-blue-400" }
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

export default function MuseumView({ theme }) {
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
        results.push({ name: file.name, script: gemini.script, status: "✅ Done" });
        saveDocument(gemini, "museum").catch(e => console.warn(e));
      } catch {
        results.push({ name: file.name, script: "—", status: "❌ Failed" });
      }
    }
    setDone(results);
    setProcessing(false);
  }

  const s = MOCK_STATS;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Role Banner */}
      <div className="rounded-xl border p-5 mb-8 border-l-4 shadow-md flex items-center" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderLeftColor: theme.accent, boxShadow: theme.cardShadow }}>
        <strong className="text-lg" style={{ color: theme.accent }}>🏛️ Museum Admin Mode</strong>
        <span className="text-sm ml-4 border-l pl-4" style={{ color: theme.subtext, borderColor: theme.border }}>
          {s.museum}
        </span>
      </div>

      {/* Analytics Dashboard */}
      <div className="rounded-xl border shadow-xl p-8 mb-12" style={{ backgroundColor: theme.headerBg, borderColor: theme.border, boxShadow: theme.cardShadow }}>
        <h3 className="text-2xl font-heading mb-8 border-b pb-4" style={{ color: theme.accent, borderColor: theme.border }}>
          📊 Collection Analytics
        </h3>
        
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Docs", value: s.total, color: "text-gold-500" },
            { label: "Digitized",  value: s.processed, color: "text-emerald-400" },
            { label: "Pending",    value: s.pending, color: "text-red-400" },
            { label: "Avg Confidence", value: s.avgConfidence + "%", color: "text-blue-400" }
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-6 text-center border shadow-inner" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
              <div className={`text-4xl font-bold font-heading mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.subtext }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Script Breakdown */}
        <div className="mb-12">
          <strong className="text-slate-200 text-sm tracking-widest uppercase font-semibold block mb-6">Scripts in Collection</strong>
          <div className="space-y-5">
            {s.scripts.map(sc => (
              <div key={sc.name}>
                <div className="flex justify-between text-sm mb-2 font-medium" style={{ color: theme.text }}>
                  <span>{sc.name}</span>
                  <span>{sc.count} docs</span>
                </div>
                <div className="rounded-full h-2.5 overflow-hidden shadow-inner flex" style={{ backgroundColor: theme.surface }}>
                  <div className={`${sc.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${(sc.count / s.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Docs Table */}
        <div className="mt-8">
          <strong className="text-sm tracking-widest uppercase font-semibold block mb-6" style={{ color: theme.text }}>Recent Documents</strong>
          <div className="overflow-x-auto border rounded-lg" style={{ borderColor: theme.border }}>
            <table className="min-w-full text-left" style={{ backgroundColor: theme.surface }}>
              <thead className="border-b" style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}>
                <tr>
                  {["Document", "Script", "Status"].map(h => (
                    <th key={h} className="px-6 py-4 text-xs tracking-widest uppercase font-semibold" style={{ color: theme.subtext }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-sm" style={{ borderColor: theme.border }}>
                {[...s.recentDocs, ...done].map((doc, i) => (
                  <tr key={i} className="transition-colors" style={{ backgroundColor: theme.surface }}>
                    <td className="px-6 py-4 font-medium" style={{ color: theme.text }}>{doc.name}</td>
                    <td className="px-6 py-4" style={{ color: theme.subtext }}>{doc.script}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        doc.status.includes("Done") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                        doc.status.includes("Fail") ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bulk Upload Pipeline */}
      <div className="border border-dashed rounded-2xl p-12 text-center transition-colors shadow-md" style={{ backgroundColor: theme.headerBg, borderColor: theme.accent, boxShadow: theme.cardShadow }}>
        <h3 className="text-2xl font-heading mb-2" style={{ color: theme.accent }}>📁 Bulk Upload Pipeline</h3>
        <p className="font-light mb-8 max-w-md mx-auto" style={{ color: theme.subtext }}>
          Select multiple document images to be processed automatically and uploaded to the database entirely sequentially.
        </p>
        
        <input id="bulk-upload" type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        <label htmlFor="bulk-upload" className="cursor-pointer border px-8 py-3 rounded transition-colors font-semibold tracking-wide shadow-sm" style={{ backgroundColor: theme.accentGlow, color: theme.buttonText, borderColor: theme.accent }}>
          Select Multiple Files
        </label>
        
        {files.length > 0 && (
          <div className="mt-10 animate-[fadeIn_0.4s_ease-out]">
            <p className="font-semibold mb-6 tracking-wide" style={{ color: theme.accent }}>{files.length} file(s) ready to process format</p>
            <button onClick={handleBulkProcess} disabled={processing} className="px-8 py-3 rounded font-bold tracking-wide hover:-translate-y-0.5 transition-transform shadow-lg disabled:opacity-50 disabled:transform-none" style={{ backgroundColor: theme.accentGlow, color: theme.buttonText, boxShadow: theme.cardShadow }}>
              {processing ? `⏳ Processing ${files.length} files...` : "⚙️ Process All Documents Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}