// src/main.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ClientPortal from "./ClientPortal.jsx";
import AdminPortal from "./AdminPortal.jsx";

function RootApp() {
  const [adminMode, setAdminMode] = useState(false);

  // On regarde si l'admin a déjà été déverrouillé (localStorage)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cardaris_admin_unlocked");
      if (stored === "1") {
        setAdminMode(true);
      }
    } catch (e) {
      console.warn("Impossible de lire localStorage admin :", e);
    }
  }, []);

  const handleAdminUnlock = () => {
    try {
      localStorage.setItem("cardaris_admin_unlocked", "1");
    } catch (e) {
      console.warn("Impossible d'écrire localStorage admin :", e);
    }
    setAdminMode(true);
  };

  const handleAdminExit = () => {
    try {
      localStorage.removeItem("cardaris_admin_unlocked");
    } catch (e) {
      console.warn("Impossible de nettoyer localStorage admin :", e);
    }
    setAdminMode(false);
  };

  if (adminMode) {
    return <AdminPortal onExit={handleAdminExit} />;
  }

  // ⚠️ Pense bien à ce que ClientPortal accepte la prop onAdminUnlock
  return <ClientPortal onAdminUnlock={handleAdminUnlock} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
