// src/components/CardarisHeader.jsx
import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import logoCardaris from "../assets/logo-cardaris.png";

export default function CardarisHeader() {
  // URL d'accueil de ta boutique Shopify
  // -> paramétrable via .env (VITE_SHOP_URL) sinon fallback sur ton myshopify
  const SHOP_HOME_URL =
    import.meta.env.VITE_SHOP_URL || "https://cardaris.myshopify.com";

  return (
    <header className="cd-header">
      <div className="cd-header-inner">
        {/* GAUCHE : flèche retour (visible surtout sur mobile via CSS) */}
        <div className="cd-left">
          <a
            href={SHOP_HOME_URL}
            className="cd-back-btn"
            aria-label="Retour à la boutique"
          >
            <FiArrowLeft />
          </a>
        </div>

        {/* CENTRE : logo */}
        <div className="cd-center">
          <a href={SHOP_HOME_URL} className="cd-logo-link">
            <img src={logoCardaris} alt="Cardaris" className="cd-logo" />
          </a>
        </div>

        {/* DROITE : navigation desktop */}
        <div className="cd-right">
          <nav className="cd-nav">
            <a href={SHOP_HOME_URL} className="cd-nav-link">
              ACCUEIL
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
