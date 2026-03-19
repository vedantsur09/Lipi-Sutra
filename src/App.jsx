import { useState } from "react";
import Navbar from "./components/Navbar";
import PublicView from "./components/PublicView";
import HistorianView from "./components/HistorianView";
import MuseumView from "./components/MuseumView";
import "./App.css";

export default function App() {
  const [currentRole, setCurrentRole] = useState("Public / Student");

  return (
    <div>
      <Navbar currentRole={currentRole} setCurrentRole={setCurrentRole} />
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 20px 40px" }}>
        {currentRole === "Public / Student" && <PublicView />}
        {currentRole === "Historian"        && <HistorianView />}
        {currentRole === "Museum Admin"     && <MuseumView />}
      </div>
    </div>
  );
}