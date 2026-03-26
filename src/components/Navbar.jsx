import logo from "../assets/lslogo.png";

export default function Navbar({ currentView, onViewChange, currentPage, onPageChange, theme }) {
  const roles = [
    { id: "public", label: "Public / Student" },
    { id: "historian", label: "Historian" },
    { id: "museum", label: "Museum Admin" }
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg border-b shadow-2xl transition-colors" style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center py-3 gap-4">

          {/* Logo & Main Nav container */}
          <div className="flex items-center gap-12">
            <div className="flex items-center cursor-pointer group" onClick={() => onPageChange("home")}>
              <div className="relative">
                <img
                  src={logo}
                  alt="LipiSutra"
                  className="h-40 w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: theme.name === 'LIGHT' ? 'brightness(0.1) sepia(0.8) hue-rotate(-20deg) saturate(3)' : 'none', mixBlendMode: theme.name === 'LIGHT' ? 'normal' : 'screen' }}
                />
              </div>
            </div>

            {/* Page Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 border-l pl-8" style={{ borderColor: theme.border }}>
              <button
                onClick={() => onPageChange("home")}
                style={currentPage === 'home' ? { color: theme.accent, borderBottom: `2.5px solid ${theme.accent}` } : { color: theme.subtext }}
                className={`text-sm font-semibold tracking-widest uppercase transition-colors ${currentPage === 'home' ? 'py-1' : 'hover:opacity-80'}`}
              >
                AI Scanner
              </button>

            </div>
          </div>

          <div className="flex items-center rounded-full border p-1 shadow-inner transition-colors" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <span className="text-xs uppercase tracking-widest font-semibold px-4 hidden md:block" style={{ color: theme.subtext }}>Role</span>
            <div className="flex">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => onViewChange(r.id)}
                  style={currentView === r.id
                    ? { 
                        backgroundColor: theme.name === 'LIGHT' ? theme.accent : 'transparent', 
                        color: theme.name === 'LIGHT' ? '#fff8f0' : theme.accent, 
                        borderColor: theme.accent,
                        boxShadow: theme.name === 'LIGHT' ? 'none' : '0 0 15px rgba(212,175,55,0.15)'
                      }
                    : { color: theme.subtext }
                  }
                  className={`px-5 py-2 text-xs font-semibold tracking-wide rounded-full transition-all duration-300 border ${currentView === r.id ? '' : 'border-transparent hover:opacity-80'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}