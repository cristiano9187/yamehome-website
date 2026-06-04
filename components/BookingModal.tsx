import React, { useState, useMemo } from 'react';
import { X, Calendar as CalendarIcon, MessageCircle, Info, Loader2, Send, ChevronRight, ChevronLeft, Users, MapPin, Clock, Briefcase, Star } from 'lucide-react';
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

const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
};

const STEP_LABELS = ['Dates', 'Séjour', 'Vous', 'Confirmation'];

const BookingModal: React.FC<BookingModalProps> = ({ property, onClose, initialStartDate, initialEndDate, campaignSource = '', allReservations = [] }) => {
  const [step, setStep] = useState(1);
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
  const [step3Error, setStep3Error] = useState<string | null>(null);

  const reservations = useMemo<LocalReservation[]>(() =>
    allReservations
      .filter(res => res.propertyId === property.id && res.status !== 'cancelled')
      .map(res => ({ start: new Date(res.startDate), end: new Date(res.endDate) })),
    [allReservations, property.id]
  );

  const isBooked = (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return reservations.some(res => {
      const s = new Date(res.start.getFullYear(), res.start.getMonth(), res.start.getDate());
      const e = new Date(res.end.getFullYear(), res.end.getMonth(), res.end.getDate());
      return d >= s && d < e;
    });
  };

  const handleDateClick = (date: Date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    if (date < today || isBooked(date)) return;
    const dateStr = formatDateLocal(date);
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr); setEndDate('');
    } else if (startDate && !endDate) {
      if (dateStr < startDate) { setStartDate(dateStr); }
      else { setEndDate(dateStr); }
    }
  };

  const nights = (startDate && endDate)
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    : 0;
  const rateInfo = getRateForApartment(property.id, nights > 0 ? nights : 1, isStudioMode);
  const unitPrice = rateInfo.prix;
  const caution = rateInfo.caution;
  const total = nights > 0 ? (nights * unitPrice) + caution : 0;

  const getWhatsAppNumber = () => {
    const num = property.location === Location.BANGANGTE ? WHATSAPP_AGENT_BANGANGTE : WHATSAPP_AGENT_YAOUNDE;
    return num.replace(/[^0-9]/g, '');
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

  const handleSubmitProspect = async () => {
    setSubmitError(null);
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
      const err = e as { message?: string };
      setSubmitError(err.message || 'Impossible d\u2019envoyer la demande. R\u00e9essayez ou contactez-nous sur WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const canGoStep2 = !!(startDate && endDate && nights > 0);

  const canGoStep4 = (() => {
    if (!lastName.trim()) return false;
    if (!phone.trim() || phone.replace(/\s/g, '').length < 8) return false;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return false;
    return true;
  })();

  const handleStep3Continue = () => {
    setStep3Error(null);
    if (!lastName.trim()) { setStep3Error('Le nom est obligatoire.'); return; }
    if (!phone.trim() || phone.replace(/\s/g, '').length < 8) { setStep3Error('Indiquez un numéro de téléphone valide.'); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStep3Error('Indiquez une adresse email valide pour recevoir votre confirmation.');
      return;
    }
    setStep(4);
  };

  /* ── Step indicator ── */
  const StepBar = () => (
    <div className="flex items-center justify-center gap-1 px-4 py-3">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <React.Fragment key={n}>
            <div className="flex flex-col items-center gap-0.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${done ? 'bg-accent text-white' : active ? 'bg-accent text-white ring-4 ring-accent/20' : 'bg-slate-100 text-slate-400'}`}>
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : n}
              </div>
              <span className={`text-[9px] font-bold tracking-wide uppercase ${active ? 'text-accent' : done ? 'text-accent/70' : 'text-slate-300'}`}>{label}</span>
            </div>
            {i < 3 && <div className={`h-px flex-1 mb-3 transition-colors ${done ? 'bg-accent' : 'bg-slate-200'}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );

  /* ── Récap mini dates (affiché en haut des étapes 2-4) ── */
  const DateChip = () => (
    <button
      type="button"
      onClick={() => setStep(1)}
      className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-xs font-bold mb-4 hover:bg-accent/20 transition-colors"
    >
      <CalendarIcon size={12} />
      {formatDateDisplay(startDate)} → {formatDateDisplay(endDate)}
      <span className="bg-accent text-white rounded-full px-1.5 py-0.5 text-[10px]">{nights}n</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300 z-10 flex flex-col max-h-[96vh]">

        {/* Header */}
        <div className="px-4 pt-4 pb-0 bg-white">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <div className="bg-accent/10 p-1.5 rounded-xl">
                <CalendarIcon className="text-accent" size={18} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-800 text-base leading-tight">{property.title}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{property.siteName || property.location}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
              <X size={20} />
            </button>
          </div>
          <StepBar />
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto px-4 pb-4 bg-slate-50">

          {/* ═══ ÉTAPE 1 — DATES ═══ */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="mb-4 text-center">
                {!startDate && (
                  <p className="text-sm font-semibold text-slate-700">Choisissez votre <span className="text-accent">date d'arrivée</span></p>
                )}
                {startDate && !endDate && (
                  <p className="text-sm font-semibold text-slate-700">Maintenant votre <span className="text-accent">date de départ</span></p>
                )}
                {startDate && endDate && nights > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{formatDateDisplay(startDate)}</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-sm font-bold text-slate-700">{formatDateDisplay(endDate)}</span>
                    <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-0.5 rounded-full">{nights} nuit{nights > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <MonthGrid
                date={currentMonth}
                isBooked={isBooked}
                startDate={startDate}
                endDate={endDate}
                onDateClick={handleDateClick}
                formatDateLocal={formatDateLocal}
              />
              <div className="flex justify-between mt-3">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="text-xs font-bold text-accent px-2 py-1">‹ Précédent</button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="text-xs font-bold text-accent px-2 py-1">Suivant ›</button>
              </div>

              {/* Saisie manuelle */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Arrivée</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Départ</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none font-medium" />
                </div>
              </div>

              {/* Studio toggle */}
              {property.studioPrice && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100 mt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase">
                    <Info size={14} className="text-accent" /> Mode Studio
                  </div>
                  <button type="button" onClick={() => setIsStudioMode(!isStudioMode)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${isStudioMode ? 'bg-accent' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isStudioMode ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              )}

              {/* Prix preview */}
              {nights > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-700">{nights} nuit{nights > 1 ? 's' : ''}</span> · {unitPrice.toLocaleString('fr-FR')} FCFA/nuit + caution
                  </div>
                  <div className="text-base font-bold text-accent">{total.toLocaleString('fr-FR')} FCFA</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ ÉTAPE 2 — DÉTAILS SÉJOUR ═══ */}
          {step === 2 && (
            <div className="space-y-3">
              <DateChip />
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-4">Informations optionnelles</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users size={16} className="text-accent mt-2.5 shrink-0" />
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre de voyageurs</label>
                      <input type="number" min={1} max={12} value={guestCount} onChange={e => setGuestCount(e.target.value)}
                        placeholder="Ex : 2"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none font-medium" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-accent mt-2.5 shrink-0" />
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ville de provenance</label>
                      <input type="text" value={originCity} onChange={e => setOriginCity(e.target.value)}
                        placeholder="Ex : Douala"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none font-medium" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-accent mt-2.5 shrink-0" />
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Heure d'arrivée estimée</label>
                      <input type="time" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none font-medium" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase size={16} className="text-accent mt-2.5 shrink-0" />
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Motif du séjour</label>
                      <select value={tripPurpose} onChange={e => setTripPurpose(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none font-medium">
                        <option value="">Sélectionner</option>
                        <option value="Affaires">Affaires</option>
                        <option value="Famille">Famille</option>
                        <option value="Tourisme">Tourisme</option>
                        <option value="Études">Études</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star size={16} className="text-accent mt-2.5 shrink-0" />
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Besoin particulier</label>
                      <input type="text" value={specialNeed} onChange={e => setSpecialNeed(e.target.value)}
                        placeholder="Ex : lit bébé, facture"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none font-medium" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ ÉTAPE 3 — COORDONNÉES ═══ */}
          {step === 3 && (
            <div className="space-y-3">
              <DateChip />
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-4">Vos coordonnées</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prénom</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom <span className="text-red-400">*</span></label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        autoComplete="family-name" required
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Téléphone <span className="text-red-400">*</span></label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+237 …" autoComplete="tel" required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Email <span className="text-red-400">*</span>
                      <span className="normal-case font-normal text-slate-400 ml-1">(confirmation envoyée)</span>
                    </label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com" autoComplete="email" required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none" />
                  </div>
                  {step3Error && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{step3Error}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ ÉTAPE 4 — RÉCAPITULATIF ═══ */}
          {step === 4 && !submitSuccess && (
            <div className="space-y-3">
              {/* Récap séjour */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-3">Récapitulatif</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Logement</span>
                    <span className="font-bold text-slate-800 text-right max-w-[60%]">{property.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Arrivée</span>
                    <span className="font-bold text-slate-800">{formatDateDisplay(startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Départ</span>
                    <span className="font-bold text-slate-800">{formatDateDisplay(endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Durée</span>
                    <span className="font-bold text-slate-800">{nights} nuit{nights > 1 ? 's' : ''}</span>
                  </div>
                  {guestCount && <div className="flex justify-between">
                    <span className="text-slate-500">Voyageurs</span>
                    <span className="font-bold text-slate-800">{guestCount}</span>
                  </div>}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{nights} nuit{nights > 1 ? 's' : ''} × {unitPrice.toLocaleString('fr-FR')} FCFA</span>
                    <span>{(nights * unitPrice).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Caution remboursable</span>
                    <span>{caution.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between font-bold text-accent mt-1 pt-1 border-t border-dashed border-slate-100">
                    <span className="text-slate-800 font-serif">TOTAL</span>
                    <span className="text-lg">{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Récap client */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Vos coordonnées</p>
                  <button type="button" onClick={() => setStep(3)} className="text-xs text-accent font-bold hover:underline">Modifier</button>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nom</span>
                    <span className="font-bold text-slate-800">{[firstName, lastName].filter(Boolean).join(' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Téléphone</span>
                    <span className="font-bold text-slate-800">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-bold text-slate-800 text-right max-w-[60%] truncate">{email}</span>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{submitError}</div>
              )}

              {/* CTA */}
              <button type="button" onClick={handleSubmitProspect} disabled={submitting}
                className="w-full flex items-center justify-center gap-3 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-[#b3955f] transition-all active:scale-95 disabled:opacity-60">
                {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                ENVOYER MA PRÉ-RÉSERVATION
              </button>
              <button type="button" onClick={sendWhatsApp} disabled={submitting}
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#20bd5a] transition-all active:scale-95">
                <MessageCircle size={22} fill="white" />
                RÉSERVER SUR WHATSAPP
              </button>
              <p className="text-[11px] text-slate-500 text-center leading-snug">
                La pré-réservation est définitive après paiement de l'acompte (⅓ du total hors caution) selon confirmation YameHome.
              </p>
            </div>
          )}

          {/* ═══ SUCCÈS ═══ */}
          {submitSuccess && (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <svg width="34" height="34" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#dcfce7"/><path d="M7 12.5l3.5 3.5 6-7" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-slate-800 font-serif font-bold text-xl">Demande bien reçue !</p>
              <p className="text-slate-600 text-sm leading-relaxed">Un email de confirmation vous a été envoyé. Nous revenons vers vous rapidement pour confirmer votre pré-réservation.</p>
              <p className="text-slate-400 text-xs italic">A confirmation email has been sent to you.</p>
              <button type="button" onClick={onClose} className="mt-2 px-8 py-3 bg-accent text-white rounded-2xl font-bold text-sm">Fermer</button>
            </div>
          )}

        </div>

        {/* Footer navigation (caché à l'étape 4 et sur succès) */}
        {!submitSuccess && step < 4 && (
          <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-3">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
                <ChevronLeft size={16} /> Retour
              </button>
            ) : (
              <div className="w-20" />
            )}
            <button
              type="button"
              onClick={() => {
                if (step === 3) { handleStep3Continue(); return; }
                setStep(s => s + 1);
              }}
              disabled={step === 1 && !canGoStep2}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-2xl font-bold text-sm hover:bg-[#b3955f] transition-all active:scale-95 disabled:opacity-40">
              {step === 3 ? 'Voir le récapitulatif' : 'Continuer'}
              <ChevronRight size={16} />
            </button>
          </div>
        )}

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
  const today = new Date(); today.setHours(0,0,0,0);

  for (let i = 0; i < offset; i++) days.push(<div key={`e-${i}`} />);

  for (let d = 1; d <= daysInMonth; d++) {
    const curr = new Date(year, month, d);
    const booked = isBooked(curr);
    const isPast = curr < today;
    const currStr = formatDateLocal(curr);
    const isStart = startDate === currStr;
    const isEnd = endDate === currStr;
    const inRange = startDate && endDate && currStr > startDate && currStr < endDate;

    let cls = "h-8 flex items-center justify-center text-xs rounded-lg cursor-pointer transition-all border ";
    if (isPast) cls += "bg-slate-50 text-slate-300 border-transparent cursor-not-allowed ";
    else if (booked) cls += "bg-red-500 text-white font-bold border-red-600 ";
    else if (isStart || isEnd) cls += "bg-accent text-white font-bold border-accent ";
    else if (inRange) cls += "bg-accent/10 text-accent font-bold border-accent/20 ";
    else cls += "bg-white text-slate-600 hover:bg-slate-100 border-slate-100 ";

    days.push(<div key={d} onClick={() => !booked && !isPast && onDateClick(curr)} className={cls}>{d}</div>);
  }

  return (
    <div>
      <h5 className="text-center text-sm font-bold capitalize mb-3 text-slate-700">
        {date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
      </h5>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['L','M','M','J','V','S','D'].map((l, i) => <div key={i} className="text-[10px] font-bold text-slate-300">{l}</div>)}
        {days}
      </div>
    </div>
  );
};

export default BookingModal;
