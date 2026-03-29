import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PublicView from "./components/PublicView";
import HistorianView from "./components/HistorianView";
import GlobalArchive from "./components/GlobalArchive";
import Login from "./components/Login";
import backImg from "./assets/back.jpg";
import './App.css';
const DARK = {
  name: "DARK",
  bg: "#1a0f00",
  surface: "#2a1800",
  border: "#8B6914",
  accent: "#D4A017",
  accentGlow: "#E5C366",
  text: "#f5e6c8",
  subtext: "#c9a96e",
  headerBg: "rgba(26, 18, 11, 0.6)",
  cardShadow: "0 10px 30px rgba(0,0,0,0.5)",
  buttonText: "#140c05"
};
const LIGHT = {
  name: "LIGHT",
  bg: "#f5ede0",
  surface: "#ede0cc",
  border: "#8B4513",
  accent: "#6B2D0E",
  accentGlow: "#A0522D",
  text: "#1a0800",
  subtext: "#5c3317",
  headerBg: "#ddd0b8",
  cardShadow: "0 2px 12px rgba(107,45,14,0.15)",
  buttonText: "#fff8f0"
};
export default function App() {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("themePreference") || "DARK";
  });
  useEffect(() => {
    localStorage.setItem("themePreference", themeMode);
  }, [themeMode]);
  const theme = themeMode === "DARK" ? DARK : LIGHT;
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "DARK" ? "LIGHT" : "DARK"));
  };
  return (
    <div
      className="min-h-screen relative flex flex-col font-sans"
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `
          linear-gradient(${theme.bg}D9, ${theme.bg}D9), 
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E"), 
          url("${backImg}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: theme.text,
        transition: "background 0.3s, color 0.3s"
      }}
    >
      {/* Premium Navigation Bar */}
      <Navbar theme={theme} themeMode={themeMode} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-x-hidden relative z-10 w-full animate-[fadeIn_0.5s_ease-out]">
        <Routes>
          <Route path="/" element={<PublicView theme={theme} />} />
          <Route path="/archives" element={<GlobalArchive theme={theme} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/historian" element={<HistorianView theme={theme} />} />
        </Routes>
      </main>
    </div>
  );
}