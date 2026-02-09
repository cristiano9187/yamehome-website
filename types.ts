export enum Location {
  YAOUNDE = 'Yaoundé',
  BANGANGTE = 'Bangangté'
}

export enum PropertyType {
  STUDIO = 'Studio',
  APPARTEMENT = 'Appartement',
  CHAMBRE = 'Chambre'
}

export interface PricingTier {
  minNights: number;
  maxNights?: number;
  pricePerNight: number;
  caution: number;
}

export interface Property {
  id: string;
  title: string;
  siteName?: string;
  fullAddress?: string;
  description: string;
  location: Location;
  type: PropertyType;
  pricePerNight: number;
  studioPrice?: number;
  pricing?: {
    standard: PricingTier[];
    studioMode?: PricingTier[];
  };
  images: string[];
  driveFolderUrl?: string;
  youtubeVideoUrl?: string;
  amenities: string[];
  capacity: number;
}