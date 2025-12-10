import React from 'react';
import { Property } from '../types';
import { Users, Wifi, MapPin, Check, Building, Image as ImageIcon } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-slate-100">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badge Type */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
          {property.type}
        </div>

        {/* Badge Site Name (if exists) */}
        {property.siteName && (
          <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
            {property.siteName}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-4 right-4 text-right">
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
              <span className="text-xs text-slate-400 self-center">+{property.amenities.length - 3}</span>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-auto">
            <button className="flex-1 py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors shadow-sm hover:shadow-md">
            Réserver
            </button>
            {property.driveFolderUrl && (
            <a 
                href={property.driveFolderUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2.5 border border-accent text-accent rounded-lg font-medium text-sm hover:bg-accent hover:text-white transition-colors"
                title="Voir toutes les photos"
            >
                <ImageIcon size={18} />
            </a>
            )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;