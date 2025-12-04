// src/AdminPortal.jsx
import React, { useEffect, useState } from "react";
import "./admin.css";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiHelpCircle,
  FiSettings,
  FiBarChart2,
  FiPackage,
} from "react-icons/fi";
import {
  fetchAdminOverview,
  fetchAdminRecentOrders,
  fetchAdminOrders,
  fetchAdminTickets,
} from "./cardarisApi";

const TABS = {
  DASHBOARD: "dashboard",
  ORDERS: "orders",
  PRODUCTS: "products",
  CUSTOMERS: "customers",
  TICKETS: "tickets",
  SETTINGS: "settings",
};

export default function AdminPortal({ onExit }) {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case TABS.DASHBOARD:
        return <DashboardView />;
      case TABS.ORDERS:
        return <OrdersView />;
      case TABS.PRODUCTS:
        return <ProductsView />;
      case TABS.CUSTOMERS:
        return <CustomersView />;
      case TABS.TICKETS:
        return <TicketsView />;
      case TABS.SETTINGS:
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-shell">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            <div className="admin-logo-mark">C</div>
            <div className="admin-logo-text">
              <span className="admin-logo-title">Cardaris</span>
              <span className="admin-logo-sub">Admin console</span>
            </div>
          </div>

          <nav className="admin-sidebar__nav">
            <SidebarItem
              icon={<FiHome />}
              label="Dashboard"
              active={activeTab === TABS.DASHBOARD}
              onClick={() => setActiveTab(TABS.DASHBOARD)}
            />
            <SidebarItem
              icon={<FiShoppingBag />}
              label="Commandes"
              active={activeTab === TABS.ORDERS}
              onClick={() => setActiveTab(TABS.ORDERS)}
            />
            <SidebarItem
              icon={<FiPackage />}
              label="Produits"
              active={activeTab === TABS.PRODUCTS}
              onClick={() => setActiveTab(TABS.PRODUCTS)}
            />
            <SidebarItem
              icon={<FiUsers />}
              label="Clients"
              active={activeTab === TABS.CUSTOMERS}
              onClick={() => setActiveTab(TABS.CUSTOMERS)}
            />
            <SidebarItem
              icon={<FiHelpCircle />}
              label="Tickets"
              active={activeTab === TABS.TICKETS}
              onClick={() => setActiveTab(TABS.TICKETS)}
            />
          </nav>

          <div className="admin-sidebar__bottom">
            <SidebarItem
              icon={<FiSettings />}
              label="Paramètres"
              active={activeTab === TABS.SETTINGS}
              onClick={() => setActiveTab(TABS.SETTINGS)}
            />

            {/* Bouton retour portail client */}
            <button
              type="button"
              className="admin-logout admin-logout--secondary"
              onClick={() => {
                if (onExit) {
                  onExit();
                }
              }}
            >
              ← Retour espace client
            </button>

            <button
              type="button"
              className="admin-logout"
              onClick={() =>
                alert(
                  "Logout admin (à connecter plus tard à l’auth réelle / Shopify)."
                )
              }
            >
              Se déconnecter
            </button>
          </div>
        </aside>

        {/* CONTENU */}
        <main className="admin-main">
          <AdminTopbar />
          <div className="admin-content">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

/* ====== Composants de layout ====== */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`admin-sidebar-item ${
        active ? "admin-sidebar-item--active" : ""
      }`}
      onClick={onClick}
    >
      <span className="admin-sidebar-item__icon">{icon}</span>
      <span className="admin-sidebar-item__label">{label}</span>
    </button>
  );
}

function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <h1 className="admin-topbar__title">Dashboard admin</h1>
        <p className="admin-topbar__subtitle">
          Vue d’ensemble de l’activité Cardaris (branchée sur ton API, avec
          fallback démo si besoin).
        </p>
      </div>
      <div className="admin-topbar__right">
        <button type="button" className="admin-chip">
          Aujourd’hui
        </button>
        <button type="button" className="admin-chip admin-chip--ghost">
          7 derniers jours
        </button>
        <button type="button" className="admin-chip admin-chip--ghost">
          30 jours
        </button>
        <div className="admin-user-pill">
          <span className="admin-user-pill__avatar">GS</span>
          <div className="admin-user-pill__info">
            <span className="admin-user-pill__name">Guillaume</span>
            <span className="admin-user-pill__role">Super admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ====== Vues ====== */

function DashboardView() {
  const [overview, setOverview] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [ov, orders] = await Promise.all([
          fetchAdminOverview(),
          fetchAdminRecentOrders(5),
        ]);
        if (cancelled) return;
        setOverview(ov);
        setRecentOrders(orders);
      } catch (e) {
        console.error(e);
        if (!cancelled)
          setError("Erreur lors du chargement du dashboard admin.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const ov = overview || {
    dailyRevenue: "0,00 €",
    ordersCount: 0,
    activeCustomers: 0,
    openTickets: 0,
  };

  return (
    <section className="admin-section">
      {error && <div className="cp-error">{error}</div>}

      <div className="admin-kpi-grid">
        <KpiCard
          label="CA du jour"
          value={ov.dailyRevenue}
          change={`${ov.ordersCount} commande(s) aujourd’hui`}
        />
        <KpiCard
          label="Commandes"
          value={ov.ordersCount}
          change="Inclut les précommandes"
        />
        <KpiCard
          label="Clients actifs"
          value={ov.activeCustomers}
          change="Comptes ayant commandé sur la période"
        />
        <KpiCard
          label="Tickets ouverts"
          value={ov.openTickets}
          change="Support client en cours"
        />
      </div>

      <div className="admin-grid-2">
        <div className="admin-card admin-card--chart">
          <div className="admin-card__header">
            <h2 className="admin-card__title">Ventes (7 derniers jours)</h2>
            <span className="admin-card__hint">
              Quand les stats seront prêtes, on branchera un vrai graphique ici.
            </span>
          </div>
          <div className="admin-chart-placeholder">
            <FiBarChart2 className="admin-chart-icon" />
            {loading ? (
              <p>Chargement des données...</p>
            ) : (
              <p>Zone graphique à connecter à ton backend (Recharts, etc.).</p>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">Dernières commandes</h2>
            <span className="admin-card__hint">
              Flux temps réel des commandes en provenance de Shopify / API.
            </span>
          </div>

          {loading ? (
            <p className="admin-section-subtitle">
              Chargement des dernières commandes...
            </p>
          ) : recentOrders.length === 0 ? (
            <p className="admin-section-subtitle">
              Aucune commande récente trouvée.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <OrderRowAdmin
                    key={o.id}
                    id={o.id}
                    customer={o.customer}
                    date={o.date}
                    total={o.total}
                    status={o.status}
                    statusVariant={o.statusVariant || "info"}
                    compact
                  />
                ))}
              </tbody>
            </table>
          )}
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
        const data = await fetchAdminOrders();
        if (!cancelled) setOrders(data);
      } catch (e) {
        console.error(e);
        if (!cancelled)
          setError("Erreur lors du chargement de la liste des commandes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Commandes</h1>
        <p className="admin-section-subtitle">
          Liste consolidée des commandes Cardaris (Shopify, CardMarket, etc.).
        </p>
      </div>

      <div className="admin-card admin-card--table">
        {error && <div className="cp-error">{error}</div>}

        {loading ? (
          <p className="admin-section-subtitle">
            Chargement des commandes admin...
          </p>
        ) : orders.length === 0 ? (
          <p className="admin-section-subtitle">Aucune commande trouvée.</p>
        ) : (
          <table className="admin-table admin-table--full">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Canal</th>
                <th>Total</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <OrderRowAdmin
                  key={o.id}
                  id={o.id}
                  customer={o.customer}
                  date={o.date}
                  channel={o.channel || "Shopify"}
                  total={o.total}
                  status={o.status}
                  statusVariant={o.statusVariant || "info"}
                  compact={false}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/* Les autres vues restent démo */

function ProductsView() {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Produits</h1>
        <p className="admin-section-subtitle">
          Gestion de ton catalogue (Pokémon, One Piece, Yu-Gi-Oh!, etc.).
        </p>
      </div>

      <div className="admin-card admin-card--empty">
        <p>
          Ici, on affichera la liste détaillée des produits avec stock, prix,
          franchise, etc. On branchera ça sur ton backend dès que tu veux.
        </p>
      </div>
    </section>
  );
}

function CustomersView() {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Clients</h1>
        <p className="admin-section-subtitle">
          Vue globale de tes clients Cardaris : comptes créés, commandes, valeur
          lifetime, fidélité…
        </p>
      </div>

      <div className="admin-card admin-card--empty">
        <p>
          Tableau clients à venir : filtre par pays, nombre de commandes, CA
          total, dernière activité, etc.
        </p>
      </div>
    </section>
  );
}

function TicketsView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchAdminTickets();
        if (!cancelled) setTickets(data);
      } catch (e) {
        console.error(e);
        if (!cancelled)
          setError("Erreur lors du chargement des tickets support.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Tickets & support</h1>
        <p className="admin-section-subtitle">
          Suivi des tickets clients ouverts via le portail Cardaris.
        </p>
      </div>

      <div className="admin-card admin-card--table">
        {error && <div className="cp-error">{error}</div>}

        {loading ? (
          <p className="admin-section-subtitle">
            Chargement des tickets admin...
          </p>
        ) : tickets.length === 0 ? (
          <p className="admin-section-subtitle">
            Aucun ticket pour le moment.
          </p>
        ) : (
          <table className="admin-table admin-table--full">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Objet</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Dernière maj</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.subject}</td>
                  <td>{t.priority}</td>
                  <td>{t.status}</td>
                  <td>{t.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function SettingsView() {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Paramètres</h1>
        <p className="admin-section-subtitle">
          Réglages généraux de la console admin Cardaris.
        </p>
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <h2 className="admin-card__title">Général</h2>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>Nom de la boutique</label>
              <input className="admin-input" defaultValue="Cardaris" />
            </div>
            <div className="admin-form-field">
              <label>E-mail de contact</label>
              <input
                className="admin-input"
                defaultValue="support@cardaris.fr"
              />
            </div>
            <div className="admin-form-field admin-form-field--full">
              <label>URL Shopify</label>
              <input
                className="admin-input"
                defaultValue="https://cardaris.myshopify.com"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" type="button">
              Enregistrer (démo)
            </button>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card__title">Sécurité</h2>
          <div className="admin-toggle-list">
            <label className="admin-toggle">
              <input type="checkbox" defaultChecked />
              <span>Accès admin uniquement via IP de confiance</span>
            </label>
            <label className="admin-toggle">
              <input type="checkbox" defaultChecked />
              <span>Double authentification pour les admins</span>
            </label>
            <label className="admin-toggle">
              <input type="checkbox" />
              <span>Autoriser les exports CSV pour tous les rôles</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Petits composants ====== */

function KpiCard({ label, value, change }) {
  return (
    <div className="admin-card admin-card--kpi">
      <div className="admin-kpi-label">{label}</div>
      <div className="admin-kpi-value">{value}</div>
      <div className="admin-kpi-change">{change}</div>
    </div>
  );
}

function OrderRowAdmin({
  id,
  customer,
  date,
  total,
  status,
  statusVariant,
  channel,
  compact = true,
}) {
  return compact ? (
    <tr>
      <td>{id}</td>
      <td>{customer}</td>
      <td>{date}</td>
      <td>{total}</td>
      <td>
        <span className={`admin-status admin-status--${statusVariant}`}>
          {status}
        </span>
      </td>
    </tr>
  ) : (
    <tr>
      <td>{id}</td>
      <td>{customer}</td>
      <td>{date}</td>
      <td>{channel}</td>
      <td>{total}</td>
      <td>
        <span className={`admin-status admin-status--${statusVariant}`}>
          {status}
        </span>
      </td>
      <td className="admin-table__actions">
        <button type="button" className="admin-link">
          Voir
        </button>
      </td>
    </tr>
  );
}
