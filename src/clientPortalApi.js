// src/clientPortalApi.js

// On enlève le / final si jamais il y en a un
const API_BASE =
  (import.meta.env.VITE_PORTAL_API_URL || "http://localhost:4000").replace(/\/$/, "");

console.log("[Cardaris Portal] API_BASE utilisé côté front =", API_BASE);

/**
 * Petit helper générique pour appeler l'API Cardaris Portal
 * -> ajoute automatiquement le ?customerId=... présent dans l'URL
 */
async function api(path, options = {}) {
  // On récupère la query de la page (ex: ?customerId=12345)
  const query =
    typeof window !== "undefined" ? window.location.search || "" : "";

  // Exemple final : https://api-render.com/orders?customerId=12345
  const url = `${API_BASE}${path}${query}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
      ...options,
    });

    if (!res.ok) {
      let details = "";
      try {
        const data = await res.json();
        details = data.error || data.details || "";
      } catch (e) {
        // ignore
      }
      const baseMsg = `Erreur API (${res.status})`;
      throw new Error(details ? `${baseMsg} : ${details}` : baseMsg);
    }

    return res.json();
  } catch (err) {
    if (err.message === "Failed to fetch") {
      throw new Error(
        "Impossible de contacter le serveur du portail Cardaris. " +
          "Vérifiez qu'il est bien démarré et que l'URL VITE_PORTAL_API_URL est correcte."
      );
    }
    throw err;
  }
}

/* ========== Commandes ========== */

export async function fetchOrders() {
  return api("/orders");
}

export async function fetchOrderDetails(orderId) {
  if (!orderId) {
    throw new Error("ID de commande manquant.");
  }
  return api(`/orders/${orderId}`);
}

/* ========== Adresses ========== */

export async function fetchAddresses() {
  return api("/addresses");
}

/* ========== Tickets ========== */

export async function fetchTickets() {
  return api("/tickets");
}

export async function createTicket(payload) {
  return api("/tickets/new", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

/* ========== Profil ========== */

export async function fetchProfile() {
  return api("/profile");
}

export async function updateProfile(payload) {
  return api("/profile/update", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}
