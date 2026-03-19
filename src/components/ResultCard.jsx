export default function ResultCard({ result }) {
  if (!result) return null;
  return (
    <div style={{ background: "#2a1800", borderRadius: 12, padding: 24,
      marginBottom: 20, border: "1px solid #8B6914" }}>
      <h3 style={{ color: "#D4A017", marginBottom: 12 }}>📄 Document Analysis</h3>
      <p><strong style={{ color: "#c9a96e" }}>Script:</strong> {result.script}</p>
      <p style={{ marginTop: 6 }}><strong style={{ color: "#c9a96e" }}>Era:</strong> {result.era}</p>
      <p style={{ marginTop: 10, lineHeight: 1.7 }}>
        <strong style={{ color: "#c9a96e" }}>Summary:</strong> {result.summary}
      </p>
      {result.transcript && (
        <div style={{ marginTop: 12, background: "#1a0f00", borderRadius: 8, padding: 12,
          fontSize: 15, lineHeight: 1.9, border: "1px solid #5a3e00" }}>
          {result.transcript}
        </div>
      )}
    </div>
  );
}