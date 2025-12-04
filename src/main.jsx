// src/main.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ClientPortal from "./ClientPortal.jsx";
import AdminPortal from "./AdminPortal.jsx";

const ADMIN_PASSWORD = "DB_HINIx257&";

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

  const unlockAdmin = () => {
    const pwd = window.prompt("Mot de passe admin Cardaris :");
    if (!pwd) return;

    if (pwd !== ADMIN_PASSWORD) {
      alert("Mot de passe incorrect.");
      return;
    }

    try {
      localStorage.setItem("cardaris_admin_unlocked", "1");
    } catch (e) {
      console.warn("Impossible d'écrire localStorage admin :", e);
    }
    setAdminMode(true);
  };

  const exitAdmin = () => {
    try {
      localStorage.removeItem("cardaris_admin_unlocked");
    } catch (e) {
      console.warn("Impossible de nettoyer localStorage admin :", e);
    }
    setAdminMode(false);
  };

  // Mode admin : on affiche le dashboard Admin
  if (adminMode) {
    return <AdminPortal onExit={exitAdmin} />;
  }

  // Mode normal : portail client + bouton admin caché
  return (
    <>
      <ClientPortal />

      {/* Bouton ADMIN discret en bas à gauche */}
      <button
        type="button"
        onClick={unlockAdmin}
        aria-label="Ouvrir le dashboard admin Cardaris"
        style={{
          position: "fixed",
          left: "18px",
          bottom: "18px",
          padding: "6px 12px",
          borderRadius: "999px",
          border: "1px solid rgba(148,163,184,0.7)",
          background:
            "radial-gradient(circle at top left, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
          color: "#e5e7eb",
          fontSize: "11px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor: "pointer",
          zIndex: 9999,
          opacity: 0.35,
          transition:
            "opacity 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.boxShadow =
            "0 12px 30px rgba(15,23,42,0.9)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.35";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        ADMIN
      </button>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
