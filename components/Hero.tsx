import React from 'react';
import { ArrowDown } from 'lucide-react';

type HeroProps = {
  children?: React.ReactNode;
};

const Hero: React.FC<HeroProps> = ({ children }) => {
  return (
    <section id="home" className="relative min-h-[100dvh] w-full overflow-x-hidden flex flex-col">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 flex-1 w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mx-auto pt-20 sm:pt-16 md:pt-0 pb-2 md:pb-0 max-md:mt-1">
            <h2 className="text-white text-sm sm:text-base md:text-xl font-light tracking-[0.16em] md:tracking-[0.2em] mb-3 md:mb-4 uppercase">
              Bienvenue au Cameroun
            </h2>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-2 md:mb-6 leading-tight max-md:max-w-[20ch] max-md:mx-auto">
              Votre confort, <br/>
              <span className="text-accent italic">notre priorité.</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-lg md:text-xl font-light md:mb-10 max-w-2xl mx-auto max-md:leading-snug max-md:max-w-md">
              <span className="md:hidden">
                Appartements, studios & chambres d’hôtes à Yaoundé & Bangangté. Élégance & confort.
              </span>
              <span className="hidden md:inline">
                Découvrez nos appartements meublés, studios et chambres d'hôtes à Yaoundé et Bangangté. L'alliance parfaite entre élégance et commodité.
              </span>
            </p>
          </div>
        </div>

        {children && (
          <div className="relative z-20 w-full pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:pt-1">
            {children}
          </div>
        )}
      </div>

      <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70">
        <ArrowDown size={32} />
      </div>
    </section>
  );
};

export default Hero;