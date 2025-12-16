export enum Location {
  YAOUNDE = 'Yaoundé',
  BANGANGTE = 'Bangangté'
}

export enum PropertyType {
  STUDIO = 'Studio',
  APPARTEMENT = 'Appartement',
  CHAMBRE = 'Chambre'
}

export interface PricingRule {
  minNights: number;
  maxNights?: number; // Si undefined, signifie "et plus" (infini)
  pricePerNight: number;
  caution: number;
}

export interface PropertyPricing {
  standard: PricingRule[];
  studioMode?: PricingRule[]; // Optionnel, seulement si l'appart est modulable
}

export interface Property {
  id: string;
  title: string;
  siteName?: string; // Ex: RIETI YAMEHOME
  fullAddress?: string; // Ex: Odza entrée Fécafoot
  description: string;
  location: Location;
  type: PropertyType;
  pricePerNight: number; // Prix d'affichage (le plus bas ou standard)
  studioPrice?: number; // Prix d'affichage option studio
  pricing: PropertyPricing; // La nouvelle structure complète de prix
  images: string[]; // Tableau d'URLs d'images
  driveFolderUrl?: string; // Lien vers le dossier Google Drive (Album)
  youtubeVideoUrl?: string; // Lien vers la vidéo YouTube
  amenities: string[];
  capacity: number;
}