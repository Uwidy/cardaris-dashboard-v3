// src/cardarisApi.js
//
// Petit client API pour le dashboard ADMIN Cardaris.
// Tu pourras brancher les endpoints réels de ton "cardaris-portal-api" ici.
//

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000")
    .replace(/\/$/, ""); // retire le / final au cas où

async function apiGet(path) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`GET ${url} -> ${res.status}`);
  }

  return res.json();
}

async function apiPost(path, body) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body || {}),
  });

  if (!res.ok) {
    throw new Error(`POST ${url} -> ${res.status}`);
  }

  return res.json();
}

/* ========= ENDPOINTS ADMIN =========
   Adapter les chemins selon ton backend.
   Exemples ci-dessous :
   - GET  /admin/overview       -> stats globales
   - GET  /admin/orders         -> liste commandes
   - GET  /admin/orders/recent  -> dernières commandes
   - GET  /admin/tickets        -> tickets support
*/

export async function fetchAdminOverview() {
  // À adapter : /admin/overview doit renvoyer un objet :
  // { dailyRevenue, ordersCount, activeCustomers, openTickets }
  try {
    const data = await apiGet("/admin/overview");
    return {
      dailyRevenue: data.dailyRevenue ?? "0,00 €",
      ordersCount: data.ordersCount ?? 0,
      activeCustomers: data.activeCustomers ?? 0,
      openTickets: data.openTickets ?? 0,
    };
  } catch (e) {
    console.warn("fetchAdminOverview erreur -> fallback démo", e);
    // Fallback démo si ton backend n’est pas encore prêt
    return {
      dailyRevenue: "2 480,00 €",
      ordersCount: 37,
      activeCustomers: 214,
      openTickets: 5,
    };
  }
}

export async function fetchAdminRecentOrders(limit = 5) {
  try {
    const data = await apiGet(`/admin/orders/recent?limit=${limit}`);
    // On attend un tableau : [{id, customer, date, total, status, statusVariant}, ...]
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("fetchAdminRecentOrders erreur -> demo", e);
    // Fallback démo
    return [
      {
        id: "#1001",
        customer: "Thomas L.",
        date: "10/11/2024",
        total: "129,90 €",
        status: "Expédiée",
        statusVariant: "success",
      },
      {
        id: "#1000",
        customer: "Claire P.",
        date: "10/11/2024",
        total: "89,50 €",
        status: "Préparation",
        statusVariant: "info",
      },
      {
        id: "#0999",
        customer: "CardarisFan",
        date: "09/11/2024",
        total: "249,00 €",
        status: "Livrée",
        statusVariant: "success",
      },
      {
        id: "#0998",
        customer: "Invité",
        date: "09/11/2024",
        total: "54,90 €",
        status: "En attente",
        statusVariant: "warning",
      },
      {
        id: "#0997",
        customer: "Lucas D.",
        date: "08/11/2024",
        total: "39,90 €",
        status: "Annulée",
        statusVariant: "danger",
      },
    ];
  }
}

export async function fetchAdminOrders() {
  try {
    const data = await apiGet("/admin/orders");
    // On attend un tableau : [{id, customer, date, channel, total, status, statusVariant}, ...]
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("fetchAdminOrders erreur -> demo", e);
    // Fallback démo basique
    return [
      {
        id: "#1001",
        customer: "Thomas L.",
        date: "10/11/2024",
        channel: "Shopify",
        total: "129,90 €",
        status: "Expédiée",
        statusVariant: "success",
      },
      {
        id: "#1000",
        customer: "Claire P.",
        date: "10/11/2024",
        channel: "Shopify",
        total: "89,50 €",
        status: "Préparation",
        statusVariant: "info",
      },
      {
        id: "#0999",
        customer: "CardarisFan",
        date: "09/11/2024",
        channel: "CardMarket",
        total: "249,00 €",
        status: "Livrée",
        statusVariant: "success",
      },
    ];
  }
}

export async function fetchAdminTickets() {
  try {
    const data = await apiGet("/admin/tickets");
    // On attend un tableau : [{id, subject, status, priority, updatedAt}, ...]
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("fetchAdminTickets erreur -> demo", e);
    return [
      {
        id: "#TCK-001",
        subject: "Problème de livraison",
        status: "Ouvert",
        priority: "Haute",
        updatedAt: "10/11/2024",
      },
      {
        id: "#TCK-002",
        subject: "Question sur une précommande",
        status: "En cours",
        priority: "Normale",
        updatedAt: "09/11/2024",
      },
    ];
  }
}

// Exemple pour plus tard : POST d’une action admin
export async function adminAddNoteToOrder(orderId, note) {
  return apiPost(`/admin/orders/${orderId}/notes`, { note });
}
