import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import PropertyCard from './components/PropertyCard';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import LocationSection from './components/LocationSection';
import YaoundeValueProps from './components/YaoundeValueProps';
import TermsModal from './components/TermsModal';
import LeadTunnelModal from './components/LeadTunnelModal';
import { PROPERTIES } from './constants';
import { Location, Reservation } from './types';
import { subscribeToReservations } from './services/firestoreCalendarService';

const parseUrlDate = (value: string | null): Date | null => {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const App: React.FC = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsCity, setTermsCity] = useState<'YAOUNDE' | 'BANGANGTE'>('YAOUNDE');
  
  // États pour la barre de recherche
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  // États pour les réservations et les appartements
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [filteredApartments, setFilteredApartments] = useState(PROPERTIES);
  const [deepLinkPropertyId, setDeepLinkPropertyId] = useState<string | null>(null);
  const [deepLinkStartDate, setDeepLinkStartDate] = useState<Date | null>(null);
  const [deepLinkEndDate, setDeepLinkEndDate] = useState<Date | null>(null);
  const [deepLinkSource, setDeepLinkSource] = useState('');
  const [showLeadTunnelModal, setShowLeadTunnelModal] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToReservations(
      (reservations) => setAllReservations(reservations),
      (error) => console.error("Erreur lors de la récupération des réservations:", error)
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get('property');
    const fromDate = parseUrlDate(params.get('from'));
    const toDate = parseUrlDate(params.get('to'));
    const source = params.get('src') || '';
    const tunnel = params.get('tunnel');

    if (tunnel === 'lead') {
      setDeepLinkSource(source);
      setShowLeadTunnelModal(true);
      return;
    }

    if (!propertyId) return;

    const targetProperty = PROPERTIES.find(p => p.id === propertyId);
    if (!targetProperty) return;

    setDeepLinkPropertyId(propertyId);
    setDeepLinkStartDate(fromDate);
    setDeepLinkEndDate(toDate);
    setDeepLinkSource(source);

    setDestination(targetProperty.location);
    setFilteredApartments(PROPERTIES.filter(p => p.location === targetProperty.location));
  }, []);

  useEffect(() => {
    if (!searchMessage) return;
    window.requestAnimationFrame(() => {
      document
        .getElementById('search-results-banner')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [searchMessage]);

  useEffect(() => {
    if (!deepLinkPropertyId) return;
    const targetElement = document.getElementById(`property-card-${deepLinkPropertyId}`);
    if (!targetElement) return;
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [deepLinkPropertyId, filteredApartments]);

  const handleSearch = () => {
    console.log('--- DÉBUT RECHERCHE ---');
    console.log('Destination :', destination);
    
    // Normalisation des dates de recherche (on ignore l'heure)
    const searchStart = startDate ? new Date(startDate) : null;
    if (searchStart) searchStart.setHours(0, 0, 0, 0);
    
    const searchEnd = endDate ? new Date(endDate) : null;
    if (searchEnd) searchEnd.setHours(0, 0, 0, 0);

    const startStr = searchStart ? searchStart.toISOString().split('T')[0] : 'N/A';
    const endStr = searchEnd ? searchEnd.toISOString().split('T')[0] : 'N/A';
    console.log(`Période recherchée : ${startStr} au ${endStr}`);

    const filtered = PROPERTIES.filter(apartment => {
      // 1. Condition de ville
      const matchesDestination = destination === '' || apartment.location === destination;
      
      if (!matchesDestination) return false;

      // 2. Condition de disponibilité (si des dates sont sélectionnées)
      if (searchStart && searchEnd) {
        console.log(`\nVérification disponibilité pour : ${apartment.title} (${apartment.id})`);
        
        // On vérifie s'il existe au moins une réservation qui chevauche
        const hasConflict = allReservations.some(reservation => {
          // On ne compare que pour le même logement
          if (reservation.propertyId !== apartment.id) return false;
          
          // On ignore les réservations annulées
          if (reservation.status === 'cancelled') return false;
          
          // Normalisation des dates de réservation
          const resStart = new Date(reservation.startDate);
          resStart.setHours(0, 0, 0, 0);
          
          const resEnd = new Date(reservation.endDate);
          resEnd.setHours(0, 0, 0, 0);

          const resStartStr = resStart.toISOString().split('T')[0];
          const resEndStr = resEnd.toISOString().split('T')[0];
          
          const cond1 = searchStart < resEnd;
          const cond2 = searchEnd > resStart;
          const isOverlap = cond1 && cond2;

          console.log(`  > Réservation ${reservation.id} : ${resStartStr} au ${resEndStr}`);
          console.log(`    - Début recherche < Fin résa (${startStr} < ${resEndStr}) : ${cond1}`);
          console.log(`    - Fin recherche > Début résa (${endStr} > ${resStartStr}) : ${cond2}`);
          console.log(`    - Chevauchement détecté : ${isOverlap}`);
          
          return isOverlap;
        });
        
        if (!hasConflict) {
          console.log(`  => Logement LIBRE`);
        } else {
          console.log(`  => Logement OCCUPÉ`);
        }
        
        return !hasConflict;
      }

      return true;
    });

    setFilteredApartments([...filtered]);

    // Construction du message de recherche
    const dateInfo = (startDate && endDate) 
      ? ` du ${format(startDate, 'dd MMM', { locale: fr })} au ${format(endDate, 'dd MMM', { locale: fr })}`
      : '';
    
    const message = filtered.length > 0 
      ? `${filtered.length} logement(s) trouvé(s) pour ${destination || 'toutes les destinations'}${dateInfo}.`
      : `Désolé, aucun logement n'est disponible à ces dates. Essayez de nous contacter directement sur WhatsApp ou appelez-nous au +237 656 75 13 10`;
    
    setSearchMessage(message);
  };

  const handleClearSearch = () => {
    setDestination('');
    setStartDate(null);
    setEndDate(null);
    setFilteredApartments(PROPERTIES);
    setSearchMessage(null);
  };

  // Dérivation des listes par ville à partir de l'état filtré
  const yaoundeProperties = React.useMemo(() => 
    filteredApartments.filter(p => p.location === Location.YAOUNDE),
    [filteredApartments]
  );
  
  const bangangteProperties = React.useMemo(() => 
    filteredApartments.filter(p => p.location === Location.BANGANGTE),
    [filteredApartments]
  );

  const handleOpenTerms = (city: 'YAOUNDE' | 'BANGANGTE') => {
    setTermsCity(city);
    setShowTermsModal(true);
  };

  // Données des cartes pour Yaoundé
  const yaoundeLocations = [
    {
      name: "Matera YameHome",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.114307983396!2d11.52413898459319!3d3.7852956391024923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bdb0999c028d7%3A0xf33b3a427041f1a6!2sMatera%20YameHome!5e0!3m2!1sfr!2sit!4v1765704885808!5m2!1sfr!2sit",
      gpsUrl: "https://maps.app.goo.gl/Hi81DN2jpjqzdWyz6"
    },
    {
      name: "Rieti YameHome",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.156766230886!2d11.531510275813009!3d3.7760486489775085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bdb76b8d182a1%3A0xd8bf0a20af68e33f!2sRieti%20YameHome!5e0!3m2!1sfr!2sit!4v1765704784726!5m2!1sfr!2sit",
      gpsUrl: "https://maps.app.goo.gl/oVZQKN3hG5VM8RQh7"
    },
    {
      name: "Modena YameHome",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.016803995023!2d11.529200375813076!3d3.8064461487589067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bdb2ff2b64bfb%3A0x5671e3ebcdaa260c!2sModena%20YameHome!5e0!3m2!1sfr!2sit!4v1765704837918!5m2!1sfr!2sit",
      gpsUrl: "https://maps.app.goo.gl/LszP81QSSk9epFDM7"
    }
  ];

  // Données des cartes pour Bangangté
  const bangangteLocations = [
    {
      name: "Gallaghers City",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.740246322862!2d10.536234575813813!3d5.145457937639765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x105ff750e81095c5%3A0xde005adf34f3643a!2sGallaghers%20city%20(%20YameHome%20)!5e0!3m2!1sfr!2sit!4v1765704724447!5m2!1sfr!2sit",
      gpsUrl: "https://maps.app.goo.gl/6eH41FuHpiNr7VC28"
    }
  ];

  return (
    <div className="min-h-screen bg-cream font-sans text-slate-800">
      <Navbar />
      <Hero>
        <SearchBar 
          destination={destination}
          setDestination={setDestination}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onSearch={handleSearch}
        />
        <div className="max-w-5xl mx-auto px-4 relative z-30
          max-md:mt-2 max-md:mb-6
          md:mt-2 md:mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <a
              href="#yaounde"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-accent text-white text-sm sm:text-base font-medium rounded-xl hover:bg-[#b3955f] transition-all shadow-lg active:scale-95 text-center"
            >
              Découvrir Yaoundé
            </a>
            <a
              href="#bangangte"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 text-sm sm:text-base font-medium rounded-xl hover:bg-white transition-all shadow-lg active:scale-95 text-center"
            >
              Voir Bangangté
            </a>
          </div>
        </div>
      </Hero>

      {/* Bandeau de résultats de recherche */}
      {searchMessage && (
        <div
          id="search-results-banner"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 scroll-mt-[5.5rem] md:scroll-mt-24"
        >
          <div className="bg-white border-l-4 border-accent text-primary p-4 rounded-xl shadow-lg flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                {filteredApartments.length > 0 ? '✨' : '📍'}
              </div>
              <p className="font-medium text-slate-700">{searchMessage}</p>
            </div>
            <button 
              onClick={handleClearSearch} 
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-accent"
              title="Effacer la recherche"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {filteredApartments.length === 0 ? (
        <div className="py-20 px-4 text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white p-12 rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-8">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-primary mb-4">Oups !</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Aucun logement disponible pour ces dates sur notre site. 
              Veuillez essayer une autre Recherche ou nous contacter directement sur WhatsApp.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              Modifier ma recherche
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Yaoundé Section */}
          {yaoundeProperties.length > 0 && (
            <>
            {!searchMessage && (
              <YaoundeValueProps onOpenPaymentInfo={() => handleOpenTerms('YAOUNDE')} />
            )}
            <section id="yaounde" className={`px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${searchMessage ? 'pt-12 pb-20' : 'py-20'}`}>
              <div className="text-center mb-16">
                <span className="text-accent uppercase tracking-widest font-bold text-sm">Capitale Politique</span>
                <h2 className="text-4xl font-serif font-bold text-primary mt-2">Nos Logements à Yaoundé</h2>
                <div className="w-24 h-1 bg-accent mx-auto mt-6"></div>
                <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                  Bienvenue à <strong>Odza</strong>. Nos logements sont répartis sur trois sites d'exception : 
                  <br/><span className="font-semibold text-primary">RIETI YAMEHOME</span>, <span className="font-semibold text-primary">MODENA YAMEHOME</span> et <span className="font-semibold text-primary">MATERA YAMEHOME</span>.
                  <br/>Certains de nos grands appartements sont modulables et disponibles en <em>"Mode Studio"</em> pour s'adapter à vos besoins.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {yaoundeProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    searchStartDate={startDate}
                    searchEndDate={endDate}
                    autoOpenBooking={deepLinkPropertyId === property.id}
                    onAutoOpenHandled={() => setDeepLinkPropertyId(null)}
                    prefilledStartDate={deepLinkStartDate}
                    prefilledEndDate={deepLinkEndDate}
                    campaignSource={deepLinkSource}
                    allReservations={allReservations}
                  />
                ))}
              </div>

              {/* --- BANDEAU CTA PAIEMENTS YAOUNDE --- */}
              <div className="mt-16 mb-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-200/50">
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-2">Prêt à réserver votre séjour ?</h3>
                  <p className="text-slate-500 max-w-lg">
                    Consultez nos moyens de paiement sécurisés (OM/MTN, RIB ou PayPal sur demande) et nos conditions pour <strong>Yaoundé</strong>.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenTerms('YAOUNDE')}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all shadow-lg active:scale-95 whitespace-nowrap group"
                >
                  <span className="bg-accent/20 p-1.5 rounded-lg group-hover:bg-accent/40 transition-colors">💳</span>
                  Voir les Moyens de Paiement & Conditions
                </button>
              </div>

              {/* Intégration de la carte Yaoundé */}
              <LocationSection 
                title="Localisation de nos sites à Yaoundé" 
                locations={yaoundeLocations} 
              />
            </section>
            </>
          )}

          {/* Bandeau intermédiaire : masqué après une recherche pour coller aux résultats */}
          {!searchMessage && (
            <section className="bg-primary py-20 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-serif mb-6">Un séjour authentique</h2>
                <p className="text-lg md:text-xl font-light text-slate-300 mb-8">
                  "Que vous soyez en voyage d'affaires à Odza ou en visite à l'Ouest, 
                  YameHome vous garantit un standing international avec la chaleur de l'accueil camerounais."
                </p>
              </div>
            </section>
          )}

          {/* Bangangté Section */}
          {bangangteProperties.length > 0 && (
            <section id="bangangte" className={`px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white ${searchMessage ? 'pt-14 pb-20' : 'py-20'}`}>
              <div className="text-center mb-16">
                <span className="text-accent uppercase tracking-widest font-bold text-sm">Ouest Cameroun</span>
                <h2 className="text-4xl font-serif font-bold text-primary mt-2">Nos Chambres à Bangangté</h2>
                <div className="w-24 h-1 bg-accent mx-auto mt-6"></div>
                <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                  Retrouvez nos 4 chambres au sein de la résidence <strong>Gallaghers City</strong>, 
                  située au lieu-dit <em>'Troisième Mi-temps'</em>. Un cadre idéal pour le repos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {bangangteProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    searchStartDate={startDate}
                    searchEndDate={endDate}
                    autoOpenBooking={deepLinkPropertyId === property.id}
                    onAutoOpenHandled={() => setDeepLinkPropertyId(null)}
                    prefilledStartDate={deepLinkStartDate}
                    prefilledEndDate={deepLinkEndDate}
                    campaignSource={deepLinkSource}
                    allReservations={allReservations}
                  />
                ))}
              </div>

              {/* --- BANDEAU CTA PAIEMENTS BANGANGTE --- */}
              <div className="mt-16 mb-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-inner">
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-2">Prêt à réserver à Bangangté ?</h3>
                  <p className="text-slate-500 max-w-lg">
                    Consultez nos moyens de paiement sécurisés et nos conditions spécifiques pour <strong>Bangangté</strong>.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenTerms('BANGANGTE')}
                  className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-[#b3955f] transition-all shadow-lg active:scale-95 whitespace-nowrap group"
                >
                  <span className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/40 transition-colors">💳</span>
                  Voir les Moyens de Paiement & Conditions
                </button>
              </div>

              {/* Intégration de la carte Bangangté */}
              <LocationSection 
                title="Localisation à Bangangté" 
                locations={bangangteLocations} 
              />
            </section>
          )}
        </>
      )}

      <Footer />
      
      {/* Modale des conditions accessible au niveau global avec prop city */}
      {showTermsModal && <TermsModal city={termsCity} onClose={() => setShowTermsModal(false)} />}

      {showLeadTunnelModal && (
        <LeadTunnelModal
          campaignSource={deepLinkSource}
          onClose={() => setShowLeadTunnelModal(false)}
        />
      )}
      
      <WhatsAppWidget />
    </div>
  );
};

export default App;