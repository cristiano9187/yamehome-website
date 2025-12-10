import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import Footer from './components/Footer';
import { PROPERTIES } from './constants';
import { Location } from './types';

const App: React.FC = () => {
  const yaoundeProperties = PROPERTIES.filter(p => p.location === Location.YAOUNDE);
  const bangangteProperties = PROPERTIES.filter(p => p.location === Location.BANGANGTE);

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
      </section>

      <Footer />
    </div>
  );
};

export default App;