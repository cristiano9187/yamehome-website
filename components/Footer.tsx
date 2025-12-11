import React from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE_YAOUNDE, CONTACT_PHONE_BANGANGTE, HEADQUARTERS_ADDRESS } from '../constants';
import { Mail, Phone, Instagram, Facebook, MapPin, Building2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">YAME<span className="text-accent">HOME</span></h3>
            <p className="text-slate-400 leading-relaxed max-w-xs">
              Votre partenaire de confiance pour des séjours inoubliables au Cameroun. 
              Confort, sécurité et hospitalité à Yaoundé et Bangangté.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-slate-700 pb-2 inline-block">Contactez-nous</h4>
            <ul className="space-y-4">
              <li className="flex items-start text-slate-300">
                <Phone className="mr-3 text-accent mt-1 flex-shrink-0" size={20} />
                <div className="flex flex-col">
                  <a href={`tel:${CONTACT_PHONE_YAOUNDE.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                    <span className="text-slate-500 text-xs uppercase mr-2 font-bold">Yaoundé:</span>
                    {CONTACT_PHONE_YAOUNDE}
                  </a>
                  <a href={`tel:${CONTACT_PHONE_BANGANGTE.replace(/\s/g, '')}`} className="hover:text-white transition-colors mt-1">
                    <span className="text-slate-500 text-xs uppercase mr-2 font-bold">Bangangté:</span>
                    {CONTACT_PHONE_BANGANGTE}
                  </a>
                </div>
              </li>
              
              <li className="flex items-center text-slate-300">
                <Mail className="mr-3 text-accent flex-shrink-0" size={20} />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors break-all">{CONTACT_EMAIL}</a>
              </li>
              
              <li className="flex items-start text-slate-300">
                <Building2 className="mr-3 text-accent mt-1 flex-shrink-0" size={20} />
                <div>
                  <span className="block text-white font-medium text-xs uppercase mb-0.5">Siège Social</span>
                  <span>{HEADQUARTERS_ADDRESS}</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-slate-700 pb-2 inline-block">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/yamehomecameroon" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-slate-700 p-3 rounded-full hover:bg-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/yamehome/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-slate-700 p-3 rounded-full hover:bg-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
            <p className="mt-6 text-slate-400 text-sm">
              Inscrivez-vous pour recevoir nos offres spéciales.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} YameHome. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Mentions Légales</a>
            <a href="#" className="hover:text-white">Politique de Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;