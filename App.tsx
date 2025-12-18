import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import LocationSection from './components/LocationSection';
import TermsModal from './components/TermsModal';
import { PROPERTIES } from './constants';
import { Location } from './types';

const App: React.FC = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsCity, setTermsCity] = useState<'YAOUNDE' | 'BANGANGTE'>('YAOUNDE');
  
  const yaoundeProperties = PROPERTIES.filter(p => p.location === Location.YAOUNDE);
  const bangangteProperties = PROPERTIES.filter(p => p.location === Location.BANGANGTE);

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
      <Hero />

      {/* Yaoundé Section */}
      <section id="yaounde" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* --- BANDEAU CTA PAIEMENTS YAOUNDE --- */}
        <div className="mt-16 mb-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-200/50">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-2">Prêt à réserver votre séjour ?</h3>
            <p className="text-slate-500 max-w-lg">
              Consultez nos moyens de paiement sécurisés (OM/MTN, Virement, PayPal) et nos conditions pour <strong>Yaoundé</strong>.
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

      {/* Divider / Feature Section */}
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

      {/* Bangangté Section */}
      <section id="bangangte" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
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
            <PropertyCard key={property.id} property={property} />
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
            className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg active:scale-95 whitespace-nowrap group"
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

      <Footer />
      
      {/* Modale des conditions accessible au niveau global avec prop city */}
      {showTermsModal && <TermsModal city={termsCity} onClose={() => setShowTermsModal(false)} />}
      
      <WhatsAppWidget />
    </div>
  );
};

export default App;