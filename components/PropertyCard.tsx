import React, { useState } from 'react';
import { Property, Location } from '../types';
import { Users, Wifi, MapPin, Check, Building, Image as ImageIcon, MessageCircle, ChevronLeft, ChevronRight, Youtube, X } from 'lucide-react';
import { WHATSAPP_AGENT_YAOUNDE, WHATSAPP_AGENT_BANGANGTE } from '../constants';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  // Définition du numéro WhatsApp selon la localisation du logement
  const getWhatsAppNumber = (location: Location) => {
    const cleanNumber = (num: string) => num.replace(/[^0-9]/g, '');
    if (location === Location.BANGANGTE) {
      return cleanNumber(WHATSAPP_AGENT_BANGANGTE); // Celsus
    }
    return cleanNumber(WHATSAPP_AGENT_YAOUNDE); // Paola
  };

  const whatsappNumber = getWhatsAppNumber(property.location);
  const message = encodeURIComponent(`Bonjour, je suis intéressé par : ${property.title} (${property.siteName || property.location}). Est-il disponible ?`);

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
          
          {/* Contrôles du Carrousel (visibles au survol uniquement si plusieurs images) */}
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
              
              {/* Indicateur de position (points) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {property.images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-1.5 h-1.5 rounded-full transition-colors shadow-sm ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badge Type */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm pointer-events-none">
            {property.type}
          </div>

          {/* Badge Site Name */}
          {property.siteName && (
            <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm pointer-events-none">
              {property.siteName}
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-4 right-4 text-right pointer-events-none">
            <div className="text-white font-bold text-xl">
              {property.pricePerNight.toLocaleString('fr-FR')} FCFA
            </div>
            <div className="text-white/80 text-xs font-normal">
              / nuit (1-6 jours)
            </div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex flex-col mb-3">
            <div className="flex items-start text-slate-500 text-xs font-medium mb-1 uppercase tracking-wide">
               <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0 text-accent" />
               {property.fullAddress || property.location}
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-800 group-hover:text-accent transition-colors">
              {property.title}
            </h3>
          </div>
          
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>

          {/* Studio Option Alert */}
          {property.studioPrice && (
            <div className="mb-4 bg-amber-50 border border-amber-100 rounded-md p-2 text-xs text-amber-800 flex items-center">
              <Building size={14} className="mr-2 flex-shrink-0" />
              <span>
                <strong>Option Studio :</strong> Disponible à partir de {property.studioPrice.toLocaleString('fr-FR')} FCFA / nuit.
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6 text-slate-500 text-sm border-y border-slate-100 py-3">
            <div className="flex items-center" title="Capacité">
              <Users size={18} className="mr-1.5 text-slate-400" />
              {property.capacity} pers.
            </div>
            <div className="flex items-center" title="Wifi Disponible">
              <Wifi size={18} className="mr-1.5 text-slate-400" />
              Inclus
            </div>
          </div>

          <div className="mt-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Commodités</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {property.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-slate-50 text-slate-600 text-xs border border-slate-100">
                  <Check size={12} className="mr-1 text-accent" />
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAmenitiesModal(true);
                  }}
                  className="text-xs text-slate-500 self-center hover:text-accent transition-colors underline decoration-dotted cursor-pointer font-medium"
                >
                  +{property.amenities.length - 3} autres
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
              {/* Bouton WhatsApp direct */}
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow flex items-center justify-center py-2.5 bg-[#25D366] text-white rounded-lg font-medium text-sm hover:bg-[#20bd5a] transition-colors shadow-sm hover:shadow-md"
              >
                <MessageCircle size={18} className="mr-2" />
                Réserver
              </a>
              
              {/* Bouton Photos Drive */}
              {property.driveFolderUrl && (
              <a 
                  href={property.driveFolderUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-3 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
                  title="Voir toutes les photos"
              >
                  <ImageIcon size={18} />
              </a>
              )}

              {/* Bouton Vidéo YouTube */}
              {property.youtubeVideoUrl && (
              <a 
                  href={property.youtubeVideoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-3 py-2.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors"
                  title="Voir la vidéo"
              >
                  <Youtube size={18} />
              </a>
              )}
          </div>
        </div>
      </div>

      {/* Modale des Commodités */}
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Overlay cliquable pour fermer */}
            <div className="absolute inset-0" onClick={() => setShowAmenitiesModal(false)}></div>
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200 z-10">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-serif font-bold text-slate-800 text-lg">Toutes les commodités</h3>
                    <button 
                        onClick={() => setShowAmenitiesModal(false)}
                        className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <ul className="space-y-3">
                        {property.amenities.map((amenity, idx) => (
                            <li key={idx} className="flex items-start text-slate-700 text-sm">
                                <div className="mt-0.5 mr-3 flex-shrink-0 bg-green-50 rounded-full p-1">
                                    <Check size={12} className="text-accent" />
                                </div>
                                <span className="font-medium text-slate-600">{amenity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                    <button 
                        onClick={() => setShowAmenitiesModal(false)}
                        className="w-full px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors shadow-lg"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;