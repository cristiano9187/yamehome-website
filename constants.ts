import { Property, Location, PropertyType } from './types';

// --- UTILITAIRE GOOGLE DRIVE ---
// Cette fonction permet de transformer un lien de partage Google Drive classique
// en une image affichable directement sur le site.
// Usage: Mettez simplement le lien de partage de la photo dans le tableau 'images'.
const getDriveImage = (urlOrId: string): string => {
  // Si c'est une image Picsum (test) ou une URL externe non-Drive, on la retourne telle quelle
  if (!urlOrId.includes('drive.google.com') && urlOrId.startsWith('http')) {
    return urlOrId;
  }
  
  // Extraction de l'ID du fichier depuis le lien Google Drive
  // Supporte les formats : /file/d/ID/view ou ?id=ID
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
    description: 'Un appartement chaleureux aux tons terre cuite. Spacieux et lumineux.',
    location: Location.YAOUNDE,
    type: PropertyType.APPARTEMENT,
    pricePerNight: 32000,
    studioPrice: 25000,
    images: [
      '/yamehome-website/images/terracotta/chambre_fenetre.jpg',
      '/yamehome-website/images/terracotta/salle_a_manger.jpg', // Image supplémentaire pour le carrousel
      '/yamehome-website/images/terracotta/salon_tv.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1fveCMq0ZaYiAC-JZh1BuuZ-YZFfBxU0T',
    amenities: ['Wifi Haut débit', 'Climatisation', 'Parking', 'Cuisine équipée'],
    capacity: 4
  },
  {
    id: 'rieti-emeraude',
    title: 'Appartement Emeraude',
    siteName: 'RIETI YAMEHOME',
    fullAddress: 'Odza entrée Fécafoot, Yaoundé',
    description: 'Élégance et verdure pour cet appartement moderne tout confort.',
    location: Location.YAOUNDE,
    type: PropertyType.APPARTEMENT,
    pricePerNight: 32000,
    studioPrice: 25000,
    images: [
      '/yamehome-website/images/emeraude/aceuil.jpg',
      '/yamehome-website/images/emeraude/d_cuisine.jpg',
      '/yamehome-website/images/emeraude/f_chambre.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1ryIRS2lqDQRulF9hLDFjV7WKgfma7kfc',
    amenities: ['Wifi Haut Débit', 'Climatisation', 'Eau Chaude', 'Smart TV', 'Sécurité 24/7'],
    capacity: 4
  },

  // --- SITE 2: MODENA YAMEHOME (Odza Brigade) ---
  {
    id: 'modena-haut-standing',
    title: 'Appartement Haut Standing',
    siteName: 'MODENA YAMEHOME',
    fullAddress: 'Odza Brigade, Yaoundé',
    description: 'Le luxe à l\'état pur. Finitions haut de gamme et emplacement stratégique.',
    location: Location.YAOUNDE,
    type: PropertyType.APPARTEMENT,
    pricePerNight: 35000,
    studioPrice: 27000,
    images: [
      '/yamehome-website/images/brigade/salon_brigade.jpg',
      '/yamehome-website/images/brigade/cuisine_brigade.jpg',
      '/yamehome-website/images/brigade/chrambre_p_brigade.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1Uft3tiWSMkLHoky44mpws4Wc5PbJAIKH',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=J8irm0k3XEQ',
    amenities: ['Wifi', 'Climatisation intégrale', 'Balcon','securité 24/7'],
    capacity: 4
  },

  // --- SITE 3: MATERA YAMEHOME (Odza borne 10, entrée Ministre) ---
  {
    id: 'matera-deluxe',
    title: 'Appartement Deluxe',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Grand standing, espaces généreux et décoration raffinée.',
    location: Location.YAOUNDE,
    type: PropertyType.APPARTEMENT,
    pricePerNight: 40000,
    studioPrice: 30000,
    images: [
      '/yamehome-website/images/deluxe/salon_deluxe.jpg',
      '/yamehome-website/images/deluxe/salle_manger.jpg',
      '/yamehome-website/images/deluxe/chambre_p.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1GNItWwoF5sOvZjnvlSZVeOIJ6OA2Ol3A',
    amenities: ['Wifi Haut Débit', 'Climatisation', 'Eau Chaude','TV Canal+', 'Cuisine Américaine', 'Parking privé','anti-delestage'],
    capacity: 5
  },
  {
    id: 'matera-studio',
    title: 'Studio Américain',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Situé au 2ème étage. Un studio design et fonctionnel, parfait pour les séjours d\'affaires.',
    location: Location.YAOUNDE,
    type: PropertyType.STUDIO,
    pricePerNight: 25000,
    images: [
      // Ajout photo random en attendant les vraies photos
      '/yamehome-website/images/americain/salon_studio.jpg',
      '/yamehome-website/images/americain/cuisine_studio.jpg',
      '/yamehome-website/images/americain/chambre_studio.jpg'
    ], 
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1zAp1a4o7Ac2MNoZ6wzsDoBJ9ClzmkS93',
    amenities: ['Wifi Haut Débit', 'Climatisation', 'Eau Chaude', 'Kitchenette','anti-delestage'],
    capacity: 2
  },
  {
    id: 'matera-studio-superior',
    title: 'Studio Américain Superior',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Situé au 1er étage. Même confort exceptionnel avec un accès facilité.',
    location: Location.YAOUNDE,
    type: PropertyType.STUDIO,
    pricePerNight: 25000,
    images: [
      '/yamehome-website/images/superior/sejour.jpg',
      '/yamehome-website/images/superior/cuisine.jpg',
      '/yamehome-website/images/superior/chambre_sup.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1N3hgGTKvcn8xBOKpN6jTggZEY80Vse2f',
    amenities: ['Wifi Haut Débit', 'Climatisation', 'Eau Chaude', 'Kitchenette','anti-delestage'],
    capacity: 2
  },
  {
    id: 'matera-chambre-a',
    title: 'Chambre Standard A',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Le confort essentiel à petit prix dans un cadre sécurisé.',
    location: Location.YAOUNDE,
    type: PropertyType.CHAMBRE,
    pricePerNight: 15000,
    images: [
      '/yamehome-website/images/chambrea/vue_lit.jpg',
      '/yamehome-website/images/chambrea/vue_tv.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1d0lqRu4KYHj6KfyrLOGnsdy_cRaJQ3e_',
    amenities: ['Wifi','Lit double', 'climatisation', 'Douche privée','tv','micro-ondes'],
    capacity: 2
  },
  {
    id: 'matera-chambre-b',
    title: 'Chambre Standard B',
    siteName: 'MATERA YAMEHOME',
    fullAddress: 'Odza borne 10, entrée Ministre',
    description: 'Une seconde option standard idéale pour les courts séjours.',
    location: Location.YAOUNDE,
    type: PropertyType.CHAMBRE,
    pricePerNight: 15000,
    images: [
      '/yamehome-website/images/chambreb/lit_frigo.jpg',
      '/yamehome-website/images/chambreb/placard.jpg'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1Q4OzXAivA9vAd_3IX5AE_ue2tBS2ZIbS',
    amenities: ['Wifi','Lit double', 'climatisation', 'Douche privée','tv','micro-ondes'],
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
    images: [
      '/yamehome-website/images/bgte/barriere.jpg',
      '/yamehome-website/images/bgte/chambre_p_fenetre.jpg',
      '/yamehome-website/images/bgte/chambre_p1.jpg',
      '/yamehome-website/images/bgte/chambre_p2.jpg'
    ],
    amenities: ['Cuisine interne', 'Eau chaude', 'TV','frigo','micro-ondes'],
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
    images: [
      '/yamehome-website/images/bgte/chambre_b.jpg'
    ],
    amenities: ['Douche privée', 'TV','eau chaude'],
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
    images: [
      '/yamehome-website/images/bgte/chambre_c.jpg'
    ],
    amenities: ['Douche privée', 'TV','eau chaude'],
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
    images: [
      '/yamehome-website/images/bgte/chambre_d.jpg'
    ],
    amenities: ['Douche privée', 'TV','eau chaude'],
    capacity: 2
  },
];

// Numéros affichés dans le PIED DE PAGE (Footer) pour appels directs
export const CONTACT_PHONE_YAOUNDE = "+237 656 75 13 10"; // Numéro Edwige
export const CONTACT_PHONE_BANGANGTE = "+237 670 87 11 39"; // Nouveau numéro demandé

// Numéros pour les boutons "Réserver sur WhatsApp" des cartes (Agents dédiés)
export const WHATSAPP_AGENT_YAOUNDE = "+237 691 47 24 82"; // Paola
export const WHATSAPP_AGENT_BANGANGTE = "+237 681 94 86 87"; // Celsus

export const CONTACT_EMAIL = "christian@yamehome.com";
export const HEADQUARTERS_ADDRESS = "Odza borne 10, entrée Ministre, Yaoundé";