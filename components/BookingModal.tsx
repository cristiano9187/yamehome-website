import React, { useState, useMemo } from 'react';
import { X, Calendar as CalendarIcon, MessageCircle, Info, Calculator, Loader2, Send } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { Property, Location, Reservation as GlobalReservation } from '../types';
import { WHATSAPP_AGENT_YAOUNDE, WHATSAPP_AGENT_BANGANGTE, getRateForApartment } from '../constants';
import { functions } from '../firebase';

interface BookingModalProps {
  property: Property;
  onClose: () => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  campaignSource?: string;
  allReservations?: GlobalReservation[];
}

interface LocalReservation {
  start: Date;
  end: Date;
}

// Utilitaire pour formater une date en YYYY-MM-DD local (évite le décalage UTC)
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BookingModal: React.FC<BookingModalProps> = ({ property, onClose, initialStartDate, initialEndDate, campaignSource = '', allReservations = [] }) => {
  const [startDate, setStartDate] = useState<string>(initialStartDate ? formatDateLocal(initialStartDate) : '');
  const [endDate, setEndDate] = useState<string>(initialEndDate ? formatDateLocal(initialEndDate) : '');
  const [isStudioMode, setIsStudioMode] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(initialStartDate || new Date());
  const [guestCount, setGuestCount] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [tripPurpose, setTripPurpose] = useState('');
  const [specialNeed, setSpecialNeed] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filtrage et conversion des réservations pour cet appartement (depuis les données temps réel de App)
  const reservations = useMemo<LocalReservation[]>(() =>
    allReservations
      .filter(res => res.propertyId === property.id && res.status !== 'cancelled')
      .map(res => ({
        start: new Date(res.startDate),
        end: new Date(res.endDate),
      })),
    [allReservations, property.id]
  );

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

  const nights = (startDate && endDate) ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const rateInfo = getRateForApartment(property.id, nights > 0 ? nights : 1, isStudioMode);
  const unitPrice = rateInfo.prix;
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
${guestCount ? `👥 Voyageurs : ${guestCount}` : ''}
${originCity.trim() ? `🌍 Ville de provenance : ${originCity}` : ''}
💰 Mode : ${isStudioMode ? 'Studio' : 'Appartement complet'}
💵 Caution : ${caution.toLocaleString('fr-FR')} FCFA
💵 Total estimé : ${total.toLocaleString('fr-FR')} FCFA (Caution incluse)
${arrivalTime ? `⏰ Heure d'arrivée estimée : ${arrivalTime}` : ''}
${tripPurpose ? `🧭 Motif du séjour : ${tripPurpose}` : ''}
${specialNeed ? `📝 Besoin particulier : ${specialNeed}` : ''}
${campaignSource ? `📣 Source campagne : ${campaignSource}` : ''}`;
    window.open(`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const buildProspectNotes = () => {
    const lines: string[] = [];
    if (guestCount.trim()) lines.push(`Voyageurs : ${guestCount}`);
    if (originCity.trim()) lines.push(`Ville de provenance : ${originCity}`);
    if (arrivalTime.trim()) lines.push(`Heure d'arrivée estimée : ${arrivalTime}`);
    if (tripPurpose.trim()) lines.push(`Motif du séjour : ${tripPurpose}`);
    if (specialNeed.trim()) lines.push(`Besoin particulier : ${specialNeed}`);
    lines.push(`Logement : ${property.title} (${property.siteName || property.location})`);
    lines.push(`Total affiché (nuits × tarif + caution) : ${total.toLocaleString('fr-FR')} FCFA`);
    return lines.join('\n');
  };

  const handleSubmitProspect = async () => {
    setSubmitError(null);
    if (!startDate || !endDate || nights <= 0) {
      setSubmitError('Choisissez les dates de séjour.');
      return;
    }
    if (!lastName.trim()) {
      setSubmitError('Le nom est obligatoire.');
      return;
    }
    if (!phone.trim() || phone.replace(/\s/g, '').length < 8) {
      setSubmitError('Indiquez un numéro de téléphone valide.');
      return;
    }

    setSubmitting(true);
    try {
      const submit = httpsCallable(functions, 'submitWebsiteProspect');
      await submit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        calendarSlug: property.id,
        isStudioMode,
        startDate,
        endDate,
        guestCount: guestCount.trim() ? Number(guestCount) : 1,
        notes: buildProspectNotes(),
        campaignSource: campaignSource || '',
      });
      setSubmitSuccess(true);
    } catch (e: unknown) {
      const err = e as { message?: string; code?: string };
      setSubmitError(err.message || 'Impossible d’envoyer la demande. Réessayez ou contactez-nous sur WhatsApp.');
    } finally {
      setSubmitting(false);
    }
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
              </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Voyageurs (optionnel)</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="Ex: 2"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ville de provenance (optionnel)</label>
                    <input
                      type="text"
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      placeholder="Ex: Douala"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Heure d'arrivée (optionnel)</label>
                    <input
                      type="time"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Motif du séjour (optionnel)</label>
                    <select
                      value={tripPurpose}
                      onChange={(e) => setTripPurpose(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Affaires">Affaires</option>
                      <option value="Famille">Famille</option>
                      <option value="Tourisme">Tourisme</option>
                      <option value="Études">Études</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Besoin particulier (optionnel)</label>
                    <input
                      type="text"
                      value={specialNeed}
                      onChange={(e) => setSpecialNeed(e.target.value)}
                      placeholder="Ex: lit bébé, facture"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium"
                    />
                  </div>
                </div>

                {property.studioPrice && (
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100 mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase">
                      <Info size={16} className="text-accent" /> Mode Studio
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsStudioMode(!isStudioMode)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${isStudioMode ? 'bg-accent' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isStudioMode ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4 mb-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pré-réservation (sans compte)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prénom</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom *</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
                        autoComplete="family-name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Téléphone *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+237 …"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
                        autoComplete="tel"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email (optionnel)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Durée :</span>
                    <span className="font-bold text-slate-800">{nights} nuits</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Prix/Nuit :</span>
                    <span className="font-bold text-slate-800">{unitPrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Caution :</span>
                    <span className="font-bold text-slate-800">{caution.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-dashed border-slate-100">
                    <span className="font-serif font-bold text-slate-800 text-lg">TOTAL :</span>
                    <span className="text-2xl font-bold text-accent">{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100 space-y-3">
          {submitSuccess ? (
            <div className="text-center py-4 space-y-2">
              <p className="text-slate-800 font-serif font-bold text-lg">Demande bien reçue</p>
              <p className="text-slate-600 text-sm">Nous revenons vers vous rapidement pour confirmer votre pré-réservation et les modalités de paiement.</p>
              <button type="button" onClick={onClose} className="mt-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm">Fermer</button>
            </div>
          ) : (
            <>
              {submitError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{submitError}</div>
              )}
              <button 
                type="button"
                disabled={!startDate || !endDate || nights <= 0 || submitting}
                onClick={handleSubmitProspect}
                className="w-full flex items-center justify-center gap-3 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-[#b3955f] transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
                ENVOYER MA PRÉ-RÉSERVATION
              </button>
              <button 
                type="button"
                disabled={!startDate || !endDate || nights <= 0}
                onClick={sendWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#20bd5a] transition-all active:scale-95 disabled:opacity-50"
              >
                <MessageCircle size={24} fill="white" />
                RÉSERVER SUR WHATSAPP
              </button>
              <p className="text-[11px] text-slate-500 text-center leading-snug">
                La pré-réservation n’est définitive qu’après confirmation YameHome et paiement selon les conditions communiquées.
              </p>
            </>
          )}
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
    const currStr = formatDateLocal(curr);
    
    const isStart = startDate === currStr;
    const isEnd = endDate === currStr;
    const inRange = startDate && endDate && currStr > startDate && currStr < endDate;

    let cls = "h-8 md:h-9 flex items-center justify-center text-xs rounded-lg cursor-pointer transition-all border ";
    if (isPast) cls += "bg-slate-50 text-slate-300 border-transparent cursor-not-allowed ";
    else if (booked) cls += "bg-red-500 text-white font-bold border-red-600 ";
    else if (isStart || isEnd) cls += "bg-accent text-white font-bold border-accent ";
    else if (inRange) cls += "bg-accent/10 text-accent font-bold border-accent/20 ";
    else cls += "bg-white text-slate-600 hover:bg-slate-100 border-slate-100 ";

    days.push(<div key={d} onClick={() => !booked && !isPast && onDateClick(curr)} className={cls}>{d}</div>);
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