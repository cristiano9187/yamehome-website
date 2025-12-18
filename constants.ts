import { Property, Location, PropertyType } from './types';

// --- UTILITAIRE GOOGLE DRIVE (Conservé pour compatibilité) ---
const getDriveImage = (urlOrId: string): string => {
  if (!urlOrId.includes('drive.google.com') && urlOrId.startsWith('http')) {
    return urlOrId;
  }
  const match = urlOrId.match(/[-\w]{25,}/);
  const id = match ? match[0] : urlOrId;
  return `https://drive.google.com/uc?export=view&id=${id}`;
};

export const PROPERTIES: Property[] = [
  // --- SITE 1: RIETI YAMEHOME (Odza entrée Fécafoot) ---
  {
    id: 'rieti-terracotta',
    title: 'Appartement Terracotta',
    siteName: 'RIETI YAMEHOME',
    fullAddress: 'Odza entrée Fécafoot, Yaoundé',
    description: 'Idéal pour rejoindre l\'aéroport (15 min). Un appartement spacieux aux tons terre cuite, modulable et lumineux. Situé en bordure de route bitumée, il offre un cadre sécurisé avec cuisine européenne.',
    location: Location.YAOUNDE,
    type: PropertyType.APPARTEMENT,
    pricePerNight: 32000,
    studioPrice: 25000,
    pricing: {
      standard: [
        { minNights: 1, maxNights: 6, pricePerNight: 32000, caution: 10000 },
        { minNights: 7, maxNights: 29, pricePerNight: 30000, caution: 15000 },
        { minNights: 30, pricePerNight: 26000, caution: 30000 }
      ],
      studioMode: [
        { minNights: 1, maxNights: 6, pricePerNight: 25000, caution: 10000 },
        { minNights: 7, pricePerNight: 23000, caution: 15000 }
      ]
    },
    images: [
      '/images/terracotta/chambre_fenetre.jpg',
      '/images/terracotta/salle_a_manger.jpg',
      '/images/terracotta/salon_tv.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/1fveCMq0ZaYiAC-JZh1BuuZ-YZFfBxU0T',
    amenities: ['Wifi Illimité', 'Climatisation', 'Eau Chaude', 'Sécurité H24', 'Parking sécurisé', 'Cuisine équipée', 'Smart TV (Canal+/Netflix)'],
    capacity: 4
  },
  {
    id: 'rieti-emeraude',
    title: 'Appartement Emeraude',
    siteName: 'RIETI YAMEHOME',
    fullAddress: 'Odza entrée Fécafoot, Yaoundé',
    description: 'Élégance et verdure. Ce logement moderne tout confort est soigneusement équipé pour garantir une expérience unique. À seulement 9km de Nsimalen, \le pied-à-terre parfait pour les voyageurs exigeants.',
    location: Location.YAOUNDE,
    type: PropertyType.APPARTEMENT,
    pricePerNight: 32000,
    studioPrice: 25000,
    pricing: {
      standard: [
        { minNights: 1, maxNights: 6, pricePerNight: 32000, caution: 10000 },
        { minNights: 7, maxNights: 29, pricePerNight: 30000, caution: 15000 },
        { minNights: 30, pricePerNight: 26000, caution: 30000 }
      ],
      studioMode: [
        { minNights: 1, maxNights: 6, pricePerNight: 25000, caution: 10000 },
        { minNights: 7, pricePerNight: 23000, caution: 15000 }
      ]
    },
    images: [
      '/images/emeraude/aceuil.jpg',
      '/images/emeraude/d_cuisine.jpg',
      '/images/emeraude/f_chambre.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/1ryIRS2lqDQRulF9hLDFjV7WKgfma7kfc',
    amenities: ['Wifi Illimité', 'Climatisation', 'Eau Chaude', 'Sécurité H24', 'Parking sécurisé', 'Cuisine équipée', 'Smart TV (Canal+/Netflix)'],
    capacity: 4
  },

  // --- SITE 2: MODENA YAMEHOME (Odza Brigade) ---
  {
    id: 'modena-haut-standing',
    title: 'Appartement Haut Standing',
    siteName: 'MODENA YAMEHOME',
    fullAddress: 'Odza Brigade, Yaoundé',
    description: 'Le luxe à l\'état pur à 70m de l\'axe principal. Finitions haut de gamme, autonomie totale en eau (forage) et équipement complet incluant machine à laver. Idéal pour les longs séjours.',
    location: Location.YAOUNDE,
    type: PropertyType.APPARTEMENT,
    pricePerNight: 35000,
    studioPrice: 27000,
    pricing: {
      standard: [
        { minNights: 1, maxNights: 6, pricePerNight: 35000, caution: 10000 },
        { minNights: 7, maxNights: 29, pricePerNight: 30000, caution: 15000 },
        { minNights: 30, pricePerNight: 27000, caution: 30000 }
      ],
      studioMode: [
        { minNights: 1, maxNights: 6, pricePerNight: 27000, caution: 10000 },
        { minNights: 7, pricePerNight: 24000, caution: 15000 }
      ]
    },
    images: [
      '/images/brigade/salon_brigade.jpg',
      '/images/brigade/cuisine_brigade.jpg',
      '/images/brigade/chrambre_p_brigade.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/1Uft3tiWSMkLHoky44mpws4Wc5PbJAIKH',
    amenities: ['Machine à laver', 'Forage (Eau 24/7)', 'Wifi Gratuit', 'Climatisation intégrale', 'Balcon', 'Sécurité', 'Smart TV (Netflix/IPTV)'],
    capacity: 4
  },

  // --- SITE 3: MATERA YAMEHOME (Odza borne 10, entrée Ministre) ---
  {
    id: 'matera-deluxe',
    title: 'Appartement Deluxe',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Grand standing dans un immeuble futuriste. Espaces généreux, décoration raffinée et autonomie totale (Système anti-délestage + Forage). Accès facile sur route bitumée.',
    location: Location.YAOUNDE,
    type: PropertyType.APPARTEMENT,
    pricePerNight: 40000,
    studioPrice: 30000,
    pricing: {
      standard: [
        { minNights: 1, maxNights: 6, pricePerNight: 40000, caution: 10000 },
        { minNights: 7, maxNights: 29, pricePerNight: 34000, caution: 15000 },
        { minNights: 30, pricePerNight: 30000, caution: 30000 }
      ],
      studioMode: [
        { minNights: 1, maxNights: 6, pricePerNight: 30000, caution: 10000 },
        { minNights: 7, pricePerNight: 25000, caution: 15000 }
      ]
    },
    images: [
      '/images/deluxe/salon_deluxe.jpg',
      '/images/deluxe/salle_manger.jpg',
      '/images/deluxe/chambre_p.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/1GNItWwoF5sOvZjnvlSZVeOIJ6OA2Ol3A',
    amenities: ['Anti-délestage (Backup)', 'Forage (Eau 24/7)', 'Wifi Haut Débit', 'Climatisation', 'Cuisine Américaine', 'Parking interne', 'Magasin de stockage'],
    capacity: 5
  },
  {
    id: 'matera-studio',
    title: 'Studio Américain',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Un vaste studio de 60m² au design américain. Situé au 2ème étage, il offre un espace de vie ouvert et moderne. Garantie sans coupure (Backup électrique + Forage).',
    location: Location.YAOUNDE,
    type: PropertyType.STUDIO,
    pricePerNight: 25000,
    pricing: {
      standard: [
        { minNights: 1, maxNights: 6, pricePerNight: 25000, caution: 5000 },
        { minNights: 7, maxNights: 29, pricePerNight: 22500, caution: 10000 },
        { minNights: 30, pricePerNight: 20000, caution: 15000 }
      ]
    },
    images: [
      '/images/americain/salon_studio.jpg',
      '/images/americain/cuisine_studio.jpg',
      '/images/americain/chambre_studio.jpg'
    ], 
    driveFolderUrl: 'https://drive.google.com/drive/folders/1zAp1a4o7Ac2MNoZ6wzsDoBJ9ClzmkS93',
    amenities: ['Anti-délestage', 'Forage', 'Wifi Illimité', 'Climatisation', 'Cuisine Américaine', 'Smart TV', 'Interphone'],
    capacity: 2
  },
  {
    id: 'matera-studio-superior',
    title: 'Studio Américain Superior',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Situé au 1er étage, ce studio de 60m² allie décoration soignée et équipements technologiques complets. Sécurité H24 et autonomie énergétique garantie.',
    location: Location.YAOUNDE,
    type: PropertyType.STUDIO,
    pricePerNight: 25000,
    pricing: {
      standard: [
        { minNights: 1, maxNights: 6, pricePerNight: 25000, caution: 5000 },
        { minNights: 7, maxNights: 29, pricePerNight: 22500, caution: 10000 },
        { minNights: 30, pricePerNight: 20000, caution: 15000 }
      ]
    },
    images: [
      '/images/superior/sejour.jpg',
      '/images/superior/cuisine.jpg',
      '/images/superior/chambre_sup.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/1N3hgGTKvcn8xBOKpN6jTggZEY80Vse2f',
    amenities: ['Anti-délestage', 'Forage', 'Wifi Illimité', 'Climatisation', 'Cuisine Américaine', 'Smart TV', 'Interphone'],
    capacity: 2
  },
  {
    id: 'matera-chambre-a',
    title: 'Chambre Standard A',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Une suite hôtelière de 22m² pensée pour votre bien-être. Lit King Size, coin détente et mini-équipements (frigo, micro-ondes) pour une totale indépendance.',
    location: Location.YAOUNDE,
    type: PropertyType.CHAMBRE,
    pricePerNight: 15000,
    pricing: {
      standard: [
        { minNights: 1, maxNights: 2, pricePerNight: 15000, caution: 5000 },
        { minNights: 3, pricePerNight: 13000, caution: 10000 }
      ]
    },
    images: [
      '/images/chambrea/vue_lit.jpg',
      '/images/chambrea/vue_tv.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/1d0lqRu4KYHj6KfyrLOGnsdy_cRaJQ3e_',
    amenities: ['Lit King Size', 'Climatisation', 'Réfrigérateur', 'Micro-ondes', 'Wifi', 'TV 43 pouces', 'Douche privative'],
    capacity: 2
  },
  {
    id: 'matera-chambre-b',
    title: 'Chambre Standard B',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Confort optimal pour cette chambre de 22m² avec lit King Size et douche privative. Idéale pour les courts séjours ou les voyages solo.',
    location: Location.YAOUNDE,
    type: PropertyType.CHAMBRE,
    pricePerNight: 15000,
    pricing: {
      standard: [
        { minNights: 1, maxNights: 2, pricePerNight: 15000, caution: 5000 },
        { minNights: 3, pricePerNight: 13000, caution: 10000 }
      ]
    },
    images: [
      '/images/chambreb/lit_frigo.jpg',
      '/images/chambreb/placard.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/1Q4OzXAivA9vAd_3IX5AE_ue2tBS2ZIbS',
    amenities: ['Lit King Size', 'Climatisation', 'Réfrigérateur', 'Micro-ondes', 'Wifi', 'TV 43 pouces', 'Douche privative'],
    capacity: 2
  },

  // --- BANGANGTE (Gallaghers City) ---
  {
    id: 'bgt-cuisine',
    title: 'Chambre avec Cuisine',
    siteName: 'GALLAGHERS CITY',
    fullAddress: 'Lieu-dit Troisième Mi-temps',
    description: 'La seule chambre disposant de sa propre cuisine interne. Idéale pour les longs séjours.',
    location: Location.BANGANGTE,
    type: PropertyType.CHAMBRE,
    pricePerNight: 15000,
    pricing: {
      standard: [
        { minNights: 1, pricePerNight: 15000, caution: 5000 }
      ]
    },
    images: [
      '/images/bgte/barriere.jpg',
      '/images/bgte/chambre_p_fenetre.jpg',
      '/images/bgte/chambre_p1.jpg',
      '/images/bgte/chambre_p2.jpg'
    ],
    amenities: ['Cuisine interne', 'Eau chaude', 'TV', 'Frigo', 'Micro-ondes'],
    capacity: 2
  },
  {
    id: 'bgt-standard-a',
    title: 'Chambre Standard A',
    siteName: 'GALLAGHERS CITY',
    fullAddress: 'Lieu-dit Troisième Mi-temps',
    description: 'Chambre confortable et calme, parfaite pour le repos.',
    location: Location.BANGANGTE,
    type: PropertyType.CHAMBRE,
    pricePerNight: 12000,
    pricing: {
      standard: [
        { minNights: 1, pricePerNight: 12000, caution: 5000 }
      ]
    },
    images: [
      '/images/bgte/chambre_b.jpg'
    ],
    amenities: ['Douche privée', 'TV', 'Eau chaude'],
    capacity: 2
  },
  {
    id: 'bgt-standard-b',
    title: 'Chambre Standard B',
    siteName: 'GALLAGHERS CITY',
    fullAddress: 'Lieu-dit Troisième Mi-temps',
    description: 'Hébergement de qualité au cœur de la résidence.',
    location: Location.BANGANGTE,
    type: PropertyType.CHAMBRE,
    pricePerNight: 12000,
    pricing: {
      standard: [
        { minNights: 1, pricePerNight: 12000, caution: 5000 }
      ]
    },
    images: [
      '/images/bgte/chambre_c.jpg'
    ],
    amenities: ['Douche privée', 'TV', 'Eau chaude'],
    capacity: 2
  },
  {
    id: 'bgt-standard-c',
    title: 'Chambre Standard C',
    siteName: 'GALLAGHERS CITY',
    fullAddress: 'Lieu-dit Troisième Mi-temps',
    description: 'Simple, propre et sécurisée. Le meilleur rapport qualité/prix.',
    location: Location.BANGANGTE,
    type: PropertyType.CHAMBRE,
    pricePerNight: 12000,
    pricing: {
      standard: [
        { minNights: 1, pricePerNight: 12000, caution: 5000 }
      ]
    },
    images: [
      '/images/bgte/chambre_d.jpg'
    ],
    amenities: ['Douche privée', 'TV', 'Eau chaude'],
    capacity: 2
  },
];

// Numéros affichés dans le PIED DE PAGE (Footer) pour appels directs
export const CONTACT_PHONE_YAOUNDE = "+237 656 75 13 10"; 
export const CONTACT_PHONE_BANGANGTE = "+237 670 87 11 39";

// Numéros pour les boutons "Réserver sur WhatsApp" des cartes (Agents dédiés)
export const WHATSAPP_AGENT_YAOUNDE = "+237 657 50 76 71"; 
export const WHATSAPP_AGENT_BANGANGTE = "+237 681 94 86 87"; 

export const CONTACT_EMAIL = "christian@yamehome.com";
export const HEADQUARTERS_ADDRESS = "Odza borne 10, entrée Ministre, Yaoundé";