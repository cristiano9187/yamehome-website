import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar as CalendarIcon, MapPin, X } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface SearchBarProps {
  destination: string;
  setDestination: (value: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  destination, 
  setDestination, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  onSearch 
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const range: DateRange | undefined = {
    from: startDate || undefined,
    to: endDate || undefined
  };

  const setRange = (newRange: DateRange | undefined) => {
    setStartDate(newRange?.from || null);
    setEndDate(newRange?.to || null);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateRange = () => {
    if (!startDate) return 'Sélectionnez vos dates';
    if (!endDate) return format(startDate, 'dd MMM', { locale: fr });
    return `${format(startDate, 'dd MMM', { locale: fr })} - ${format(endDate, 'dd MMM', { locale: fr })}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-[11.5rem] sm:-mt-40 md:-mt-40 lg:-mt-44 relative z-40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 md:p-3 flex flex-col md:flex-row items-stretch gap-1 md:gap-0">
        
        {/* Destination */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2 md:py-3 md:border-r border-slate-100">
          <MapPin className="text-accent shrink-0" size={20} />
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Destination</label>
            <select 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-slate-700 font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Toutes les destinations</option>
              <option value="Yaoundé">Yaoundé (Odza)</option>
              <option value="Bangangté">Bangangté (Ouest)</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="flex-1 relative">
          <div 
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-3 px-4 py-2 md:py-3 md:border-r border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors h-full"
          >
            <CalendarIcon className="text-accent shrink-0" size={20} />
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Dates</label>
              <span className="block text-slate-700 font-medium truncate">
                {formatDateRange()}
              </span>
            </div>
            {range && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setRange(undefined);
                }}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Calendar Popover */}
          {showCalendar && (
            <div 
              ref={calendarRef}
              className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200"
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

        {/* Search Button */}
        <div className="md:pl-3 flex items-center">
          <button 
            onClick={onSearch}
            className="w-full md:w-auto bg-accent hover:bg-[#b3955f] text-white px-8 py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20 active:scale-95"
          >
            <Search size={20} />
            <span>Rechercher</span>
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
        @media (max-width: 768px) {
          .rdp-months {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
