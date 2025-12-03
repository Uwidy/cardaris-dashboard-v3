// src/clientPortalApi.js

const API_BASE_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL || "http://localhost:4000";

async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GET ${path} - ${res.status} ${res.statusText} — ${text || "Erreur API"}`
    );
  }

  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `POST ${path} - ${res.status} ${res.statusText} — ${text || "Erreur API"}`
    );
  }

  return res.json();
}

/* ========== PROFIL (LOCAL) ========== */

export async function fetchProfile() {
  return apiGet("/profile");
}

export async function updateProfile(profileData) {
  return apiPost("/profile/update", profileData);
}

/* ========== COMMANDES / ADRESSES (SHOPIFY) ========== */

export async function fetchOrders() {
  return apiGet("/orders");
}

export async function fetchAddresses() {
  return apiGet("/addresses");
}

/* ========== TICKETS (MAQUETTE) ========== */

export async function fetchTickets() {
  return apiGet("/tickets");
}

export async function createTicket(ticketPayload) {
  return apiPost("/tickets/new", ticketPayload);
}
