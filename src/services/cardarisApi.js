// src/services/cardarisApi.js

// Petit helper pour simuler un délai réseau
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Récupère les commandes d'un client.
 * TODO: remplacer par un vrai appel Shopify / Cardaris
 */
export async function getCustomerOrders(customerId) {
  await wait(500);

  return [
    {
      id: "CMD-001",
      date: "12/02/2025",
      itemsCount: 3,
      total: "129,90€",
      status: "delivered", // delivered | processing | shipped
      timelineStep: 4,
      items: [
        {
          name: "Display Pokémon – Flammes Fantasmagoriques",
          qty: 1,
          price: "119,90€",
        },
        {
          name: "Booster One Piece TCG – Paramount War",
          qty: 1,
          price: "10,00€",
        },
      ],
      shippingAddress: {
        name: "Guillaume Santoro",
        address:
          "12 rue des Cartes\nAppartement 3B\n69000 Lyon\nFrance",
        phone: "+33 6 12 34 56 78",
      },
      billingAddress: {
        name: "Guillaume Santoro",
        address:
          "12 rue des Cartes\nAppartement 3B\n69000 Lyon\nFrance",
        phone: "+33 6 12 34 56 78",
      },
      paymentMethod: "Visa •••• 1234",
      shippingMethod: "Colissimo suivi",
    },
    {
      id: "CMD-002",
      date: "05/02/2025",
      itemsCount: 2,
      total: "49,90€",
      status: "processing",
      timelineStep: 2,
      items: [
        {
          name: "Booster Pokémon – Écarlate & Violet",
          qty: 2,
          price: "9,90€",
        },
      ],
      shippingAddress: {
        name: "Guillaume Santoro",
        address:
          "12 rue des Cartes\nAppartement 3B\n69000 Lyon\nFrance",
        phone: "+33 6 12 34 56 78",
      },
      billingAddress: {
        name: "Guillaume Santoro",
        address:
          "12 rue des Cartes\nAppartement 3B\n69000 Lyon\nFrance",
        phone: "+33 6 12 34 56 78",
      },
      paymentMethod: "PayPal",
      shippingMethod: "Mondial Relay",
    },
  ];
}

/**
 * Récupère les adresses d'un client.
 */
export async function getCustomerAddresses(customerId) {
  await wait(400);

  return [
    {
      id: "addr-1",
      label: "Domicile",
      isDefault: true,
      name: "Guillaume Santoro",
      lines: [
        "12 rue des Cartes",
        "Appartement 3B",
        "69000 Lyon",
        "France",
      ],
      phone: "+33 6 12 34 56 78",
    },
    {
      id: "addr-2",
      label: "Point relais",
      isDefault: false,
      name: "Guillaume Santoro",
      lines: ["Relais Pickup – Tabac du Centre", "69003 Lyon", "France"],
      phone: "+33 6 98 76 54 32",
    },
  ];
}

/**
 * Récupère les tickets de support d'un client.
 */
export async function getSupportTickets(customerId) {
  await wait(450);

  return [
    {
      id: "TCK-001",
      key: "#TCK-001",
      subject: "Question sur une précommande",
      status: "open", // open | progress | resolved
      lastUpdate: "10/11/2024",
      preview: "Réponse attendue de Cardaris",
    },
    {
      id: "TCK-002",
      key: "#TCK-002",
      subject: "Problème de livraison",
      status: "progress",
      lastUpdate: "05/11/2024",
      preview: "Notre équipe logistique enquête.",
    },
    {
      id: "TCK-003",
      key: "#TCK-003",
      subject: "Demande de facture",
      status: "resolved",
      lastUpdate: "29/10/2024",
      preview: "Facture envoyée par e-mail.",
    },
  ];
}

/**
 * Crée un nouveau ticket (mock).
 * TODO: remplacer par un POST réel.
 */
export async function createSupportTicket(customerId, { subject, message }) {
  await wait(700);

  const now = new Date();
  const formatted =
    String(now.getDate()).padStart(2, "0") +
    "/" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "/" +
    now.getFullYear();

  return {
    id: "TCK-" + Math.floor(1000 + Math.random() * 9000),
    key: "#" + "TCK-" + Math.floor(1000 + Math.random() * 9000),
    subject,
    status: "open",
    lastUpdate: formatted,
    preview: "Nous avons bien reçu votre demande.",
  };
}
