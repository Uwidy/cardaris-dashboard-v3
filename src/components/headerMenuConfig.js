// src/components/headerMenuConfig.js

// Tabs du mega-menu "CATÉGORIES"
export const CATEGORY_TABS = [
  {
    id: "pokemon",
    label: "Pokémon",
    columns: [
      {
        heading: "Boosters",
        links: [
          {
            label: "Flammes Fantasmagoriques",
            href: "/collections/flammes-fantasmagoriques",
          },
          {
            label: "Écarlate & Violet",
            href: "/collections/pokemon-ecarlate-violet",
          },
          {
            label: "Série 151",
            href: "/collections/pokemon-151",
          },
        ],
      },
      {
        heading: "Displays",
        links: [
          {
            label: "Display 36 boosters",
            href: "/collections/pokemon-display-36-boosters",
          },
          {
            label: "Booster Box",
            href: "/collections/pokemon-booster-box",
          },
        ],
      },
      {
        heading: "Coffrets & produits spéciaux",
        links: [
          {
            label: "Coffrets Premium",
            href: "/collections/pokemon-coffrets-premium",
          },
          {
            label: "ETB",
            href: "/collections/pokemon-etb",
          },
          {
            label: "Ultra Premium",
            href: "/collections/pokemon-ultra-premium",
          },
        ],
      },
    ],
  },

  {
    id: "one-piece",
    label: "One Piece",
    columns: [
      {
        heading: "Boosters",
        links: [
          {
            label: "Héritage du Maître",
            href: "/collections/one-piece-heritage-du-maitre",
          },
          {
            label: "Autres séries",
            href: "/collections/one-piece-boosters",
          },
        ],
      },
      {
        heading: "Displays",
        links: [
          {
            label: "Display 24 boosters",
            href: "/collections/one-piece-display-24-boosters",
          },
        ],
      },
      {
        heading: "Produits spéciaux",
        links: [
          {
            label: "Decks & coffrets",
            href: "/collections/one-piece-coffrets",
          },
        ],
      },
    ],
  },

  {
    id: "yugioh",
    label: "Yu-Gi-Oh!",
    columns: [
      {
        heading: "Boosters",
        links: [
          {
            label: "Désastre des Dimensions",
            href: "/collections/detastre-des-dimensions",
          },
          {
            label: "Ancient Guardians",
            href: "/collections/ancient-guardians",
          },
        ],
      },
      {
        heading: "Displays",
        links: [
          {
            label: "Displays standards",
            href: "/collections/yugioh-displays",
          },
        ],
      },
      {
        heading: "Éditions spéciales",
        links: [
          {
            label: "Collector & boîtes spéciales",
            href: "/collections/yugioh-collector",
          },
        ],
      },
    ],
  },
];

// Liens du menu "DIVERS"
export const DIVERS_LINKS = [
  {
    label: "Toutes les collections",
    href: "/collections",
  },
  {
    label: "Promotions",
    href: "/collections/promotions",
  },
];

// Lien CONTACT (si tu veux le changer)
export const CONTACT_LINK = {
  label: "Contact",
  href: "/pages/contact",
};
