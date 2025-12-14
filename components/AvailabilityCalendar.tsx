import React, { useEffect, useState } from 'react';
import { X, Calendar as CalendarIcon, Loader } from 'lucide-react';

interface AvailabilityCalendarProps {
  propertyId: string;
  onClose: () => void;
}

interface Reservation {
  id: string;
  start: Date;
  end: Date;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ propertyId, onClose }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour la navigation du calendrier (par défaut mois en cours)
  const [currentDate] = useState(new Date());

  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVRFWwbFIFj7aQGC2ysOUE1jfjz4aAyqwenQEenkm-WEEQ9H53VOM3IUlF3gKofw/pub?gid=594250808&single=true&output=csv";

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error("Erreur chargement données");
        const text = await response.text();
        
        // Parsing CSV simple
        const rows = text.split('\n').slice(1); // Ignorer le header
        const parsedReservations: Reservation[] = rows
          .map(row => {
            const cols = row.split(',');
            if (cols.length < 3) return null;
            
            const id = cols[0]?.trim();
            const startStr = cols[1]?.trim();
            const endStr = cols[2]?.trim();

            if (id === propertyId && startStr && endStr) {
              return {
                id,
                start: new Date(startStr),
                end: new Date(endStr)
              };
            }
            return null;
          })
          .filter((res): res is Reservation => res !== null);

        setReservations(parsedReservations);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les disponibilités.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [propertyId]);

  // Fonction pour vérifier si un jour est occupé
  const isBooked = (date: Date) => {
    // Normaliser la date à comparer pour ignorer l'heure
    const checkDate = new Date(date.setHours(0, 0, 0, 0));
    
    return reservations.some(res => {
      const start = new Date(res.start.setHours(0, 0, 0, 0));
      const end = new Date(res.end.setHours(0, 0, 0, 0));
      
      // MODIFICATION LOGIQUE :
      // On inclut le jour d'arrivée (start)
      // On EXCLUT le jour de départ (end) car il est disponible pour un nouveau check-in l'après-midi.
      return checkDate >= start && checkDate < end;
    });
  };

  // Composant pour afficher un mois
  const MonthGrid = ({ year, month }: { year: number, month: number }) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Dimanche
    
    // Ajustement pour commencer la semaine Lundi (Lundi=0 ... Dimanche=6)
    const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Cases vides début de mois
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Jours du mois
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = date < today;
      const booked = isBooked(date);
      
      let bgClass = "bg-white text-slate-700 hover:bg-slate-100";
      if (isPast) {
        bgClass = "bg-slate-100 text-slate-300 cursor-not-allowed";
      } else if (booked) {
        bgClass = "bg-red-500 text-white font-bold shadow-sm";
      } else {
        bgClass = "bg-green-50 text-green-800 font-medium border border-green-100";
      }

      days.push(
        <div 
          key={d} 
          className={`h-8 md:h-10 flex items-center justify-center rounded-md text-xs md:text-sm transition-colors ${bgClass}`}
        >
          {d}
        </div>
      );
    }

    const monthName = new Date(year, month).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    return (
      <div className="mb-6 bg-white p-2 rounded-lg border border-slate-50 shadow-sm">
        <h4 className="text-center font-serif font-bold text-slate-800 mb-3 capitalize bg-slate-50 py-1 rounded">{monthName}</h4>
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className="text-center text-xs text-slate-400 font-bold">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days}
        </div>
      </div>
    );
  };

  // Calcul des 3 mois à afficher
  const month1 = new Date(currentDate);
  const month2 = new Date(currentDate);
  month2.setMonth(currentDate.getMonth() + 1);
  const month3 = new Date(currentDate);
  month3.setMonth(currentDate.getMonth() + 2);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* MODIFICATION STYLE : max-w-6xl pour accomoder 3 mois côte à côte */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden relative animate-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-accent" size={24} />
            <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl">Disponibilités</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto bg-slate-50 flex-grow">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <Loader className="animate-spin text-accent" size={32} />
              <p className="text-slate-500 text-sm">Synchronisation avec le planning...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Légende */}
              <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded shadow-sm"></div>
                  <span className="text-slate-600">Occupé (Nuit réservée)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-50 border border-green-200 rounded shadow-sm"></div>
                  <span className="text-slate-600">Libre (Check-in possible)</span>
                </div>
              </div>

              {/* Grilles des 3 mois */}
              {/* MODIFICATION RESPONSIVE : 
                  - grid-cols-1 sur mobile
                  - md:grid-cols-2 sur tablette (2 en haut, 1 en bas)
                  - lg:grid-cols-3 sur grand écran (3 côte à côte)
              */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MonthGrid year={month1.getFullYear()} month={month1.getMonth()} />
                <MonthGrid year={month2.getFullYear()} month={month2.getMonth()} />
                <MonthGrid year={month3.getFullYear()} month={month3.getMonth()} />
              </div>

               <p className="text-center text-xs text-slate-400 mt-4 italic">
                * Les disponibilités sont mises à jour en temps réel. Le jour de départ d'un client est disponible pour une nouvelle arrivée (après 14h).
              </p>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;