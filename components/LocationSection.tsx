import React, { useState } from 'react';
import { Navigation } from 'lucide-react';

interface LocationData {
  name: string;
  iframeUrl: string;
  gpsUrl: string;
}

interface LocationSectionProps {
  title: string;
  locations: LocationData[];
}

const LocationSection: React.FC<LocationSectionProps> = ({ title, locations }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (locations.length === 0) return null;

  const activeLocation = locations[activeIndex];

  return (
    <div className="mt-16 w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif font-bold text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm mt-2">Retrouvez-nous facilement sur Google Maps</p>
      </div>

      {/* Système d'onglets (affiché uniquement s'il y a plusieurs lieux) */}
      {locations.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {locations.map((loc, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                index === activeIndex
                  ? 'bg-accent border-accent text-white shadow-md transform scale-105'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}

      {/* Conteneur de la carte */}
      <div className="relative w-full bg-slate-100 rounded-xl overflow-hidden shadow-lg border border-slate-200 p-1">
        <iframe
          src={activeLocation.iframeUrl}
          className="w-full h-96 rounded-lg shadow-inner bg-slate-200"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Carte ${activeLocation.name}`}
        ></iframe>
      </div>

      {/* Bouton GPS */}
      <div className="flex justify-center mt-6">
        <a 
          href={activeLocation.gpsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-white text-accent border border-accent rounded-lg font-medium hover:bg-accent hover:text-white transition-all shadow-sm hover:shadow-md"
        >
          <Navigation size={18} />
          Ouvrir l'itinéraire GPS
        </a>
      </div>
    </div>
  );
};

export default LocationSection;