import React, { useEffect, useMemo, useState } from 'react';
import { Property, Reservation } from '../types';
import { 
  Users, Wifi, MapPin, Check, Image as ImageIcon, MessageCircle, 
  ChevronLeft, ChevronRight, Youtube, Calendar, 
  Wind, ShieldCheck, Car, Utensils, Tv, WashingMachine, 
  Droplets, Zap, Phone, BedDouble, Refrigerator, Microwave, ShowerHead, Sun, Coffee
} from 'lucide-react';
import BookingModal from './BookingModal';
import PropertyPhotoGallery from './PropertyPhotoGallery';
import { getCardPreviewImages } from '../utils/propertyImages';

const amenityIcons: { [key: string]: any } = {
  'Energie solaire': Sun,
  'Wifi': Wifi,
  'Wifi Illimité': Wifi,
  'Wifi Gratuit': Wifi,
  'Wifi Haut Débit': Wifi,
  'Climatisation': Wind,
  'Climatisation intégrale': Wind,
  'Eau Chaude': Droplets,
  'Eau chaude': Droplets,
  'Forage': Droplets,
  'Forage (Eau 24/7)': Droplets,
  'Sécurité': ShieldCheck,
  'Sécurité H24': ShieldCheck,
  'Parking sécurisé': Car,
  'Parking interne': Car,
  'Cuisine équipée': Utensils,
  'Cuisine Américaine': Utensils,
  'Cuisine interne': Utensils,
  'Smart TV': Tv,
  'TV': Tv,
  'Smart TV (Canal+/Netflix)': Tv,
  'Smart TV (Netflix/IPTV)': Tv,
  'TV 43 pouces': Tv,
  'Machine à laver': WashingMachine,
  'Anti-délestage': Zap,
  'Anti-délestage (Backup)': Zap,
  'Interphone': Phone,
  'Lit King Size': BedDouble,
  'Réfrigérateur': Refrigerator,
  'Frigo': Refrigerator,
  'Micro-ondes': Microwave,
  'Douche privative': ShowerHead,
  'Douche privée': ShowerHead,
  'Réception — boissons': Coffee,
};

interface PropertyCardProps {
  property: Property;
  searchStartDate?: Date | null;
  searchEndDate?: Date | null;
  autoOpenBooking?: boolean;
  onAutoOpenHandled?: () => void;
  prefilledStartDate?: Date | null;
  prefilledEndDate?: Date | null;
  campaignSource?: string;
  allReservations?: Reservation[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  searchStartDate,
  searchEndDate,
  autoOpenBooking = false,
  onAutoOpenHandled,
  prefilledStartDate,
  prefilledEndDate,
  campaignSource = '',
  allReservations = [],
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [activeAmenityTooltip, setActiveAmenityTooltip] = useState<string | null>(null);
  const isModulableStudio = property.type === 'Appartement' && !!property.pricing?.studioMode?.length;
  const propertyTypeLabel = property.type === 'Appartement' ? 'Appartement 2 chambres' : property.type;
  const galleryImages = property.images;
  const cardImages = useMemo(
    () => getCardPreviewImages(galleryImages, property.id),
    [galleryImages, property.id]
  );

  useEffect(() => {
    if (!autoOpenBooking) return;
    setShowBookingModal(true);
    onAutoOpenHandled?.();
  }, [autoOpenBooking, onAutoOpenHandled]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property.id, cardImages]);

  const openBookingModal = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowBookingModal(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!cardImages.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % cardImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!cardImages.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + cardImages.length) % cardImages.length);
  };

  const openPhotoGallery = (e: React.SyntheticEvent, startIndex = currentImageIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (!galleryImages.length) return;
    const cardSrc = cardImages[startIndex];
    const fullIndex = cardSrc ? galleryImages.indexOf(cardSrc) : startIndex;
    setGalleryStartIndex(fullIndex >= 0 ? fullIndex : 0);
    setShowPhotoGallery(true);
  };

  return (
    <>
      <div
        id={`property-card-${property.id}`}
        className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-slate-100 relative"
      >
        <div className="relative h-64 overflow-hidden">
          <button
            type="button"
            onClick={(e) => openPhotoGallery(e, currentImageIndex)}
            className="block w-full h-full text-left"
            aria-label={`Voir les photos de ${property.title}`}
          >
            <img
              src={cardImages[currentImageIndex]}
              alt={property.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </button>
          {cardImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"><ChevronLeft size={22} /></button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"><ChevronRight size={22} /></button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
                {cardImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                  />
                ))}
              </div>
              <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-black/45 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{galleryImages.length}
              </div>
            </>
          )}
          {cardImages.length === 1 && galleryImages.length > 1 && (
            <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-black/45 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              {galleryImages.length} photos
            </div>
          )}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            <div className="bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm max-w-[62%] leading-tight">
              {propertyTypeLabel}
            </div>
            {property.siteName && (
              <div className="bg-accent/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm max-w-[45%] text-right leading-tight">
                {property.siteName}
              </div>
            )}
          </div>
          <div className="absolute bottom-4 right-4 text-right">
            <div className="text-white font-bold text-xl drop-shadow-md">{property.pricePerNight.toLocaleString('fr-FR')} FCFA</div>
            <div className="text-white/80 text-[10px] uppercase font-bold">/ nuit</div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-3">
            <div className="flex items-start text-slate-500 text-xs font-medium mb-1 uppercase tracking-wide">
               <MapPin size={14} className="mr-1 mt-0.5 text-accent" /> {property.fullAddress || property.location}
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-800">{property.title}</h3>
            {isModulableStudio && (
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase tracking-wide">
                Modulable en studio
              </span>
            )}
          </div>
          <p className="text-slate-600 text-sm mb-4 line-clamp-5 min-h-[6.25rem]">{property.description}</p>
          <div className="relative">
            <div className="grid grid-cols-4 gap-y-4 gap-x-2 mb-6 border-y border-slate-100 py-4">
            <div className="flex flex-col items-center justify-center gap-1 text-center group/amenity cursor-help" title={`${property.capacity} Personnes`}>
              <Users size={18} className="text-slate-400 group-hover/amenity:text-accent transition-colors" />
              <span className="text-[10px] uppercase font-bold text-slate-400 truncate w-full px-1 group-hover/amenity:text-accent transition-colors">{property.capacity} pers.</span>
            </div>
            {property.amenities.slice(0, 9).map((amenity, idx) => {
              const Icon = amenityIcons[amenity] || Check;
              // On nettoie un peu le texte pour l'affichage court (ex: enlever les parenthèses)
              const shortLabel = amenity.split(' (')[0].replace('Illimité', '').replace('équipée', '').trim();
              
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center gap-1 text-center group/amenity cursor-help"
                  title={amenity}
                  onMouseEnter={() => setActiveAmenityTooltip(amenity)}
                  onMouseLeave={() => setActiveAmenityTooltip(null)}
                  onClick={() => setActiveAmenityTooltip(prev => (prev === amenity ? null : amenity))}
                >
                  <Icon size={18} className="text-slate-400 group-hover/amenity:text-accent transition-colors" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 truncate w-full px-1 group-hover/amenity:text-accent transition-colors">
                    {shortLabel}
                  </span>
                </div>
              );
            })}
            </div>
            {activeAmenityTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none z-20 max-w-[90%] text-center">
                {activeAmenityTooltip}
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button 
              type="button"
              onClick={openBookingModal}
              onTouchStart={openBookingModal}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-all shadow-lg active:scale-95 group"
            >
              <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
              <MessageCircle size={18} fill="white" className="group-hover:scale-110 transition-transform" />
              Réserver / Estimer
            </button>
            <div className="flex gap-2">
              {galleryImages.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => openPhotoGallery(e, 0)}
                  className="flex-grow flex items-center justify-center px-4 py-2.5 bg-accent text-white rounded-xl font-bold text-xs hover:bg-[#b3955f] transition-all active:scale-95"
                >
                  <ImageIcon size={14} className="mr-2" /> Album Photo
                </button>
              )}
              {property.youtubeVideoUrl && (
                <a href={property.youtubeVideoUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all active:scale-95"><Youtube size={16} /></a>
              )}
            </div>
          </div>
        </div>
      </div>
      {showBookingModal && (
        <BookingModal 
          property={property} 
          onClose={() => setShowBookingModal(false)} 
          initialStartDate={prefilledStartDate ?? searchStartDate}
          initialEndDate={prefilledEndDate ?? searchEndDate}
          campaignSource={campaignSource}
          allReservations={allReservations}
        />
      )}
      {showPhotoGallery && (
        <PropertyPhotoGallery
          images={galleryImages}
          title={property.title}
          initialIndex={galleryStartIndex}
          driveFolderUrl={property.driveFolderUrl}
          onClose={() => setShowPhotoGallery(false)}
        />
      )}
    </>
  );
};

export default PropertyCard;