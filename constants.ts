import { Property, Location, PropertyType } from './types';

// --- UTILITAIRE GOOGLE DRIVE ---
// Cette fonction permet de transformer un lien de partage Google Drive classique
// en une image affichable directement sur le site.
// Usage: Mettez simplement le lien de partage de la photo dans 'imageUrl'.
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
    imageUrl: 'https://picsum.photos/800/600?random=1', // À REMPLACER : Collez le lien de partage de la photo ici
    amenities: ['Wifi', 'Climatisation', 'Parking', 'Cuisine équipée', 'Tarifs dégressifs 7j+'],
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
    imageUrl: 'https://picsum.photos/800/600?random=2', // À REMPLACER
    amenities: ['Wifi', 'Smart TV', 'Sécurité 24/7', 'Machine à laver'],
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
    imageUrl: 'https://picsum.photos/800/600?random=3', // À REMPLACER
    amenities: ['Wifi Haut Débit', 'Climatisation intégrale', 'Balcon', 'Groupe électrogène'],
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
    // EXEMPLE : Si vous avez le lien de la photo, remplacez picsum ci-dessous par : 
    // imageUrl: getDriveImage('LIEN_PARTAGE_GOOGLE_DRIVE_DE_LA_PHOTO'),
    imageUrl: 'https://picsum.photos/800/600?random=4', 
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1GNItWwoF5sOvZjnvlSZVeOIJ6OA2Ol3A',
    amenities: ['TV Canal+', 'Cuisine Américaine', 'Baignoire', 'Parking privé'],
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
    // Mise à jour avec le lien réel fourni
    imageUrl: getDriveImage('https://drive.google.com/file/d/1NJNqJQANT0Qcw30kCDF5AbGmk1ZBu7OY/view?usp=drive_link'), 
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1zAp1a4o7Ac2MNoZ6wzsDoBJ9ClzmkS93',
    amenities: ['Wifi', 'Kitchenette', 'Bureau', 'Douche italienne'],
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
    imageUrl: 'https://picsum.photos/800/600?random=13', // À REMPLACER
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1zAp1a4o7Ac2MNoZ6wzsDoBJ9ClzmkS93',
    amenities: ['Wifi', 'Kitchenette', 'Bureau', 'Douche italienne'],
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
    imageUrl: 'https://picsum.photos/800/600?random=6', // À REMPLACER
    amenities: ['Lit double', 'Ventilateur', 'Douche privée'],
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
    imageUrl: 'https://picsum.photos/800/600?random=14', // À REMPLACER
    amenities: ['Lit double', 'Ventilateur', 'Douche privée'],
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
    imageUrl: 'https://picsum.photos/800/600?random=20', // À REMPLACER
    amenities: ['Cuisine interne', 'Eau chaude', 'Parking', 'TV'],
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
    imageUrl: 'https://picsum.photos/800/600?random=21', // À REMPLACER
    amenities: ['Douche privée', 'Ventilateur', 'Parking', 'TV'],
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
    imageUrl: 'https://picsum.photos/800/600?random=22', // À REMPLACER
    amenities: ['Douche privée', 'Ventilateur', 'Parking', 'TV'],
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
    imageUrl: 'https://picsum.photos/800/600?random=23', // À REMPLACER
    amenities: ['Douche privée', 'Ventilateur', 'Parking', 'TV'],
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