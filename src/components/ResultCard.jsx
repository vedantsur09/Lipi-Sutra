export default function ResultCard({ result, theme }) {
  if (!result) return null;

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <h3 className="text-sm font-semibold tracking-widest uppercase mb-4 text-center lg:text-left" style={{ color: theme.subtext }}>Analysis Results</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 md:p-8 rounded-xl border shadow-md transition-all duration-300" style={{ backgroundColor: theme.headerBg, borderColor: theme.border, boxShadow: theme.cardShadow }}>
        <div className="text-center lg:text-left">
          <div className="text-xs tracking-widest uppercase mb-2" style={{ color: theme.subtext }}>Detected Script</div>
          <div className="text-2xl font-heading" style={{ color: theme.accent }}>{result.script || result.inferredScript}</div>
        </div>
        <div className="text-center lg:text-left">
          <div className="text-xs tracking-widest uppercase mb-2" style={{ color: theme.subtext }}>Historical Era</div>
          <div className="text-2xl md:text-3xl font-heading" style={{ color: theme.accent }}>{result.era || "Unknown"}</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: theme.subtext }}>Summary Overview</h3>
        <p className="leading-relaxed font-light text-lg border-l-[3px] pl-5 py-4 text-left shadow-sm" style={{ color: theme.text, borderColor: theme.accent, backgroundColor: theme.surface }}>
          {result.summary || "No summary available."}
        </p>
      </div>
    </div>
  );
}