export enum Location {
  YAOUNDE = 'Yaoundé',
  BANGANGTE = 'Bangangté'
}

export enum PropertyType {
  STUDIO = 'Studio',
  APPARTEMENT = 'Appartement',
  CHAMBRE = 'Chambre'
}

export interface Property {
  id: string;
  title: string;
  siteName?: string; // Ex: RIETI YAMEHOME
  fullAddress?: string; // Ex: Odza entrée Fécafoot
  description: string;
  location: Location;
  type: PropertyType;
  pricePerNight: number; // Prix de base (1-6 jours) pour la configuration standard
  studioPrice?: number; // Prix si loué en mode studio
  images: string[]; // Tableau d'URLs d'images
  driveFolderUrl?: string; // Lien vers le dossier Google Drive (Album)
  youtubeVideoUrl?: string; // Lien vers la vidéo YouTube
  amenities: string[];
  capacity: number;
}