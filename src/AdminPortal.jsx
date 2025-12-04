// src/AdminPortal.jsx
import React, { useState, useEffect } from "react";
import {
  fetchOrders,
  fetchAddresses,
  fetchTickets,
  fetchProfile,
} from "./clientPortalApi";

const ADMIN_TABS = {
  DASHBOARD: "dashboard",
  ORDERS: "orders",
  TICKETS: "tickets",
  CUSTOMERS: "customers",
};

export default function AdminPortal({ onExit }) {
  const [activeTab, setActiveTab] = useState(ADMIN_TABS.DASHBOARD);

  const [loading, setLoading] = useState(true);
  const [loadingSecondary, setLoadingSecondary] = useState(false);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    openTickets: 0,
    totalAddresses: 0,
    lastOrderDate: null,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    setError(null);

    try {
      const [ordersData, addressesData, ticketsData, profileData] =
        await Promise.all([
          fetchOrders().catch(() => []),
          fetchAddresses().catch(() => []),
          fetchTickets().catch(() => []),
          fetchProfile().catch(() => null),
        ]);

      const safeOrders = Array.isArray(ordersData) ? ordersData : [];
      const safeAddresses = Array.isArray(addressesData) ? addressesData : [];
      const safeTickets = Array.isArray(ticketsData) ? ticketsData : [];

      setOrders(safeOrders);
      setAddresses(safeAddresses);
      setTickets(safeTickets);
      setProfile(profileData || null);

      computeStats(safeOrders, safeTickets, safeAddresses);
    } catch (e) {
      console.error("Erreur chargement admin:", e);
      setError("Impossible de charger les données admin. Vérifie l'API.");
    } finally {
      setLoading(false);
    }
  }

  function computeStats(ordersList, ticketsList, addressesList) {
    const ordersArray = Array.isArray(ordersList) ? ordersList : [];
    const ticketsArray = Array.isArray(ticketsList) ? ticketsList : [];
    const addressesArray = Array.isArray(addressesList) ? addressesList : [];

    const totalOrders = ordersArray.length;

    const totalRevenue = ordersArray.reduce((sum, order) => {
      const price =
        order.totalPrice ??
        order.total_price ??
        order.total ??
        order.totalTtc ??
        0;
      const numeric = typeof price === "string" ? parseFloat(price) : price;
      return sum + (Number.isFinite(numeric) ? numeric : 0);
    }, 0);

    const openTickets = ticketsArray.filter((t) => {
      const s = (t.status || "").toLowerCase();
      return s === "open" || s === "ouvert" || s === "pending";
    }).length;

    const lastOrderDate = ordersArray
      .map((o) => o.createdAt || o.created_at || o.date)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    setStats({
      totalOrders,
      totalRevenue,
      openTickets,
      totalAddresses: addressesArray.length,
      lastOrderDate: lastOrderDate || null,
    });
  }

  async function refreshSection() {
    setLoadingSecondary(true);
    setError(null);

    try {
      const [ordersData, addressesData, ticketsData] = await Promise.all([
        fetchOrders().catch(() => []),
        fetchAddresses().catch(() => []),
        fetchTickets().catch(() => []),
      ]);

      const safeOrders = Array.isArray(ordersData) ? ordersData : [];
      const safeAddresses = Array.isArray(addressesData) ? addressesData : [];
      const safeTickets = Array.isArray(ticketsData) ? ticketsData : [];

      setOrders(safeOrders);
      setAddresses(safeAddresses);
      setTickets(safeTickets);

      computeStats(safeOrders, safeTickets, safeAddresses);
    } catch (e) {
      console.error("Erreur refresh admin:", e);
      setError("Erreur lors de l'actualisation des données.");
    } finally {
      setLoadingSecondary(false);
    }
  }

  function formatCurrency(value) {
    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(value || 0);
    } catch {
      return `${value ?? 0} €`;
    }
  }

  function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="portal-root portal-root--admin">
      {/* HEADER ADMIN */}
      <header className="portal-header portal-header--admin">
        <div className="portal-header__left">
          <h1 className="portal-header__title">Cardaris — Admin</h1>
          <span className="portal-header__badge">Mode administrateur</span>
        </div>
        <div className="portal-header__right">
          {profile && (
            <div className="portal-header__user">
              <span className="portal-header__user-name">
                {profile.fullName || profile.name || "Admin"}
              </span>
              <span className="portal-header__user-email">
                {profile.email || ""}
              </span>
            </div>
          )}

          <button
            type="button"
            className="portal-header__btn portal-header__btn--secondary"
            onClick={refreshSection}
            disabled={loadingSecondary}
          >
            {loadingSecondary ? "Actualisation..." : "Actualiser les données"}
          </button>

          <button
            type="button"
            className="portal-header__btn portal-header__btn--danger"
            onClick={onExit}
          >
            Quitter le mode admin
          </button>
        </div>
      </header>

      {/* TABS */}
      <nav className="portal-tabs portal-tabs--admin" aria-label="Onglets admin">
        <button
          type="button"
          className={`portal-tab-btn ${
            activeTab === ADMIN_TABS.DASHBOARD ? "portal-tab-btn--active" : ""
          }`}
          onClick={() => setActiveTab(ADMIN_TABS.DASHBOARD)}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={`portal-tab-btn ${
            activeTab === ADMIN_TABS.ORDERS ? "portal-tab-btn--active" : ""
          }`}
          onClick={() => setActiveTab(ADMIN_TABS.ORDERS)}
        >
          Commandes
        </button>
        <button
          type="button"
          className={`portal-tab-btn ${
            activeTab === ADMIN_TABS.TICKETS ? "portal-tab-btn--active" : ""
          }`}
          onClick={() => setActiveTab(ADMIN_TABS.TICKETS)}
        >
          Tickets support
        </button>
        <button
          type="button"
          className={`portal-tab-btn ${
            activeTab === ADMIN_TABS.CUSTOMERS ? "portal-tab-btn--active" : ""
          }`}
          onClick={() => setActiveTab(ADMIN_TABS.CUSTOMERS)}
        >
          Clients / adresses
        </button>
      </nav>

      {/* CONTENU */}
      <main className="portal-main portal-main--admin">
        {loading ? (
          <div className="portal-loading">
            <p>Chargement des données admin...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="portal-alert portal-alert--error">
                {error}
              </div>
            )}

            {activeTab === ADMIN_TABS.DASHBOARD && (
              <AdminDashboardTab stats={stats} />
            )}

            {activeTab === ADMIN_TABS.ORDERS && (
              <AdminOrdersTab
                orders={orders}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            )}

            {activeTab === ADMIN_TABS.TICKETS && (
              <AdminTicketsTab tickets={tickets} formatDate={formatDate} />
            )}

            {activeTab === ADMIN_TABS.CUSTOMERS && (
              <AdminCustomersTab
                profile={profile}
                addresses={addresses}
                formatDate={formatDate}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ================== ONGLETS ================== */

function AdminDashboardTab({ stats }) {
  return (
    <section className="admin-section admin-section--dashboard">
      <div className="admin-grid admin-grid--stats">
        <div className="admin-card admin-card--stat">
          <h3>Total commandes</h3>
          <p className="admin-stat-value">{stats.totalOrders}</p>
        </div>
        <div className="admin-card admin-card--stat">
          <h3>Chiffre d'affaires (estimé)</h3>
          <p className="admin-stat-value">
            {Number(stats.totalRevenue).toLocaleString("fr-FR", {
              maximumFractionDigits: 2,
            })}{" "}
            €
          </p>
        </div>
        <div className="admin-card admin-card--stat">
          <h3>Tickets ouverts</h3>
          <p className="admin-stat-value">{stats.openTickets}</p>
        </div>
        <div className="admin-card admin-card--stat">
          <h3>Adresses client</h3>
          <p className="admin-stat-value">{stats.totalAddresses}</p>
        </div>
        <div className="admin-card admin-card--stat admin-card--wide">
          <h3>Dernière commande</h3>
          <p className="admin-stat-value">
            {stats.lastOrderDate
              ? new Date(stats.lastOrderDate).toLocaleString("fr-FR")
              : "Aucune commande"}
          </p>
        </div>
      </div>
    </section>
  );
}

function AdminOrdersTab({ orders, formatCurrency, formatDate }) {
  return (
    <section className="admin-section admin-section--orders">
      <header className="admin-section__header">
        <div>
          <h2>Commandes</h2>
          <p>Vue synthétique des commandes récupérées depuis l'API.</p>
        </div>
        <span className="admin-chip">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </span>
      </header>

      {orders.length === 0 ? (
        <p className="admin-empty">Aucune commande trouvée.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Client</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id || idx}>
                  <td>{order.name || order.orderNumber || `#${idx + 1}`}</td>
                  <td>
                    {formatDate(
                      order.createdAt || order.created_at || order.date
                    )}
                  </td>
                  <td>
                    {order.customerName ||
                      order.customer_name ||
                      order.customerEmail ||
                      "-"}
                  </td>
                  <td>
                    {formatCurrency(
                      order.totalPrice ??
                        order.total_price ??
                        order.total ??
                        order.totalTtc
                    )}
                  </td>
                  <td>{order.status || order.financialStatus || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AdminTicketsTab({ tickets, formatDate }) {
  return (
    <section className="admin-section admin-section--tickets">
      <header className="admin-section__header">
        <div>
          <h2>Tickets support</h2>
          <p>Suivi des demandes créées par les clients via le portail.</p>
        </div>
        <span className="admin-chip">
          {tickets.length} ticket{tickets.length > 1 ? "s" : ""}
        </span>
      </header>

      {tickets.length === 0 ? (
        <p className="admin-empty">Aucun ticket pour l'instant.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Objet</th>
                <th>Client</th>
                <th>Statut</th>
                <th>Créé le</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, idx) => (
                <tr key={t.id || idx}>
                  <td>{t.id || `#${idx + 1}`}</td>
                  <td>{t.subject || t.title || "-"}</td>
                  <td>{t.customerEmail || t.email || "-"}</td>
                  <td>{t.status || "-"}</td>
                  <td>{formatDate(t.createdAt || t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AdminCustomersTab({ profile, addresses, formatDate }) {
  return (
    <section className="admin-section admin-section--customers">
      <header className="admin-section__header">
        <div>
          <h2>Clients / Adresses</h2>
          <p>
            Aperçu du client courant (profil utilisé pour le portail) et de ses
            adresses.
          </p>
        </div>
      </header>

      <div className="admin-grid admin-grid--two">
        <div className="admin-card">
          <h3>Client actif (portail)</h3>
          {profile ? (
            <ul className="admin-list">
              <li>
                <strong>Nom :</strong>{" "}
                {profile.fullName || profile.name || "-"}
              </li>
              <li>
                <strong>Email :</strong> {profile.email || "-"}
              </li>
              <li>
                <strong>Pseudo :</strong> {profile.nickname || "-"}
              </li>
              {profile.mode && (
                <li>
                  <strong>Mode :</strong> {profile.mode}
                </li>
              )}
            </ul>
          ) : (
            <p className="admin-empty">Aucun profil récupéré.</p>
          )}
        </div>

        <div className="admin-card">
          <h3>Adresses ({addresses.length})</h3>
          {addresses.length === 0 ? (
            <p className="admin-empty">Aucune adresse enregistrée.</p>
          ) : (
            <ul className="admin-list admin-list--addresses">
              {addresses.map((addr, idx) => (
                <li key={addr.id || idx}>
                  <div className="admin-address-line">
                    <span className="admin-address-name">
                      {addr.name || addr.full_name || "-"}
                    </span>
                    {addr.isDefault && (
                      <span className="admin-chip admin-chip--success">
                        Défaut
                      </span>
                    )}
                  </div>
                  <div className="admin-address-details">
                    {addr.address1 && <div>{addr.address1}</div>}
                    {addr.address2 && <div>{addr.address2}</div>}
                    <div>
                      {(addr.zip || addr.postcode || "") +
                        " " +
                        (addr.city || "")}
                    </div>
                    <div>{addr.country || ""}</div>
                    {addr.phone && <div>Tél : {addr.phone}</div>}
                    {addr.updatedAt && (
                      <div className="admin-address-date">
                        Maj : {formatDate(addr.updatedAt)}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
