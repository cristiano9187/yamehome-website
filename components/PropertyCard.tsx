import React, { useEffect, useState } from 'react';
import { Property, Location } from '../types';
import { Users, Wifi, MapPin, Check, Image as ImageIcon, MessageCircle, ChevronLeft, ChevronRight, Youtube, X, Calendar } from 'lucide-react';
import BookingModal from './BookingModal';

interface PropertyCardProps {
  property: Property;
  searchStartDate?: Date | null;
  searchEndDate?: Date | null;
  autoOpenBooking?: boolean;
  onAutoOpenHandled?: () => void;
  prefilledStartDate?: Date | null;
  prefilledEndDate?: Date | null;
  campaignSource?: string;
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
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (!autoOpenBooking) return;
    setShowBookingModal(true);
    onAutoOpenHandled?.();
  }, [autoOpenBooking, onAutoOpenHandled]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <>
      <div id={`property-card-${property.id}`} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-slate-100 relative">
        <div className="relative h-64 overflow-hidden">
          <img src={property.images[currentImageIndex]} alt={property.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
          {property.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronLeft size={24} /></button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronRight size={24} /></button>
            </>
          )}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">{property.type}</div>
          {property.siteName && <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">{property.siteName}</div>}
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
          </div>
          <p className="text-slate-600 text-sm mb-4 line-clamp-5">{property.description}</p>
          <div className="flex items-center gap-4 mb-6 text-slate-500 text-sm border-y border-slate-100 py-3">
            <div className="flex items-center"><Users size={18} className="mr-1.5 text-slate-400" />{property.capacity} pers.</div>
            <div className="flex items-center"><Wifi size={18} className="mr-1.5 text-slate-400" />Wifi inclus</div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={() => setShowBookingModal(true)}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-all shadow-lg active:scale-95 group"
            >
              <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
              <MessageCircle size={18} fill="white" className="group-hover:scale-110 transition-transform" />
              Réserver / Estimer
            </button>
            <div className="flex gap-2">
              {property.driveFolderUrl && (
                <a href={property.driveFolderUrl} target="_blank" rel="noopener noreferrer" className="flex-grow flex items-center justify-center px-4 py-2.5 bg-accent text-white rounded-xl font-bold text-xs hover:bg-[#b3955f] transition-all active:scale-95">
                  <ImageIcon size={14} className="mr-2" /> Album Photo
                </a>
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
          initialStartDate={prefilledStartDate || searchStartDate}
          initialEndDate={prefilledEndDate || searchEndDate}
          campaignSource={campaignSource}
        />
      )}
    </>
  );
};

export default PropertyCard;