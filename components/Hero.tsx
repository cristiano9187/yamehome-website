import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          // On utilise l'image locale optimisée
          backgroundImage: 'url("/images/hero-bg.avif")',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-white text-lg md:text-xl font-light tracking-[0.2em] mb-4 uppercase">
          Bienvenue au Cameroun
        </h2>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 leading-tight">
          Votre confort, <br/>
          <span className="text-accent italic">notre priorité.</span>
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
          Découvrez nos appartements meublés, studios et chambres d'hôtes à Yaoundé et Bangangté.
          L'alliance parfaite entre élégance et commodité.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#yaounde" 
            className="px-8 py-3 bg-accent text-white font-medium rounded hover:bg-amber-700 transition-colors shadow-lg"
          >
            Découvrir Yaoundé
          </a>
          <a 
            href="#bangangte" 
            className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white text-white font-medium rounded hover:bg-white hover:text-primary transition-colors"
          >
            Voir Bangangté
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70">
        <ArrowDown size={32} />
      </div>
    </section>
  );
};

export default Hero;