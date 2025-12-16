import React, { useState } from 'react';
import { MessageCircle, X, User } from 'lucide-react';

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Numéros formatés pour l'affichage et pour le lien API
  const agents = [
    {
      name: 'Yamehome',
      role: 'Service Client',
      numberDisplay: '+237 657 50 76 71',
      numberLink: '237657507671'
    },
    {
      name: 'Edwige',
      role: 'Administration',
      numberDisplay: '+237 656 75 13 10',
      numberLink: '237656751310'
    }
  ];

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* Menu de choix (visible uniquement si ouvert) */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-72 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-serif font-bold text-slate-800">Contactez-nous</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          
          <p className="text-xs text-slate-500 mb-4">
            Choisissez un agent pour discuter instantanément sur WhatsApp :
          </p>

          <div className="space-y-3">
            {agents.map((agent) => (
              <a
                key={agent.name}
                href={`https://wa.me/${agent.numberLink}?text=Bonjour, je souhaite avoir des renseignements sur les logements YameHome.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-100 transition-all group"
              >
                <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <User size={20} />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm group-hover:text-green-700">{agent.name}</div>
                  <div className="text-xs text-slate-500">{agent.role}</div>
                </div>
                <div className="ml-auto">
                  <MessageCircle size={18} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bouton Flottant Principal */}
      <button
        onClick={toggleOpen}
        className={`${isOpen ? 'bg-slate-800' : 'bg-[#25D366]'} text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center`}
        aria-label="Contact WhatsApp"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} fill="white" className="text-white" />
        )}
      </button>
    </div>
  );
};

export default WhatsAppWidget;