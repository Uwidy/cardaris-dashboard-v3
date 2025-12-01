// src/clientPortalApi.js

// ================== CONFIG API ==================

// Adresse de l'API en ligne (Render)
// ⚠️ Remplace par TON URL Render exacte
const API_BASE_URL = "https://cardaris-portal-api.onrender.com";

// Comme on a une URL, on n'est plus en mode 100% démo,
// mais on garde les données de fallback si l'API ne répond pas.
const USE_DEMO = !API_BASE_URL;

// Petit délai pour rendre les loaders plus naturels
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ================== DÉMO DATA ================== */

const demoOrders = [
  {
    id: "#CMD-0012",
    date: "10/11/2024",
    totalFormatted: "149,90 €",
    status: "Expédiée",
    statusVariant: "success",
    description:
      "Précommande – Display Flammes Fantasmagoriques + accessoires.",
  },
  {
    id: "#CMD-0011",
    date: "05/11/2024",
    totalFormatted: "79,90 €",
    status: "En préparation",
    statusVariant: "info",
    description: "Coffret Premium One Piece + pochettes.",
  },
  {
    id: "#CMD-0010",
    date: "29/10/2024",
    totalFormatted: "24,90 €",
    status: "Livrée",
    statusVariant: "default",
    description: "Booster box Yu-Gi-Oh! – édition spéciale.",
  },
];

const demoAddresses = [
  {
    id: "addr-1",
    label: "Domicile Par défaut",
    isDefault: true,
    name: "Guillaume Santoro",
    line1: "12 rue des Cartes",
    line2: "Appartement 3B",
    zip: "69000",
    city: "Lyon",
    country: "France",
    phone: "+33 6 12 34 56 78",
  },
  {
    id: "addr-2",
    label: "Point relais",
    isDefault: false,
    name: "Guillaume Santoro",
    line1: "Relais Pickup – Tabac du Centre",
    line2: "",
    zip: "69003",
    city: "Lyon",
    country: "France",
    phone: "+33 6 98 76 54 32",
  },
];

const demoTickets = [
  {
    id: "#TCK-001",
    title: "Question sur une précommande",
    lastUpdate: "10/11/2024",
    status: "Ouvert",
    statusVariant: "warning",
    description: "Réponse attendue de Cardaris.",
  },
  {
    id: "#TCK-002",
    title: "Problème de livraison",
    lastUpdate: "05/11/2024",
    status: "En cours",
    statusVariant: "info",
    description: "Notre équipe logistique enquête.",
  },
  {
    id: "#TCK-003",
    title: "Demande de facture",
    lastUpdate: "29/10/2024",
    status: "Résolu",
    statusVariant: "success",
    description: "Facture envoyée par e-mail.",
  },
];

const demoProfile = {
  fullName: "Guillaume Santoro",
  email: "guillaume@example.com",
  nickname: "CardarisFan",
  notifications: {
    orders: true,
    promos: true,
  },
};

/* ================== HELPERS ================== */

async function safeFetch(path, options = {}) {
  // On enlève les / de fin éventuels pour éviter // dans l'URL
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/+$/, "") : null;

  if (!base) {
    // Pas d'API configurée → on reste en démo
    await delay(300);
    throw new Error("DEMO_MODE");
  }

  const url = `${base}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

/* ================== API PUBLIQUE ================== */

// Commandes
export async function fetchOrders() {
  try {
    const data = await safeFetch("/orders");
    return data.orders || [];
  } catch (err) {
    console.warn("[ClientPortal] fetchOrders → fallback DEMO:", err.message);
    return demoOrders;
  }
}

// Adresses
export async function fetchAddresses() {
  try {
    const data = await safeFetch("/addresses");
    return data.addresses || [];
  } catch (err) {
    console.warn("[ClientPortal] fetchAddresses → fallback DEMO:", err.message);
    return demoAddresses;
  }
}

// Tickets
export async function fetchTickets() {
  try {
    const data = await safeFetch("/tickets");
    return data.tickets || [];
  } catch (err) {
    console.warn("[ClientPortal] fetchTickets → fallback DEMO:", err.message);
    return demoTickets;
  }
}

// Profil client
export async function fetchProfile() {
  try {
    const data = await safeFetch("/profile");
    return {
      fullName: data.fullName,
      email: data.email,
      nickname: data.nickname,
      notifications: data.notifications || { orders: true, promos: true },
    };
  } catch (err) {
    console.warn("[ClientPortal] fetchProfile → fallback DEMO:", err.message);
    return demoProfile;
  }
}

// Mise à jour profil
export async function updateProfile(payload) {
  try {
    await safeFetch("/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { ok: true };
  } catch (err) {
    console.error("[ClientPortal] updateProfile error:", err);
    return { ok: false, error: err.message };
  }
}

// Création ticket
export async function createTicket(payload) {
  try {
    const data = await safeFetch("/tickets", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { ok: true, ticket: data.ticket };
  } catch (err) {
    console.error("[ClientPortal] createTicket error:", err);
    return { ok: false, error: err.message };
  }
}
