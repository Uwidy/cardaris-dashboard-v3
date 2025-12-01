import { useState } from "react";
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Données mock (comme si ça venait d'une API) ---

const mockKpis = {
  revenueToday: {
    label: "Chiffre d’affaires",
    value: "1 482,90 €",
    badge: "+18,4%",
    badgeType: "up",
    sub: "vs hier",
  },
  orders24h: {
    label: "Commandes",
    value: "39",
    badge: "+9",
    badgeType: "up",
    sub: "nouvelles vs moyenne",
  },
  newCustomers: {
    label: "Nouveaux clients",
    value: "12",
    badge: "+3",
    badgeType: "up",
    sub: "vs 7j glissants",
  },
  criticalStock: {
    label: "Stock critique",
    value: "7 produits",
    badge: "Urgent",
    badgeType: "down",
    sub: "Revoir les réassorts",
  },
};

const mockRecentOrders = [
  {
    id: "#1048",
    customer: "Antoine L.",
    date: "30/11 — 18:42",
    amount: "89,90 €",
    amountValue: 89.9,
    status: "paid",
    channel: "Boutique",
  },
  {
    id: "#1047",
    customer: "Sarah P.",
    date: "30/11 — 18:03",
    amount: "42,50 €",
    amountValue: 42.5,
    status: "pending",
    channel: "Mobile",
  },
  {
    id: "#1046",
    customer: "David R.",
    date: "30/11 — 17:27",
    amount: "159,00 €",
    amountValue: 159.0,
    status: "paid",
    channel: "Boutique",
  },
  {
    id: "#1045",
    customer: "Julie M.",
    date: "30/11 — 16:10",
    amount: "24,90 €",
    amountValue: 24.9,
    status: "canceled",
    channel: "Marketplace",
  },
];

const mockAllOrders = [
  ...mockRecentOrders,
  {
    id: "#1044",
    customer: "Romain D.",
    date: "30/11 — 15:32",
    amount: "69,90 €",
    amountValue: 69.9,
    status: "paid",
    channel: "Boutique",
  },
];

const mockTasks = [
  {
    label: "Réassort Pokémon — Flammes Fantasmagoriques (stock < 5).",
    type: "danger",
    tag: "Stock",
  },
  {
    label: "Répondre aux 3 messages clients en attente.",
    type: "warn",
    tag: "Support",
  },
  {
    label: "Campagne Facebook TCG en cours (ROAS 3,1).",
    type: "ok",
    tag: "Marketing",
    muted: true,
  },
  {
    label: "Vérifier la marge sur boosters One Piece.",
    type: "warn",
    tag: "Analyse",
  },
];

// Ventes journalières mock pour le graphique
const mockSalesDaily = [
  { day: "Lun", revenue: 320 },
  { day: "Mar", revenue: 540 },
  { day: "Mer", revenue: 410 },
  { day: "Jeu", revenue: 680 },
  { day: "Ven", revenue: 890 },
  { day: "Sam", revenue: 760 },
  { day: "Dim", revenue: 520 },
];

// Produits & stocks mock
const mockProducts = [
  {
    id: "P-001",
    name: "Pokémon — Display Flammes Fantasmagoriques FR",
    sku: "PKM-FF-DISP-FR",
    category: "Pokémon",
    stock: 4,
    price: 149.9,
    status: "low", // ok | low | out
  },
  {
    id: "P-002",
    name: "Pokémon — Booster Flammes Fantasmagoriques FR",
    sku: "PKM-FF-BST-FR",
    category: "Pokémon",
    stock: 132,
    price: 5.99,
    status: "ok",
  },
  {
    id: "P-003",
    name: "One Piece — Display Paramount War JP",
    sku: "OPC-PW-DISP-JP",
    category: "One Piece",
    stock: 0,
    price: 119.9,
    status: "out",
  },
  {
    id: "P-004",
    name: "Lorcana — Coffret Collectionneur",
    sku: "LOR-CC-BOX",
    category: "Lorcana",
    stock: 7,
    price: 79.9,
    status: "low",
  },
  {
    id: "P-005",
    name: "Yu-Gi-Oh! — Boîte Méga Tin 2024",
    sku: "YGO-MEGA-2024",
    category: "Yu-Gi-Oh!",
    stock: 22,
    price: 24.9,
    status: "ok",
  },
];

function App() {
  const [activePage, setActivePage] = useState("overview"); // overview | orders | products | clients
  const [searchTerm, setSearchTerm] = useState("");

  const linkClass = (page) =>
    "sidebar__link" + (activePage === page ? " sidebar__link--active" : "");

  const handleNavClick = (page) => {
    setActivePage(page);
    setSearchTerm("");
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">C</div>
          <div>
            <div className="sidebar__logo-title">Cardaris</div>
            <div className="sidebar__logo-sub">Dashboard V3</div>
          </div>
        </div>

        <div>
          <div className="sidebar__section-title">Navigation</div>
          <nav className="sidebar__nav">
            <div
              className={linkClass("overview")}
              onClick={() => handleNavClick("overview")}
            >
              <div className="sidebar__link-main">
                <div className="sidebar__link-icon">🏠</div>
                <span className="sidebar__link-label">Vue d’ensemble</span>
              </div>
              <span>›</span>
            </div>

            <div
              className={linkClass("orders")}
              onClick={() => handleNavClick("orders")}
            >
              <div className="sidebar__link-main">
                <div className="sidebar__link-icon">🧾</div>
                <span className="sidebar__link-label">Commandes</span>
              </div>
              <span className="sidebar__link-badge">
                +{mockAllOrders.length}
              </span>
            </div>

            <div
              className={linkClass("products")}
              onClick={() => handleNavClick("products")}
            >
              <div className="sidebar__link-main">
                <div className="sidebar__link-icon">🎴</div>
                <span className="sidebar__link-label">Produits & stocks</span>
              </div>
              <span>›</span>
            </div>

            <div
              className={linkClass("clients")}
              onClick={() => handleNavClick("clients")}
            >
              <div className="sidebar__link-main">
                <div className="sidebar__link-icon">🧍</div>
                <span className="sidebar__link-label">Clients</span>
              </div>
              <span>›</span>
            </div>
          </nav>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__footer-title">Mode Ultra Premium</div>
          <div>
            Active une vue avancée des KPIs Cardaris (CA détaillé, cohortes
            clients, retours, etc.).
          </div>
          <div className="sidebar__footer-cta">
            <span>Activer la vue avancée</span>
            <span>✨</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <header className="main__topbar">
          <div className="main__topbar-left">
            <div className="main__title">
              {activePage === "overview" && "Vue d’ensemble"}
              {activePage === "orders" && "Commandes"}
              {activePage === "products" && "Produits & stocks"}
              {activePage === "clients" && "Clients"}
            </div>
            <div className="main__subtitle">
              {activePage === "overview" &&
                "Résumé de l’activité Cardaris sur les dernières 24 heures."}
              {activePage === "orders" &&
                "Liste et suivi des commandes Cardaris."}
              {activePage === "products" &&
                "Suivi de tes produits TCG, niveaux de stock et ruptures."}
              {activePage === "clients" &&
                "Vue d’ensemble de ta base clients Cardaris."}
            </div>
          </div>

          <div className="main__topbar-right">
            <div className="topbar-search">
              <span>🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activePage === "clients"
                    ? "Rechercher un client…"
                    : activePage === "products"
                    ? "Rechercher un produit…"
                    : "Rechercher une commande, un client..."
                }
              />
            </div>
            <button className="topbar-icon-btn" title="Notifications">
              🔔
            </button>
            <div className="topbar-avatar">
              <div className="topbar-avatar-circle">GS</div>
              <div>
                <div className="topbar-avatar-name">Guillaume</div>
                <div className="topbar-avatar-role">Admin Cardaris</div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENU PRINCIPAL SELON LA PAGE */}
        {activePage === "overview" && (
          <OverviewSection
            kpis={mockKpis}
            orders={mockRecentOrders}
            tasks={mockTasks}
          />
        )}

        {activePage === "orders" && (
          <OrdersSection orders={mockAllOrders} searchTerm={searchTerm} />
        )}

        {activePage === "products" && (
          <ProductsSection products={mockProducts} searchTerm={searchTerm} />
        )}

        {activePage === "clients" && <ClientsSection />}
      </main>
    </div>
  );
}

/* SECTION VUE D’ENSEMBLE */
function OverviewSection({ kpis, orders, tasks }) {
  return (
    <section className="main__grid">
      {/* KPIs */}
      <div className="kpi-row">
        <KpiCard
          title={kpis.revenueToday.label}
          value={kpis.revenueToday.value}
          badge={kpis.revenueToday.badge}
          badgeType={kpis.revenueToday.badgeType}
          sub={kpis.revenueToday.sub}
          pill="Aujourd’hui"
        />
        <KpiCard
          title={kpis.orders24h.label}
          value={kpis.orders24h.value}
          badge={kpis.orders24h.badge}
          badgeType={kpis.orders24h.badgeType}
          sub={kpis.orders24h.sub}
          pill="24h"
        />
        <KpiCard
          title={kpis.newCustomers.label}
          value={kpis.newCustomers.value}
          badge={kpis.newCustomers.badge}
          badgeType={kpis.newCustomers.badgeType}
          sub={kpis.newCustomers.sub}
          pill="24h"
        />
        <KpiCard
          title={kpis.criticalStock.label}
          value={kpis.criticalStock.value}
          badge={kpis.criticalStock.badge}
          badgeType={kpis.criticalStock.badgeType}
          sub={kpis.criticalStock.sub}
          pill="Alertes"
        />
      </div>

      {/* Bloc ventes / graphique */}
      <div className="card card-chart">
        <div className="chart__header">
          <div>
            <div className="chart__title">Ventes par jour</div>
            <div className="chart__subtitle">
              Aperçu des ventes Cardaris par jour (montant validé).
            </div>
          </div>
          <div className="chart__filters">
            <button className="chip chip--active">7 jours</button>
            <button className="chip">30 jours</button>
            <button className="chip">90 jours</button>
          </div>
        </div>

        <div className="chart__body">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart
              data={mockSalesDaily}
              margin={{ top: 10, right: 14, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.25)"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(148,163,184,0.9)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(148,163,184,0.9)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020308",
                  border: "1px solid rgba(148,163,184,0.6)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "rgba(148,163,184,0.9)" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3C758B"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bloc commandes récentes */}
      <div className="card card-table">
        <div className="card__header">
          <div>
            <div className="card__title">Commandes récentes</div>
            <div className="card__subtitle">
              Dernières commandes Shopify Cardaris synchronisées.
            </div>
          </div>
          <div className="card__pill">Voir toutes</div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Canal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span
                      className={
                        "badge-status " + statusClassFromStatus(order.status)
                      }
                    >
                      {statusLabelFromStatus(order.status)}
                    </span>
                  </td>
                  <td>{order.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloc tâches / alertes */}
      <div className="card card-tasks card--soft">
        <div className="card__header">
          <div>
            <div className="card__title">Alertes & tâches</div>
            <div className="card__subtitle">
              Ce qu&apos;il faut prioriser sur Cardaris aujourd&apos;hui.
            </div>
          </div>
          <div className="card__pill">Todo</div>
        </div>

        <div className="task-list">
          {tasks.map((task, index) => (
            <div className="task-item" key={index}>
              <div className="task-item-main">
                <span
                  className={
                    "task-dot " +
                    (task.type === "danger"
                      ? "task-dot--danger"
                      : task.type === "ok"
                      ? "task-dot--ok"
                      : "")
                  }
                />
                <span className={task.muted ? "task-label-muted" : undefined}>
                  {task.label}
                </span>
              </div>
              <span className="task-tag">{task.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* SECTION COMMANDES — avec mini analytics + recherche */
function OrdersSection({ orders, searchTerm }) {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.amountValue, 0);
  const paidCount = orders.filter((o) => o.status === "paid").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const canceledCount = orders.filter((o) => o.status === "canceled").length;

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.channel.toLowerCase().includes(q)
    );
  });

  return (
    <section className="main__grid">
      {/* Mini KPIs commandes */}
      <div className="kpi-row" style={{ gridColumn: "1 / -1" }}>
        <div className="card">
          <div className="card__header">
            <div className="card__title">Nombre de commandes</div>
            <div className="card__pill">Période mock</div>
          </div>
          <div className="kpi__value">{totalOrders}</div>
          <div className="kpi__trend">
            <span>Total inclus : payées, en attente, annulées.</span>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div className="card__title">CA total</div>
            <div className="card__pill">Mock</div>
          </div>
          <div className="kpi__value">{formatEuro(totalRevenue)}</div>
          <div className="kpi__trend">
            <span className="kpi__trend-badge kpi__trend-badge--up">
              ▲ Calculé sur {totalOrders} commandes
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div className="card__title">Payées / En attente</div>
            <div className="card__pill">Statuts</div>
          </div>
          <div className="kpi__value">
            {paidCount} / {pendingCount}
          </div>
          <div className="kpi__trend">
            <span>Commandes payées vs en attente.</span>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div className="card__title">Annulées</div>
            <div className="card__pill">Qualité</div>
          </div>
          <div className="kpi__value">{canceledCount}</div>
          <div className="kpi__trend">
            <span className="kpi__trend-badge kpi__trend-badge--down">
              ▼ À surveiller
            </span>
          </div>
        </div>
      </div>

      {/* Tableau commandes */}
      <div className="card card-table" style={{ gridColumn: "1 / -1" }}>
        <div className="card__header">
          <div>
            <div className="card__title">Toutes les commandes</div>
            <div className="card__subtitle">
              Vue liste de tes commandes (mock) — filtrage en temps réel.
            </div>
          </div>
          <div className="card__pill">Recherche par #, client, canal</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Canal</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span
                      className={
                        "badge-status " + statusClassFromStatus(order.status)
                      }
                    >
                      {statusLabelFromStatus(order.status)}
                    </span>
                  </td>
                  <td>{order.channel}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6}>Aucune commande ne correspond à ta recherche.</td>
                </tr>
              )}
              <tr>
                <td colSpan={6}>
                  (Ici on branchera plus tard les vraies données Shopify/API.)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* SECTION PRODUITS & STOCKS — avec recherche */
function ProductsSection({ products, searchTerm }) {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.stock * p.price,
    0
  );
  const lowCount = products.filter((p) => p.status === "low").length;
  const outCount = products.filter((p) => p.status === "out").length;

  const filteredProducts = products.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <section className="main__grid">
      {/* KPIs produits */}
      <div className="kpi-row" style={{ gridColumn: "1 / -1" }}>
        <div className="card">
          <div className="card__header">
            <div className="card__title">Nombre de produits</div>
            <div className="card__pill">Catalogue</div>
          </div>
          <div className="kpi__value">{totalProducts}</div>
          <div className="kpi__trend">
            <span>Total produits TCG suivis dans Cardaris.</span>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div className="card__title">Stock total</div>
            <div className="card__pill">Unités</div>
          </div>
          <div className="kpi__value">{totalStock}</div>
          <div className="kpi__trend">
            <span>Unités toutes gammes confondues.</span>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div className="card__title">Valeur stock</div>
            <div className="card__pill">Estimée</div>
          </div>
          <div className="kpi__value">{formatEuro(totalStockValue)}</div>
          <div className="kpi__trend">
            <span className="kpi__trend-badge kpi__trend-badge--up">
              ▲ Basée sur prix publics
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div className="card__title">Critique / Rupture</div>
            <div className="card__pill">Alertes</div>
          </div>
          <div className="kpi__value">
            {lowCount} / {outCount}
          </div>
          <div className="kpi__trend">
            <span>Produits à réassort / déjà en rupture.</span>
          </div>
        </div>
      </div>

      {/* Tableau produits */}
      <div className="card card-table" style={{ gridColumn: "1 / -1" }}>
        <div className="card__header">
          <div>
            <div className="card__title">Produits & niveaux de stock</div>
            <div className="card__subtitle">
              Liste simplifiée de tes produits TCG (mock) — filtrable.
            </div>
          </div>
          <div className="card__pill">Recherche par nom, SKU, catégorie</div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Référence</th>
                <th>Catégorie</th>
                <th>Stock</th>
                <th>Prix</th>
                <th>Valeur stock</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>{formatEuro(p.price)}</td>
                  <td>{formatEuro(p.stock * p.price)}</td>
                  <td>
                    <span
                      className={
                        "badge-status " + stockClassFromStatus(p.status)
                      }
                    >
                      {stockLabelFromStatus(p.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    Aucun produit ne correspond à ta recherche pour le moment.
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={7}>
                  (Ici on branchera plus tard les vrais produits Shopify +
                  seuils de stock configurables.)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* SECTION CLIENTS (placeholder pour plus tard) */
function ClientsSection() {
  return (
    <section className="main__grid">
      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <div className="card__header">
          <div className="card__title">Clients</div>
          <div className="card__pill">Vue liste</div>
        </div>
        <p className="card__subtitle">
          Ici on pourra afficher la liste des clients, leur CLV, nombre de
          commandes, etc. (mock pour l&apos;instant).
        </p>
      </div>
    </section>
  );
}

/* Composant KPI réutilisable */
function KpiCard({ title, value, badge, badgeType, sub, pill }) {
  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title">{title}</div>
        <div className="card__pill">{pill}</div>
      </div>
      <div className="kpi__value">{value}</div>
      <div className="kpi__trend">
        <span
          className={
            "kpi__trend-badge " +
            (badgeType === "up"
              ? "kpi__trend-badge--up"
              : "kpi__trend-badge--down")
          }
        >
          {badgeType === "up" ? "▲ " : "▼ "}
          {badge}
        </span>
        <span>{sub}</span>
      </div>
      <div className="kpi__sparkline" />
    </div>
  );
}

/* Helpers statut + format */

function statusClassFromStatus(status) {
  if (status === "paid") return "badge-status--paid";
  if (status === "pending") return "badge-status--pending";
  if (status === "canceled") return "badge-status--canceled";
  return "";
}

function statusLabelFromStatus(status) {
  if (status === "paid") return "Payée";
  if (status === "pending") return "En attente";
  if (status === "canceled") return "Annulée";
  return status;
}

function stockClassFromStatus(status) {
  if (status === "ok") return "badge-stock--ok";
  if (status === "low") return "badge-stock--low";
  if (status === "out") return "badge-stock--out";
  return "";
}

function stockLabelFromStatus(status) {
  if (status === "ok") return "OK";
  if (status === "low") return "Critique";
  if (status === "out") return "Rupture";
  return status;
}

function formatEuro(amount) {
  return amount.toFixed(2).replace(".", ",") + " €";
}

export default App;
