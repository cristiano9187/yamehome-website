import React, { useState } from 'react';
import { Property, Location } from '../types';
import { Users, Wifi, MapPin, Check, Building, Image as ImageIcon, MessageCircle, ChevronLeft, ChevronRight, Youtube, X, Calendar } from 'lucide-react';
import BookingModal from './BookingModal';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Navigation du carrousel
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const hasMultipleImages = property.images.length > 1;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-slate-100 relative">
        
        {/* Zone Image avec Carrousel */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={property.images[currentImageIndex]} 
            alt={property.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Contrôles du Carrousel */}
          {hasMultipleImages && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-10"
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-10"
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
            {property.type}
          </div>
          {property.siteName && (
            <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
              {property.siteName}
            </div>
          )}

          <div className="absolute bottom-4 right-4 text-right">
            <div className="text-white font-bold text-xl drop-shadow-md">
              {property.pricePerNight.toLocaleString('fr-FR')} FCFA
            </div>
            <div className="text-white/80 text-[10px] uppercase font-bold">/ nuit</div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex flex-col mb-3">
            <div className="flex items-start text-slate-500 text-xs font-medium mb-1 uppercase tracking-wide">
               <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0 text-accent" />
               {property.fullAddress || property.location}
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-800">
              {property.title}
            </h3>
          </div>
          
          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
            {property.description}
          </p>

          <div className="flex items-center gap-4 mb-6 text-slate-500 text-sm border-y border-slate-100 py-3">
            <div className="flex items-center">
              <Users size={18} className="mr-1.5 text-slate-400" />
              {property.capacity} pers.
            </div>
            <div className="flex items-center">
              <Wifi size={18} className="mr-1.5 text-slate-400" />
              Wifi inclus
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              {property.amenities.slice(0, 2).map((amenity, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-slate-50 text-slate-600 text-[10px] font-bold uppercase border border-slate-100">
                  <Check size={10} className="mr-1 text-accent" />
                  {amenity}
                </span>
              ))}
              <button 
                onClick={() => setShowAmenitiesModal(true)}
                className="text-[10px] font-bold uppercase text-accent hover:underline"
              >
                + Détails
              </button>
            </div>
          </div>

          {/* ZONE D'ACTION */}
          <div className="flex flex-col gap-3">
            {/* Bouton Principal - Vert WhatsApp */}
            <button 
              onClick={() => setShowBookingModal(true)}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-all shadow-lg active:scale-95 group"
            >
              <div className="flex items-center gap-1.5">
                <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
                <MessageCircle size={18} fill="white" className="group-hover:scale-110 transition-transform" />
              </div>
              Réserver / Estimer le prix
            </button>

            <div className="flex gap-2">
              {/* Bouton Album Photo - Couleur Accent (Bois) avec hover ajusté */}
              {property.driveFolderUrl && (
                <a 
                  href={property.driveFolderUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-grow flex items-center justify-center px-4 py-2.5 bg-accent text-white rounded-xl font-bold text-xs hover:bg-[#b3955f] transition-all shadow-sm"
                >
                  <ImageIcon size={14} className="mr-2" />
                  Album Photo
                </a>
              )}

              {/* Petit bouton Vidéo secondaire */}
              {property.youtubeVideoUrl && (
                <a 
                  href={property.youtubeVideoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all"
                >
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modale Unifiée de Réservation */}
      {showBookingModal && (
        <BookingModal 
          property={property} 
          onClose={() => setShowBookingModal(false)} 
        />
      )}

      {/* Modale des Commodités */}
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => setShowAmenitiesModal(false)}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200 z-10">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-serif font-bold text-slate-800 text-lg">Commodités</h3>
                    <button onClick={() => setShowAmenitiesModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <ul className="space-y-3">
                        {property.amenities.map((amenity, idx) => (
                            <li key={idx} className="flex items-start text-slate-700 text-sm">
                                <Check size={14} className="mt-0.5 mr-3 text-accent" />
                                <span className="font-medium">{amenity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;