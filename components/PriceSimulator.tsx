import React, { useState, useEffect } from 'react';
import { X, Calculator, MessageCircle, Info } from 'lucide-react';
import { Property, Location } from '../types';
import { WHATSAPP_AGENT_YAOUNDE, WHATSAPP_AGENT_BANGANGTE } from '../constants';

interface PriceSimulatorProps {
  property: Property;
  onClose: () => void;
}

const PriceSimulator: React.FC<PriceSimulatorProps> = ({ property, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isStudioMode, setIsStudioMode] = useState(false);
  
  const [calculation, setCalculation] = useState<{
    nights: number;
    pricePerNight: number;
    totalRent: number;
    caution: number;
    grandTotal: number;
  } | null>(null);

  // Définir la date min comme "aujourd'hui"
  const today = new Date().toISOString().split('T')[0];

  // Effet pour recalculer à chaque changement
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Calcul différence jours (en ms -> jours)
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 0 && end > start) {
        calculatePrice(diffDays);
      } else {
        setCalculation(null);
      }
    }
  }, [startDate, endDate, isStudioMode]);

  const calculatePrice = (nights: number) => {
    // Sélectionner le jeu de règles (Standard ou Studio)
    const rules = isStudioMode && property.pricing.studioMode 
      ? property.pricing.studioMode 
      : property.pricing.standard;

    // Trouver la règle correspondante
    const rule = rules.find(r => {
      if (r.maxNights) {
        return nights >= r.minNights && nights <= r.maxNights;
      }
      return nights >= r.minNights; // Cas où maxNights est undefined (infini)
    });

    if (rule) {
      setCalculation({
        nights,
        pricePerNight: rule.pricePerNight,
        totalRent: nights * rule.pricePerNight,
        caution: rule.caution,
        grandTotal: (nights * rule.pricePerNight) + rule.caution
      });
    }
  };

  const getWhatsAppLink = () => {
    if (!calculation) return '#';

    const cleanNumber = (num: string) => num.replace(/[^0-9]/g, '');
    const number = property.location === Location.BANGANGTE 
      ? cleanNumber(WHATSAPP_AGENT_BANGANGTE) 
      : cleanNumber(WHATSAPP_AGENT_YAOUNDE);

    const modeText = isStudioMode ? " (Mode Studio)" : "";
    
    const text = `Bonjour, je souhaite réserver :
🏠 ${property.title}${modeText}
📍 ${property.fullAddress || property.location}

📅 Du : ${startDate}
📅 Au : ${endDate}
🌙 Durée : ${calculation.nights} nuits

💰 Tarif unitaire : ${calculation.pricePerNight.toLocaleString('fr-FR')} FCFA
💵 Loyer total : ${calculation.totalRent.toLocaleString('fr-FR')} FCFA
🔒 Caution : ${calculation.caution.toLocaleString('fr-FR')} FCFA
----------------
✅ TOTAL À PAYER : ${calculation.grandTotal.toLocaleString('fr-FR')} FCFA

Est-ce disponible ?`;

    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200 z-10 flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Calculator className="text-accent" size={24} />
            <h3 className="font-serif font-bold text-slate-800 text-lg">Estimer le prix</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-500">
            Sélectionnez vos dates pour voir nos tarifs dégressifs appliqués automatiquement.
          </p>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Arrivée</label>
              <input 
                type="date" 
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Départ</label>
              <input 
                type="date" 
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
              />
            </div>
          </div>

          {/* Toggle Studio Mode */}
          {property.pricing.studioMode && (
            <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Louer en "Mode Studio" ?</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isStudioMode} 
                  onChange={(e) => setIsStudioMode(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          )}

          {/* Resultats */}
          {calculation ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Durée :</span>
                <span className="font-bold text-slate-800">{calculation.nights} nuits</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Prix unitaire :</span>
                <span className="font-medium text-slate-800">{calculation.pricePerNight.toLocaleString('fr-FR')} FCFA / nuit</span>
              </div>
               <div className="flex justify-between text-sm border-b border-slate-200 pb-2">
                <span className="text-slate-600">Caution (Remboursable) :</span>
                <span className="font-medium text-slate-800">{calculation.caution.toLocaleString('fr-FR')} FCFA</span>
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <span className="text-base font-bold text-slate-800">TOTAL ESTIMÉ</span>
                <span className="text-xl font-bold text-accent">{calculation.grandTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <p className="text-[10px] text-slate-400 italic text-right">* Loyer + Caution inclus</p>
            </div>
          ) : (
            <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">Entrez vos dates pour voir le calcul</p>
            </div>
          )}

          {/* Bouton Action */}
          <a
            href={calculation ? getWhatsAppLink() : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${
              calculation 
                ? 'bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-xl transform hover:-translate-y-0.5' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
            onClick={(e) => !calculation && e.preventDefault()}
          >
            <MessageCircle className="mr-2" size={20} />
            {calculation ? 'Commander sur WhatsApp' : 'Remplir les dates'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PriceSimulator;