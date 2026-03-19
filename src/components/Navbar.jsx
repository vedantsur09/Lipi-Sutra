const ROLES = ["Public / Student", "Historian", "Museum Admin"];

const ROLE_COLORS = {
  "Public / Student": { bg: "#1e3a5f", text: "#93C5FD", dot: "#3B82F6" },
  "Historian":        { bg: "#1a3a1a", text: "#6ee7b7", dot: "#10B981" },
  "Museum Admin":     { bg: "#3a1a00", text: "#FCD34D", dot: "#F59E0B" }
};

export default function Navbar({ currentRole, setCurrentRole }) {
  const colors = ROLE_COLORS[currentRole];

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 24px", background: "#120900",
      borderBottom: "1px solid #8B6914", marginBottom: 28,
      position: "sticky", top: 0, zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>📜</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: "bold", color: "#D4A017" }}>LipiSutra</div>
          <div style={{ fontSize: 10, color: "#c9a96e", letterSpacing: 2 }}>HISTORICAL DOCUMENT AI</div>
        </div>
      </div>

      {/* Role Switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "#c9a96e" }}>Viewing as:</span>
        <div style={{ display: "flex", gap: 6 }}>
          {ROLES.map(role => {
            const active = currentRole === role;
            const c = ROLE_COLORS[role];
            return (
              <button key={role}
                onClick={() => setCurrentRole(role)}
                style={{
                  padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                  cursor: "pointer", transition: "all 0.2s",
                  border: active ? `1.5px solid ${c.dot}` : "1.5px solid #3a2a10",
                  background: active ? c.bg : "transparent",
                  color: active ? c.text : "#8B6914"
                }}>
                {active && <span style={{ marginRight: 6, fontSize: 8,
                  display: "inline-block", width: 6, height: 6,
                  borderRadius: "50%", background: c.dot, verticalAlign: "middle" }} />}
                {role}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}