import React, { useEffect, useRef, useState } from 'react';
import { X, MessageCircle, Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Location, PropertyType } from '../types';
import { WHATSAPP_AGENT_YAOUNDE, WHATSAPP_AGENT_BANGANGTE } from '../constants';
import 'react-day-picker/dist/style.css';

interface LeadTunnelModalProps {
  onClose: () => void;
  campaignSource?: string;
}

const LeadTunnelModal: React.FC<LeadTunnelModalProps> = ({ onClose, campaignSource = '' }) => {
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [city, setCity] = useState<Location | ''>('');
  const [arrivalApprox, setArrivalApprox] = useState<Date | null>(null);
  const [departureApprox, setDepartureApprox] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const range: DateRange | undefined = {
    from: arrivalApprox || undefined,
    to: departureApprox || undefined,
  };

  const setRange = (newRange: DateRange | undefined) => {
    setArrivalApprox(newRange?.from || null);
    setDepartureApprox(newRange?.to || null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateLocal = (date: Date) => format(date, 'yyyy-MM-dd');
  const formatDateRange = () => {
    if (!arrivalApprox) return 'Sélectionnez vos dates approximatives';
    if (!departureApprox) return format(arrivalApprox, 'dd MMM', { locale: fr });
    return `${format(arrivalApprox, 'dd MMM', { locale: fr })} - ${format(departureApprox, 'dd MMM', { locale: fr })}`;
  };

  const getWhatsAppNumber = () => {
    const rawNumber =
      city === Location.BANGANGTE ? WHATSAPP_AGENT_BANGANGTE : WHATSAPP_AGENT_YAOUNDE;
    return rawNumber.replace(/[^0-9]/g, '');
  };

  const sendLeadToWhatsApp = () => {
    if (!propertyType || !city) return;

    const msg = `Bonjour YameHome! Je suis intéressé(e) par une réservation.
🏘️ Type recherché : ${propertyType}
📍 Ville : ${city}
📅 Arrivée approximative : ${arrivalApprox ? formatDateLocal(arrivalApprox) : 'Non précisée'}
📅 Départ approximatif : ${departureApprox ? formatDateLocal(departureApprox) : 'Non précisé'}
🤝 Je souhaite être guidé(e) par votre assistant pour finaliser ma réservation.
${campaignSource ? `📣 Source campagne : ${campaignSource}` : ''}`;

    window.open(`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-visible relative animate-in zoom-in-95 duration-300 z-10">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="font-serif font-bold text-slate-800 text-xl leading-tight">
              Trouvez rapidement votre logement
            </h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">
              En 30 secondes
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 bg-slate-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Type de logement
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium"
              >
                <option value="">Sélectionner</option>
                <option value={PropertyType.CHAMBRE}>Chambre</option>
                <option value={PropertyType.STUDIO}>Studio</option>
                <option value={PropertyType.APPARTEMENT}>Appartement</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ville</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as Location)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium"
              >
                <option value="">Sélectionner</option>
                <option value={Location.YAOUNDE}>Yaoundé</option>
                <option value={Location.BANGANGTE}>Bangangté</option>
              </select>
            </div>

            <div className="md:col-span-2 relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Séjour approximatif
              </label>
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <CalendarIcon className="text-accent shrink-0" size={18} />
                <span className="block text-slate-700 font-medium truncate">{formatDateRange()}</span>
                {range && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRange(undefined);
                    }}
                    className="ml-auto p-1 hover:bg-slate-200 rounded-full text-slate-400"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {showCalendar && (
                <div
                  ref={calendarRef}
                  className="relative mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200"
                >
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    numberOfMonths={1}
                    locale={fr}
                    disabled={{ before: new Date() }}
                    className="rdp-custom"
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <button
            onClick={sendLeadToWhatsApp}
            disabled={!propertyType || !city}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#20bd5a] transition-all active:scale-95 disabled:opacity-50"
          >
            <MessageCircle size={22} fill="white" />
            ÊTRE GUIDÉ SUR WHATSAPP
          </button>
        </div>
      </div>
      <style>{`
        .rdp-custom {
          --rdp-accent-color: rgb(204, 170, 109);
          --rdp-background-color: rgba(204, 170, 109, 0.1);
          margin: 0;
        }
        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
          background-color: var(--rdp-accent-color);
        }
        .rdp-day_range_middle {
          background-color: var(--rdp-background-color);
          color: var(--rdp-accent-color);
        }
      `}</style>
    </div>
  );
};

export default LeadTunnelModal;
