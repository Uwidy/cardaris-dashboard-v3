import React, { useState, useEffect } from "react";
import {
  fetchOrders,
  fetchAddresses,
  fetchTickets,
  fetchProfile,
  updateProfile,
  createTicket,
} from "./clientPortalApi";

const TABS = {
  DASHBOARD: "dashboard",
  ORDERS: "orders",
  ADDRESSES: "addresses",
  SUPPORT: "support",
  ACCOUNT: "account",
};

/* ================== CSS global Dashboard Cardaris (injection) ================== */

const CP_STYLES = `
  :root {
    --cp-bg: #05060a;
    --cp-bg-elevated: #11131a;
    --cp-bg-elevated-soft: #171924;
    --cp-border-subtle: rgba(255, 255, 255, 0.05);
    --cp-border-strong: rgba(255, 255, 255, 0.12);
    --cp-text-main: #f5f5f7;
    --cp-text-muted: #a0a3b1;
    --cp-accent: #3c758b;
    --cp-accent-soft: rgba(60, 117, 139, 0.18);
    --cp-radius-xl: 24px;
    --cp-radius-lg: 18px;
    --cp-radius-md: 12px;
    --cp-shadow-soft: 0 18px 40px rgba(0, 0, 0, 0.6);
  }

  .cp-root {
    min-height: 100vh;
    background: radial-gradient(circle at top left, #141828 0, #05060a 40%, #05060a 100%);
    color: var(--cp-text-main);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    padding: 32px;
    box-sizing: border-box;
  }

  .cp-layout {
    max-width: 1320px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
  }

  /* Sidebar */
  .cp-sidebar {
    width: 260px;
    flex-shrink: 0;
    background: linear-gradient(145deg, #0b0c12, #07070d);
    border-radius: var(--cp-radius-xl);
    box-shadow: var(--cp-shadow-soft);
    padding: 20px 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid var(--cp-border-subtle);
  }

  .cp-sidebar-header {
    padding: 4px 10px 8px;
  }

  .cp-sidebar-title {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #f8fafc;
  }

  .cp-sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 4px;
  }

  .cp-sidebar-btn {
    position: relative;
    width: 100%;
    border-radius: 999px;
    border: none;
    padding: 8px 14px;
    background: transparent;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--cp-text-muted);
    font-size: 14px;
    transition: background 0.16s ease, color 0.16s ease, transform 0.08s ease;
  }

  .cp-sidebar-btn:hover {
    background: rgba(255, 255, 255, 0.04);
    color: var(--cp-text-main);
    transform: translateY(-1px);
  }

  .cp-sidebar-btn--active {
    background: radial-gradient(circle at top left, #3c758b 0, #11141f 40%);
    color: #f9fafb;
    box-shadow: 0 0 0 1px rgba(60,117,139,0.8), 0 12px 25px rgba(0,0,0,0.75);
  }

  .cp-sidebar-btn-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  .cp-sidebar-btn-icon {
    font-size: 15px;
  }

  /* BOUTON SE DÉCONNECTER (desktop) -> collé sous "Mon compte" */
  .cp-logout-button {
    margin-top: 8px;
    align-self: stretch;

    border-radius: 999px;
    border: 1px solid rgba(248, 113, 113, 0.55);
    background: rgba(127, 29, 29, 0.45);
    color: #fee2e2;
    font-size: 13px;
    padding: 7px 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background 0.16s ease, transform 0.08s ease, box-shadow 0.16s ease;
  }

  .cp-logout-button:hover {
    background: rgba(185, 28, 28, 0.85);
    box-shadow: 0 12px 25px rgba(127, 29, 29, 0.6);
    transform: translateY(-1px);
  }

  /* Bouton déconnexion flottant (mobile) */
  .cp-logout-floating {
    position: fixed;
    right: 12px;
    bottom: 78px;
    z-index: 45;
    padding-inline: 14px;
    font-size: 12px;
  }

  /* Main */
  .cp-main {
    flex: 1;
    background: radial-gradient(circle at top left, #181b28 0, #10121a 45%, #090a10 100%);
    border-radius: var(--cp-radius-xl);
    padding: 24px 26px 90px;
    box-shadow: var(--cp-shadow-soft);
    border: 1px solid var(--cp-border-subtle);
  }

  .cp-section-header {
    margin-bottom: 22px;
  }

  .cp-section-title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin: 0 0 6px;
  }

  .cp-section-subtitle {
    margin: 0;
    font-size: 14px;
    color: var(--cp-text-muted);
  }

  /* Cards & grid */
  .cp-grid {
    display: grid;
    gap: 16px;
  }

  .cp-grid--3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .cp-grid--2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cp-card {
    background: var(--cp-bg-elevated);
    border-radius: var(--cp-radius-lg);
    padding: 16px 18px;
    border: 1px solid var(--cp-border-subtle);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.65);
  }

  .cp-card--stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }

  .cp-card--form {
    margin-top: 20px;
  }

  .cp-card--compact {
    margin-bottom: 20px;
  }

  .cp-card-title {
    font-size: 17px;
    font-weight: 600;
    margin: 0 0 6px;
  }

  .cp-card-subtitle {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--cp-text-muted);
  }

  /* Metrics */
  .cp-metric-card {
    position: relative;
    overflow: hidden;
  }

  .cp-metric-card::before {
    content: "";
    position: absolute;
    inset: -40%;
    background:
      radial-gradient(circle at 0 0, rgba(60,117,139,0.35), transparent 60%),
      radial-gradient(circle at 100% 100%, rgba(248,250,252,0.06), transparent 55%);
    opacity: 0.7;
    pointer-events: none;
  }

  .cp-metric-label {
    position: relative;
    font-size: 13px;
    color: var(--cp-text-muted);
    margin-bottom: 4px;
  }

  .cp-metric-value {
    position: relative;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .cp-metric-helper {
    position: relative;
    font-size: 12px;
    color: var(--cp-text-muted);
  }

  /* Orders */
  .cp-orders-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cp-order-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cp-order-row:last-child {
    border-bottom: none;
  }

  .cp-order-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cp-order-id {
    font-size: 13px;
    color: var(--cp-text-muted);
  }

  .cp-order-description {
    font-size: 14px;
    font-weight: 500;
  }

  .cp-order-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: var(--cp-text-muted);
    margin-top: 2px;
  }

  .cp-order-total {
    font-weight: 600;
    color: #e5e7eb;
  }

  .cp-order-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  /* Status tags */
  .cp-status-tag {
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 999px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .cp-status-tag--success {
    background: rgba(16, 185, 129, 0.16);
    color: #6ee7b7;
    border: 1px solid rgba(45, 212, 191, 0.5);
  }

  .cp-status-tag--info {
    background: rgba(59, 130, 246, 0.18);
    color: #bfdbfe;
    border: 1px solid rgba(59, 130, 246, 0.65);
  }

  .cp-status-tag--warning {
    background: rgba(234, 179, 8, 0.18);
    color: #facc15;
    border: 1px solid rgba(250, 204, 21, 0.7);
  }

  .cp-status-tag--default {
    background: rgba(148, 163, 184, 0.16);
    color: #e2e8f0;
    border: 1px solid rgba(148, 163, 184, 0.6);
  }

  /* Adresses */
  .cp-address-block {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cp-address-block:last-child {
    border-bottom: none;
  }

  .cp-address-main {
    flex: 1;
  }

  .cp-address-label {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .cp-address-lines {
    font-size: 13px;
    color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .cp-address-phone {
    margin-top: 4px;
  }

  .cp-address-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .cp-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 8px;
    margin-left: 6px;
    border-radius: 999px;
    font-size: 11px;
    background: var(--cp-accent-soft);
    color: #e0f2fe;
    border: 1px solid rgba(56, 189, 248, 0.6);
  }

  /* Formulaires */
  .cp-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 18px;
  }

  .cp-form-vertical {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cp-form-field label {
    display: block;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .cp-input,
  .cp-textarea {
    width: 100%;
    border-radius: 10px;
    border: 1px solid var(--cp-border-strong);
    background: #050710;
    padding: 7px 10px;
    font-size: 13px;
    color: var(--cp-text-main);
    outline: none;
    transition: border 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
  }

  .cp-input::placeholder,
  .cp-textarea::placeholder {
    color: rgba(148, 163, 184, 0.7);
  }

  .cp-input:focus,
  .cp-textarea:focus {
    border-color: rgba(56, 189, 248, 0.9);
    box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.9);
    background: #020617;
  }

  .cp-textarea {
    resize: vertical;
    min-height: 110px;
  }

  .cp-form-checkbox-row {
    grid-column: 1 / -1;
    margin-top: 2px;
  }

  .cp-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--cp-text-muted);
    cursor: pointer;
  }

  .cp-checkbox input {
    width: 15px;
    height: 15px;
    border-radius: 4px;
  }

  .cp-form-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
  }

  .cp-support-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 6px;
  }

  .cp-small {
    font-size: 12px;
    color: var(--cp-text-muted);
    margin: 0 0 6px;
  }

  /* Tickets */
  .cp-ticket-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 13px;
    color: var(--cp-text-muted);
    margin-bottom: 10px;
  }

  .cp-ticket-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cp-ticket-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cp-ticket-row:last-child {
    border-bottom: none;
  }

  .cp-ticket-main {
    flex: 1;
  }

  .cp-ticket-id {
    font-size: 12px;
    color: var(--cp-text-muted);
  }

  .cp-ticket-title {
    font-size: 14px;
    font-weight: 600;
  }

  .cp-ticket-description {
    font-size: 13px;
    color: #e5e7eb;
  }

  .cp-ticket-meta {
    font-size: 12px;
    color: var(--cp-text-muted);
    margin-top: 4px;
  }

  .cp-ticket-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  /* Boutons */
  .cp-btn {
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 12px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
    transition: background 0.16s ease, transform 0.08s ease, box-shadow 0.16s ease, color 0.16s ease, border 0.16s ease;
  }

  .cp-btn--primary {
    background: linear-gradient(135deg, #3c758b, #0ea5e9);
    color: #f9fafb;
    box-shadow: 0 12px 26px rgba(14, 165, 233, 0.55);
  }

  .cp-btn--primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 30px rgba(14, 165, 233, 0.7);
  }

  .cp-btn--outline {
    background: transparent;
    border: 1px solid rgba(148, 163, 184, 0.7);
    color: #e5e7eb;
  }

  .cp-btn--outline:hover {
    border-color: rgba(56, 189, 248, 0.9);
    color: #e0f2fe;
  }

  .cp-btn--ghost {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(15, 23, 42, 0.9);
    color: #e5e7eb;
  }

  .cp-btn--ghost:hover {
    background: rgba(15, 23, 42, 0.95);
  }

  .cp-btn--danger {
    border-color: rgba(248, 113, 113, 0.7);
    color: #fecaca;
  }

  .cp-btn--filter {
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11px;
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(51, 65, 85, 0.8);
    color: #e5e7eb;
  }

  .cp-btn--filter-active {
    background: rgba(15, 23, 42, 1);
    border-color: rgba(56, 189, 248, 0.9);
    color: #e0f2fe;
  }

  /* Account */
  .cp-toggle-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* Bottom nav mobile */

  .cp-bottom-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 6px 10px 10px;
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.1),
      #020617 50%,
      #020617 100%
    );
    border-top: 1px solid rgba(148, 163, 184, 0.3);
    display: flex;
    justify-content: space-around;
    gap: 4px;
    z-index: 40;
    backdrop-filter: blur(14px);
  }

  .cp-bottom-nav-item {
    flex: 1;
    border-radius: 999px;
    border: none;
    padding: 4px 0;
    background: transparent;
    color: #cbd5f5;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 11px;
  }

  .cp-bottom-nav-item-icon {
    font-size: 18px;
    line-height: 1;
  }

  .cp-bottom-nav-label {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .cp-bottom-nav-item--active {
    background: rgba(37, 99, 235, 0.2);
    color: #e5f2ff;
    box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.6);
  }

  /* Loader & error */
  .cp-loader {
    font-size: 13px;
    color: var(--cp-text-muted);
    padding: 8px 0;
  }

  .cp-error {
    font-size: 13px;
    color: #fecaca;
    background: rgba(127, 29, 29, 0.6);
    border-radius: 10px;
    padding: 6px 10px;
    margin-bottom: 8px;
  }

  /* Responsif */
  @media (max-width: 1024px) {
    .cp-layout {
      flex-direction: column;
    }
    .cp-sidebar {
      width: 100%;
      flex-direction: row;
      align-items: center;
      gap: 12px;
      padding: 14px 14px 12px;
    }
    .cp-sidebar-nav {
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .cp-sidebar-btn {
      flex: 0 0 auto;
      min-width: 150px;
    }
    .cp-main {
      padding: 18px 16px 80px;
    }
  }

  @media (max-width: 900px) {
    .cp-root {
      padding: 16px 12px 70px;
    }

    /* Sur mobile : on cache complètement la sidebar */
    .cp-sidebar {
      display: none;
    }

    .cp-layout {
      flex-direction: column;
      gap: 16px;
    }

    .cp-main {
      padding: 16px 14px 80px;
    }

    .cp-grid--3,
    .cp-grid--2 {
      grid-template-columns: 1fr;
    }

    .cp-form-grid {
      grid-template-columns: 1fr;
    }

    .cp-address-block,
    .cp-ticket-row,
    .cp-order-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .cp-address-actions,
    .cp-ticket-side,
    .cp-order-side {
      align-items: flex-start;
    }
  }

  @media (min-width: 901px) {
    .cp-bottom-nav {
      display: none;
    }
  }
`;

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [isMobile, setIsMobile] = useState(false);

  // Injection CSS
  useEffect(() => {
    const styleId = "cardaris-dashboard-styles-v3";
    if (!document.getElementById(styleId)) {
      const tag = document.createElement("style");
      tag.id = styleId;
      tag.innerHTML = CP_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case TABS.DASHBOARD:
        return <DashboardView />;
      case TABS.ORDERS:
        return <OrdersView />;
      case TABS.ADDRESSES:
        return <AddressesView />;
      case TABS.SUPPORT:
        return <SupportView />;
      case TABS.ACCOUNT:
        return <AccountView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="cp-root">
      <div className="cp-layout">
        <aside className="cp-sidebar">
          <div className="cp-sidebar-header">
            <div className="cp-sidebar-title">Espace client Cardaris</div>
          </div>

          <nav className="cp-sidebar-nav">
            <SidebarButton
              label="Tableau de bord"
              active={activeTab === TABS.DASHBOARD}
              onClick={() => setActiveTab(TABS.DASHBOARD)}
              icon="🏠"
            />
            <SidebarButton
              label="Mes commandes"
              active={activeTab === TABS.ORDERS}
              onClick={() => setActiveTab(TABS.ORDERS)}
              icon="📦"
            />
            <SidebarButton
              label="Mes adresses"
              active={activeTab === TABS.ADDRESSES}
              onClick={() => setActiveTab(TABS.ADDRESSES)}
              icon="📍"
            />
            <SidebarButton
              label="Tickets / Support"
              active={activeTab === TABS.SUPPORT}
              onClick={() => setActiveTab(TABS.SUPPORT)}
              icon="🎫"
            />
            <SidebarButton
              label="Mon compte"
              active={activeTab === TABS.ACCOUNT}
              onClick={() => setActiveTab(TABS.ACCOUNT)}
              icon="👤"
            />
          </nav>

          <button
            className="cp-logout-button"
            type="button"
            onClick={() => {
              // À remplacer par la vraie logique de logout plus tard
              alert("Déconnexion (démo) – ici on appellera le logout réel.");
            }}
          >
            Se déconnecter
          </button>
        </aside>

        <main className="cp-main">{renderContent()}</main>
      </div>

      {isMobile && (
        <>
          <div className="cp-bottom-nav">
            <BottomNavItem
              label="Accueil"
              icon="🏠"
              active={activeTab === TABS.DASHBOARD}
              onClick={() => setActiveTab(TABS.DASHBOARD)}
            />
            <BottomNavItem
              label="Commandes"
              icon="📦"
              active={activeTab === TABS.ORDERS}
              onClick={() => setActiveTab(TABS.ORDERS)}
            />
            <BottomNavItem
              label="Adresses"
              icon="📍"
              active={activeTab === TABS.ADDRESSES}
              onClick={() => setActiveTab(TABS.ADDRESSES)}
            />
            <BottomNavItem
              label="Tickets"
              icon="🎫"
              active={activeTab === TABS.SUPPORT}
              onClick={() => setActiveTab(TABS.SUPPORT)}
            />
            <BottomNavItem
              label="Compte"
              icon="👤"
              active={activeTab === TABS.ACCOUNT}
              onClick={() => setActiveTab(TABS.ACCOUNT)}
            />
          </div>

          {/* Bouton déconnexion mobile flottant */}
          <button
            type="button"
            className="cp-logout-button cp-logout-floating"
            onClick={() => {
              alert("Déconnexion (démo) – ici on appellera le logout réel.");
            }}
          >
            Se déconnecter
          </button>
        </>
      )}
    </div>
  );
}

/* ================== Navigation ================== */

function SidebarButton({ label, active, onClick, icon }) {
  return (
    <button
      className={`cp-sidebar-btn ${active ? "cp-sidebar-btn--active" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span className="cp-sidebar-btn-label">
        {icon && <span className="cp-sidebar-btn-icon">{icon}</span>}
        {label}
      </span>
    </button>
  );
}

function BottomNavItem({ label, icon, active, onClick }) {
  return (
    <button
      className={`cp-bottom-nav-item ${
        active ? "cp-bottom-nav-item--active" : ""
      }`}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="cp-bottom-nav-item-icon">{icon}</span>}
      <span className="cp-bottom-nav-label">{label}</span>
    </button>
  );
}

/* ================== Vues ================== */

function DashboardView() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [orders, tickets, addresses] = await Promise.all([
        fetchOrders(),
        fetchTickets(),
        fetchAddresses(),
      ]);
      setOrdersCount(orders.length);
      setTicketsCount(tickets.length);
      setAddressesCount(addresses.length);
    })();
  }, []);

  return (
    <section className="cp-section">
      <header className="cp-section-header">
        <h1 className="cp-section-title">Tableau de bord</h1>
        <p className="cp-section-subtitle">
          Vue d’ensemble de votre activité Cardaris.
        </p>
      </header>

      <div className="cp-grid cp-grid--3">
        <div className="cp-card cp-metric-card">
          <div className="cp-metric-label">Commandes totales</div>
          <div className="cp-metric-value">{ordersCount}</div>
          <div className="cp-metric-helper">
            Dont vos précommandes et commandes passées.
          </div>
        </div>
        <div className="cp-card cp-metric-card">
          <div className="cp-metric-label">Tickets ouverts</div>
          <div className="cp-metric-value">{ticketsCount}</div>
          <div className="cp-metric-helper">
            Notre équipe vous répondra au plus vite.
          </div>
        </div>
        <div className="cp-card cp-metric-card">
          <div className="cp-metric-label">Adresses enregistrées</div>
          <div className="cp-metric-value">{addressesCount}</div>
          <div className="cp-metric-helper">
            Gagnez du temps lors de vos prochaines commandes.
          </div>
        </div>
      </div>
    </section>
  );
}

function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchOrders();
        if (!cancelled) {
          setOrders(data);
        }
      } catch (err) {
        if (!cancelled) setError("Impossible de charger vos commandes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="cp-section">
      <header className="cp-section-header">
        <h1 className="cp-section-title">Mes commandes</h1>
        <p className="cp-section-subtitle">
          Consultez l’historique et le détail de vos commandes Cardaris.
        </p>
      </header>

      <div className="cp-card">
        {error && <div className="cp-error">{error}</div>}
        {loading ? (
          <div className="cp-loader">Chargement de vos commandes...</div>
        ) : orders.length === 0 ? (
          <div className="cp-loader">Aucune commande pour le moment.</div>
        ) : (
          <div className="cp-orders-list">
            {orders.map((order) => (
              <OrderRow key={order.id} {...order} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function OrderRow({
  id,
  date,
  totalFormatted,
  status,
  statusVariant = "default",
  description,
}) {
  return (
    <div className="cp-order-row">
      <div className="cp-order-main">
        <div className="cp-order-id">{id}</div>
        <div className="cp-order-description">{description}</div>
        <div className="cp-order-meta">
          <span className="cp-order-date">Passée le {date}</span>
          <span className="cp-order-total">{totalFormatted}</span>
        </div>
      </div>
      <div className="cp-order-side">
        <span className={`cp-status-tag cp-status-tag--${statusVariant}`}>
          {status}
        </span>
        <button className="cp-btn cp-btn--ghost" type="button">
          Voir le détail
        </button>
      </div>
    </div>
  );
}

/* ========== Mes adresses ========== */

function AddressesView() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAddresses();
        if (!cancelled) setAddresses(data);
      } catch (err) {
        if (!cancelled) setError("Impossible de charger vos adresses.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="cp-section">
      <header className="cp-section-header">
        <h1 className="cp-section-title">Mes adresses</h1>
        <p className="cp-section-subtitle">
          Ajoutez et gérez vos adresses de livraison pour accélérer vos futures
          commandes.
        </p>
      </header>

      <div className="cp-card cp-card--stack">
        {error && <div className="cp-error">{error}</div>}
        {loading ? (
          <div className="cp-loader">Chargement de vos adresses...</div>
        ) : addresses.length === 0 ? (
          <div className="cp-loader">
            Vous n’avez pas encore enregistré d’adresse.
          </div>
        ) : (
          addresses.map((addr) => (
            <AddressBlock
              key={addr.id}
              label={addr.label}
              name={addr.name}
              line1={addr.line1}
              line2={addr.line2}
              zip={addr.zip}
              city={addr.city}
              country={addr.country}
              phone={addr.phone}
              isDefault={addr.isDefault}
            />
          ))
        )}
      </div>

      {/* Formulaire -> toujours en mode démo tant qu’on n’a pas de POST réel */}
      <div className="cp-card cp-card--form">
        <h2 className="cp-card-title">Ajouter une adresse</h2>
        <p className="cp-card-subtitle">
          Dans la version connectée, ce formulaire permettra de créer ou
          modifier vos adresses Cardaris / Shopify.
        </p>

        <form
          className="cp-form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            alert(
              "Démo : l’ajout d’adresse sera connecté à votre compte Cardaris."
            );
          }}
        >
          <div className="cp-form-field">
            <label>Libellé</label>
            <input
              type="text"
              placeholder="Domicile, travail..."
              className="cp-input"
            />
          </div>

          <div className="cp-form-field">
            <label>Nom complet</label>
            <input
              type="text"
              placeholder="Nom et prénom"
              className="cp-input"
            />
          </div>

          <div className="cp-form-field">
            <label>Adresse (ligne 1)</label>
            <input
              type="text"
              placeholder="Numéro et rue"
              className="cp-input"
            />
          </div>

          <div className="cp-form-field">
            <label>Complément d’adresse</label>
            <input
              type="text"
              placeholder="Appartement, bâtiment, etc."
              className="cp-input"
            />
          </div>

          <div className="cp-form-field">
            <label>Code postal</label>
            <input type="text" placeholder="Code postal" className="cp-input" />
          </div>

          <div className="cp-form-field">
            <label>Ville</label>
            <input type="text" placeholder="Ville" className="cp-input" />
          </div>

          <div className="cp-form-field">
            <label>Téléphone</label>
            <input type="tel" placeholder="+33 6 ..." className="cp-input" />
          </div>

          <div className="cp-form-checkbox-row">
            <label className="cp-checkbox">
              <input type="checkbox" defaultChecked />
              <span>Utiliser comme adresse par défaut</span>
            </label>
          </div>

          <div className="cp-form-actions">
            <button type="submit" className="cp-btn cp-btn--primary">
              (Démo) Enregistrer l’adresse
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function AddressBlock({
  label,
  name,
  line1,
  line2,
  zip,
  city,
  country,
  phone,
  isDefault,
}) {
  return (
    <div className="cp-address-block">
      <div className="cp-address-main">
        <div className="cp-address-label">
          {label} {isDefault && <span className="cp-pill">Par défaut</span>}
        </div>
        <div className="cp-address-lines">
          <div>{name}</div>
          <div>{line1}</div>
          {line2 && <div>{line2}</div>}
          <div>
            {zip} {city}
          </div>
          <div>{country}</div>
          <div className="cp-address-phone">Tél. {phone}</div>
        </div>
      </div>
      <div className="cp-address-actions">
        <button className="cp-btn cp-btn--ghost" type="button">
          Modifier
        </button>
        <button className="cp-btn cp-btn--outline" type="button">
          Utiliser pour une commande
        </button>
      </div>
    </div>
  );
}

/* ========== Tickets / Support ========== */

function SupportView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTickets();
        if (!cancelled) setTickets(data);
      } catch (err) {
        if (!cancelled) setError("Impossible de charger vos tickets.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCount = tickets.filter((t) => t.status !== "Résolu").length;
  const resolvedCount = tickets.filter((t) => t.status === "Résolu").length;

  return (
    <section className="cp-section">
      <header className="cp-section-header">
        <h1 className="cp-section-title">Tickets & support</h1>
        <p className="cp-section-subtitle">
          Contactez l’équipe Cardaris pour toute question, problème de livraison
          ou demande spécifique.
        </p>
      </header>

      <div className="cp-card cp-card--compact">
        <div className="cp-ticket-summary">
          <span>{tickets.length} ticket(s)</span>
          <span>• Ouverts : {openCount}</span>
          <span>• Résolus : {resolvedCount}</span>
        </div>
        <div className="cp-ticket-filters">
          <button
            className="cp-btn cp-btn--filter cp-btn--filter-active"
            type="button"
          >
            Tous
          </button>
          <button className="cp-btn cp-btn--filter" type="button">
            Ouverts
          </button>
          <button className="cp-btn cp-btn--filter" type="button">
            En cours
          </button>
          <button className="cp-btn cp-btn--filter" type="button">
            Résolus
          </button>
        </div>
      </div>

      <div className="cp-card cp-card--stack">
        <h2 className="cp-card-title">Vos tickets récents</h2>
        {error && <div className="cp-error">{error}</div>}
        {loading ? (
          <div className="cp-loader">Chargement de vos tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="cp-loader">
            Vous n’avez pas encore ouvert de ticket.
          </div>
        ) : (
          tickets.map((t) => <TicketRow key={t.id} {...t} />)
        )}
      </div>

      <NewTicketForm />
    </section>
  );
}

function TicketRow({
  id,
  title,
  lastUpdate,
  status,
  statusVariant,
  description,
}) {
  return (
    <div className="cp-ticket-row">
      <div className="cp-ticket-main">
        <div className="cp-ticket-id">{id}</div>
        <div className="cp-ticket-title">{title}</div>
        <div className="cp-ticket-description">{description}</div>
        <div className="cp-ticket-meta">
          <span>Dernière mise à jour : {lastUpdate}</span>
        </div>
      </div>
      <div className="cp-ticket-side">
        <span className={`cp-status-tag cp-status-tag--${statusVariant}`}>
          {status}
        </span>
        <button className="cp-btn cp-btn--ghost" type="button">
          Voir la conversation
        </button>
      </div>
    </div>
  );
}

function NewTicketForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  return (
    <div className="cp-card cp-card--form">
      <h2 className="cp-card-title">Ouvrir un nouveau ticket</h2>
      <p className="cp-card-subtitle">
        Expliquez-nous votre demande, nous vous répondrons au plus vite.
      </p>

      <form
        className="cp-form-vertical"
        onSubmit={async (e) => {
          e.preventDefault();
          setSending(true);
          const res = await createTicket({ subject, message });
          setSending(false);
          if (!res.ok) {
            alert(
              "Démo / erreur API : la création de ticket réel sera branchée sur ton backend."
            );
          } else {
            alert("Ticket envoyé (ou simulé en mode démo).");
            setSubject("");
            setMessage("");
          }
        }}
      >
        <div className="cp-form-field">
          <label>Objet de la demande</label>
          <input
            type="text"
            className="cp-input"
            placeholder="Ex : Problème de livraison, question sur une précommande..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="cp-form-field">
          <label>Message</label>
          <textarea
            className="cp-textarea"
            rows={5}
            placeholder="Expliquez votre situation ou votre question avec le plus de détails possibles."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="cp-support-actions">
          <button
            type="button"
            className="cp-btn cp-btn--outline"
            disabled
            title="Fonctionnalité à venir"
          >
            Joindre un fichier (bientôt)
          </button>
          <button
            type="submit"
            className="cp-btn cp-btn--primary"
            disabled={sending}
          >
            {sending ? "Envoi..." : "Envoyer ma demande"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ========== Mon compte ========== */

function AccountView() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProfile();
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) setError("Impossible de charger votre profil.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile) {
    return (
      <section className="cp-section">
        <header className="cp-section-header">
          <h1 className="cp-section-title">Mon compte</h1>
          <p className="cp-section-subtitle">
            Gérez vos informations personnelles et les paramètres de votre
            compte Cardaris.
          </p>
        </header>
        {error && <div className="cp-error">{error}</div>}
        {!error && (
          <div className="cp-loader">Chargement de votre profil...</div>
        )}
      </section>
    );
  }

  return (
    <section className="cp-section">
      <header className="cp-section-header">
        <h1 className="cp-section-title">Mon compte</h1>
        <p className="cp-section-subtitle">
          Gérez vos informations personnelles et les paramètres de votre compte
          Cardaris.
        </p>
      </header>

      <div className="cp-grid cp-grid--2">
        <div className="cp-card cp-card--form">
          <h2 className="cp-card-title">Informations personnelles</h2>
          <div className="cp-form-vertical">
            <div className="cp-form-field">
              <label>Nom complet</label>
              <input
                type="text"
                className="cp-input"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, fullName: e.target.value }))
                }
              />
            </div>
            <div className="cp-form-field">
              <label>Adresse e-mail</label>
              <input
                type="email"
                className="cp-input"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div className="cp-form-field">
              <label>Pseudo Cardaris</label>
              <input
                type="text"
                className="cp-input"
                value={profile.nickname}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, nickname: e.target.value }))
                }
              />
            </div>
            <button
              className="cp-btn cp-btn--primary"
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                const res = await updateProfile(profile);
                setSaving(false);
                if (!res.ok) {
                  alert(
                    "Démo / erreur API : la mise à jour réelle sera branchée sur ton backend."
                  );
                } else {
                  alert("Profil mis à jour (ou simulé en mode démo).");
                }
              }}
            >
              {saving ? "Enregistrement..." : "(Démo) Mettre à jour le profil"}
            </button>
          </div>
        </div>

        <div className="cp-card cp-card--form">
          <h2 className="cp-card-title">Sécurité & préférences</h2>
          <div className="cp-form-vertical">
            <div className="cp-form-field">
              <label>Mot de passe</label>
              <button className="cp-btn cp-btn--outline" type="button">
                Modifier mon mot de passe
              </button>
            </div>

            <div className="cp-form-field">
              <label>Notifications e-mail</label>
              <div className="cp-toggle-row">
                <label className="cp-checkbox">
                  <input
                    type="checkbox"
                    checked={profile.notifications.orders}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        notifications: {
                          ...p.notifications,
                          orders: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span>Suivi de commande & mises à jour importantes</span>
                </label>
              </div>
              <div className="cp-toggle-row">
                <label className="cp-checkbox">
                  <input
                    type="checkbox"
                    checked={profile.notifications.promos}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        notifications: {
                          ...p.notifications,
                          promos: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span>Promotions Cardaris & nouveautés produits</span>
                </label>
              </div>
            </div>

            <div className="cp-form-field">
              <label>Confidentialité</label>
              <p className="cp-small">
                Vous pouvez demander la suppression de votre compte et de vos
                données à tout moment en contactant le support Cardaris.
              </p>
              <button
                className="cp-btn cp-btn--ghost cp-btn--danger"
                type="button"
              >
                Demander la suppression du compte (démo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
