import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, MessageCircle, Info, Calculator, Check, Loader } from 'lucide-react';
import { Property, Location } from '../types';
import { WHATSAPP_AGENT_YAOUNDE, WHATSAPP_AGENT_BANGANGTE, getRateForApartment } from '../constants';

interface BookingModalProps {
  property: Property;
  onClose: () => void;
}

interface Reservation {
  start: Date;
  end: Date;
}

const BookingModal: React.FC<BookingModalProps> = ({ property, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isStudioMode, setIsStudioMode] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVRFWwbFIFj7aQGC2ysOUE1jfjz4aAyqwenQEenkm-WEEQ9H53VOM3IUlF3gKofw/pub?gid=594250808&single=true&output=csv";

  // Utilitaire pour formater une date en YYYY-MM-DD local sans décalage UTC
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(CSV_URL);
        const text = await response.text();
        const rows = text.split('\n').slice(1);
        const parsed = rows
          .map(row => {
            const cols = row.split(',');
            if (cols[0]?.trim() === property.id) {
              return {
                start: new Date(cols[1]?.trim()),
                end: new Date(cols[2]?.trim())
              };
            }
            return null;
          })
          .filter((r): r is Reservation => r !== null);
        setReservations(parsed);
      } catch (err) {
        console.error("Erreur calendrier:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [property.id]);

  const isBooked = (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return reservations.some(res => {
      const resStart = new Date(res.start.getFullYear(), res.start.getMonth(), res.start.getDate());
      const resEnd = new Date(res.end.getFullYear(), res.end.getMonth(), res.end.getDate());
      return d >= resStart && d < resEnd;
    });
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (date < today || isBooked(date)) return;

    // CORRECTION : Utilisation du formatage local au lieu de toISOString()
    const dateStr = formatDateLocal(date);
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate('');
    } else if (startDate && !endDate) {
      if (dateStr < startDate) {
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
    }
  };

  // CALCULS DE PRIX DYNAMIQUES
  const nights = (startDate && endDate) ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  const rateInfo = getRateForApartment(property.id, nights > 0 ? nights : 1);
  const unitPrice = isStudioMode ? (property.studioPrice || rateInfo.prix) : rateInfo.prix;
  const caution = rateInfo.caution;
  const total = nights > 0 ? (nights * unitPrice) + caution : 0;

  const getWhatsAppNumber = () => {
    const num = property.location === Location.BANGANGTE ? WHATSAPP_AGENT_BANGANGTE : WHATSAPP_AGENT_YAOUNDE;
    return num.replace(/[^0-9]/g, '');
  };

  const sendWhatsApp = () => {
    const msg = `Bonjour YameHome! Je souhaite réserver :
🏠 Logement : ${property.title} (${property.siteName || property.location})
📅 Arrivée : ${startDate}
📅 Départ : ${endDate}
🌙 Durée : ${nights} nuit(s)
💰 Mode : ${isStudioMode ? 'Studio' : 'Appartement complet'}
💵 Total estimé : ${total.toLocaleString('fr-FR')} FCFA (Caution incluse)`;
    window.open(`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative animate-in zoom-in-95 duration-300 z-10 flex flex-col max-h-[95vh]">
        
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl">
              <CalendarIcon className="text-accent" size={24} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-800 text-xl leading-tight">{property.title}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{property.siteName || property.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <CalendarIcon size={18} className="text-accent" /> Disponibilités
              </h4>
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <Loader className="animate-spin mb-2" />
                  <p className="text-xs">Chargement du planning...</p>
                </div>
              ) : (
                <div className="space-y-4">
                   <MonthGrid 
                    date={currentMonth} 
                    isBooked={isBooked} 
                    startDate={startDate} 
                    endDate={endDate} 
                    onDateClick={handleDateClick}
                    formatDateLocal={formatDateLocal}
                   />
                   <div className="flex justify-between mt-4">
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="text-xs font-bold text-accent">Précédent</button>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="text-xs font-bold text-accent">Suivant</button>
                   </div>
                   <div className="flex gap-4 mt-4 text-[10px] uppercase font-bold text-slate-400 justify-center">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Occupé</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 bg-accent rounded-full"></div> Votre sélection</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-100 border border-slate-200 rounded-full"></div> Libre</div>
                   </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Calculator size={18} className="text-accent" /> Votre Séjour
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Arrivée</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Départ</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium" 
                    />
                  </div>
                </div>

                {property.studioPrice && (
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-accent/10 rounded-lg text-accent">
                        <Info size={16} />
                      </div>
                      <span className="text-xs font-bold text-amber-900 uppercase">Mode Studio (Prix réduit)</span>
                    </div>
                    <button 
                      onClick={() => setIsStudioMode(!isStudioMode)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${isStudioMode ? 'bg-accent' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isStudioMode ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                )}

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Durée :</span>
                    <span className="font-bold text-slate-800">{nights} nuits</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Prix par nuit :</span>
                    <span className="font-bold text-slate-800">{unitPrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  {caution > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Caution (remboursable) :</span>
                      <span className="font-bold text-slate-800">{caution.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-dashed border-slate-100">
                    <span className="font-serif font-bold text-slate-800 text-lg">TOTAL ESTIMÉ :</span>
                    <span className="text-2xl font-bold text-accent">{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <button 
            disabled={!startDate || !endDate || nights <= 0}
            onClick={sendWhatsApp}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#20bd5a] transition-all shadow-xl shadow-green-200 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed active:scale-95"
          >
            <MessageCircle size={24} fill="white" />
            RÉSERVER SUR WHATSAPP
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-3 uppercase font-bold tracking-widest">
            Confirmation instantanée avec nos agents
          </p>
        </div>
      </div>
    </div>
  );
};

const MonthGrid = ({ date, isBooked, startDate, endDate, onDateClick, formatDateLocal }: any) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const days = [];
  const today = new Date();
  today.setHours(0,0,0,0);

  for (let i = 0; i < offset; i++) days.push(<div key={`e-${i}`} />);

  for (let d = 1; d <= daysInMonth; d++) {
    const curr = new Date(year, month, d);
    const booked = isBooked(curr);
    const isPast = curr < today;
    
    // CORRECTION : Utilisation de formatDateLocal pour comparer
    const currStr = formatDateLocal(curr);
    const isStart = startDate === currStr;
    const isEnd = endDate === currStr;
    const inRange = startDate && endDate && currStr > startDate && currStr < endDate;

    let cls = "h-8 md:h-9 flex items-center justify-center text-xs rounded-lg cursor-pointer transition-all border ";
    
    if (isPast) {
      cls += "bg-slate-50 text-slate-300 border-transparent cursor-not-allowed ";
    } else if (booked) {
      cls += "bg-red-500 text-white font-bold border-red-600 shadow-sm cursor-not-allowed ";
    } else if (isStart || isEnd) {
      cls += "bg-accent text-white font-bold border-accent ring-2 ring-accent/20 ";
    } else if (inRange) {
      cls += "bg-accent/10 text-accent font-bold border-accent/20 ";
    } else {
      cls += "bg-white text-slate-600 hover:bg-slate-100 border-slate-100 ";
    }

    days.push(
      <div key={d} onClick={() => !booked && !isPast && onDateClick(curr)} className={cls}>
        {d}
      </div>
    );
  }

  return (
    <div>
      <h5 className="text-center text-sm font-bold capitalize mb-4 text-slate-700">{date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h5>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['L','M','M','J','V','S','D'].map(l => <div key={l} className="text-[10px] font-bold text-slate-300">{l}</div>)}
        {days}
      </div>
    </div>
  );
};

export default BookingModal;