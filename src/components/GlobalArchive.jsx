import { useEffect, useState } from "react";
import { getRecentDocuments } from "../services/firebase";

export default function GlobalArchive({ theme }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const docs = await getRecentDocuments(50);
        setDocuments(docs);
      } catch (err) {
        console.error("Failed to fetch archive:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 min-h-screen">
      <div className="text-center mb-16">
        <h1
          className="text-4xl md:text-6xl font-heading font-black mb-4 tracking-tight"
          style={{ color: theme.accent }}
        >
          Global Archives
        </h1>
        <p className="text-lg font-light max-w-2xl mx-auto" style={{ color: theme.subtext }}>
          A curated repository of all analyzed ancient documents, transcripts, and historical artifacts.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{ borderColor: `${theme.accent}30`, borderTopColor: theme.accent }}
          />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20" style={{ color: theme.subtext }}>
          <p className="text-xl font-light">No archived documents found.</p>
          <p className="text-sm mt-2 opacity-60">Upload and analyze documents to populate the archive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl p-6 backdrop-blur-xl transition-all hover:-translate-y-1"
              style={{
                backgroundColor: theme.headerBg,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.cardShadow,
              }}
            >
              {doc.imageUrl && (
                <img
                  src={doc.imageUrl}
                  alt="Artifact"
                  className="w-full h-40 object-cover rounded-xl mb-4"
                  style={{ border: `1px solid ${theme.border}` }}
                />
              )}
              <div className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: theme.subtext }}>
                {doc.script || "Unknown Script"} · {doc.era || "Unknown Era"}
              </div>
              <p className="text-sm font-light line-clamp-3" style={{ color: theme.text }}>
                {doc.summary || "No summary available."}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border"
                  style={{
                    color: doc.status === "verified" ? "#4ade80" : theme.accent,
                    borderColor: doc.status === "verified" ? "#4ade8040" : `${theme.accent}40`,
                    backgroundColor: doc.status === "verified" ? "#4ade8010" : `${theme.accent}10`,
                  }}
                >
                  {doc.status || "pending"}
                </span>
                {doc.overallAccuracy && (
                  <span className="text-[10px] font-bold" style={{ color: theme.subtext }}>
                    {doc.overallAccuracy} accuracy
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
