import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
export default function Navbar({ theme, themeMode, toggleTheme }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  const navLinks = [
    { path: "/", label: "AI Scanner" },
    { path: "/archives", label: "Global Archives" },
  ];
  // Determine which role pill is "active" based on route
  const isPublicRoute = location.pathname === "/" || location.pathname === "/archives";
  const isHistorianRoute = location.pathname === "/historian" || location.pathname === "/login";
  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: theme.headerBg,
        borderBottomColor: `${theme.accent}1A`,
      }}
    >
      {/* ── Logo ─────────────────────────────── */}
      <Link to="/" className="navbar__logo" onClick={() => setMobileOpen(false)}>
        <span className="navbar__logo-mark" style={{ color: theme.accent }}>
          LS
        </span>
        <span className="navbar__logo-divider" style={{ backgroundColor: theme.accent }} />
        <span className="navbar__logo-text" style={{ color: theme.text }}>
          LIPISUTRA
        </span>
      </Link>
      {/* ── Nav Links (Desktop) ──────────────── */}
      <div className="navbar__nav">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`navbar__link ${isActive(link.path) ? "navbar__link--active" : ""}`}
            style={{
              color: isActive(link.path) ? theme.accent : theme.text,
            }}
          >
            {link.label}
            <span
              className="navbar__link-underline"
              style={{
                position: "absolute",
                bottom: "-2px",
                left: 0,
                width: isActive(link.path) ? "100%" : undefined,
                height: "2px",
                backgroundColor: theme.accent,
              }}
            />
          </Link>
        ))}
      </div>
      {/* ── Right: Role Pills + Theme Toggle ─── */}
      <div className="navbar__right">
        {/* Role Label */}
        <span className="navbar__roles-label" style={{ color: theme.subtext }}>
          Role
        </span>
        {/* Role Switcher */}
        <div
          className="navbar__roles"
          style={{
            borderColor: `${theme.accent}30`,
            backgroundColor: `${theme.surface}40`,
          }}
        >
          <Link
            to="/"
            className={`navbar__role-pill ${isPublicRoute ? "navbar__role-pill--active" : ""}`}
            style={{
              color: isPublicRoute ? theme.accent : theme.subtext,
              borderColor: isPublicRoute ? theme.accent : "transparent",
              backgroundColor: isPublicRoute ? `${theme.accent}10` : "transparent",
            }}
          >
            Public / Student
          </Link>
          <Link
            to="/login"
            className={`navbar__role-pill ${isHistorianRoute ? "navbar__role-pill--active" : ""}`}
            style={{
              color: isHistorianRoute ? theme.accent : theme.subtext,
              borderColor: isHistorianRoute ? theme.accent : "transparent",
              backgroundColor: isHistorianRoute ? `${theme.accent}10` : "transparent",
            }}
          >
            Historian
          </Link>
        </div>
        {/* Theme Toggle */}
        <button
          className="navbar__theme-toggle"
          onClick={toggleTheme}
          style={{
            color: theme.accent,
            borderColor: `${theme.accent}30`,
          }}
          aria-label="Toggle theme"
        >
          {themeMode === "DARK" ? "🌙" : "☀️"}
        </button>
        {/* Hamburger (mobile) */}
        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Menu"
        >
          <span style={{ backgroundColor: theme.accent }} />
          <span style={{ backgroundColor: theme.accent }} />
          <span style={{ backgroundColor: theme.accent }} />
        </button>
      </div>
      {/* ── Mobile Menu ──────────────────────── */}
      {mobileOpen && (
        <div
          className="navbar__mobile-menu"
          style={{ backgroundColor: theme.headerBg }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${isActive(link.path) ? "navbar__link--active" : ""}`}
              style={{ color: isActive(link.path) ? theme.accent : theme.text }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/"
            className={`navbar__role-pill ${isPublicRoute ? "navbar__role-pill--active" : ""}`}
            style={{
              color: isPublicRoute ? theme.accent : theme.subtext,
              borderColor: isPublicRoute ? theme.accent : `${theme.accent}30`,
            }}
            onClick={() => setMobileOpen(false)}
          >
            Public / Student
          </Link>
          <Link
            to="/login"
            className={`navbar__role-pill ${isHistorianRoute ? "navbar__role-pill--active" : ""}`}
            style={{
              color: isHistorianRoute ? theme.accent : theme.subtext,
              borderColor: isHistorianRoute ? theme.accent : `${theme.accent}30`,
            }}
            onClick={() => setMobileOpen(false)}
          >
            Historian
          </Link>
        </div>
      )}
    </nav>
  );
}