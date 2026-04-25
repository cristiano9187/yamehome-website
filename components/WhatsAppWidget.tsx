import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Numéros formatés pour l'affichage et pour le lien API
  const agents = [
    {
      name: 'Paola',
      role: 'Service Client',
      numberDisplay: '+237 657 50 76 71',
      numberLink: '237657507671',
      photoUrl: '/images/team/paola.png',
      statusLabel: 'En ligne 24h/24'
    },
    {
      name: 'Edwige',
      role: 'Administration',
      numberDisplay: '+237 656 75 13 10',
      numberLink: '237656751310',
      photoUrl: '/images/team/edwige.png'
    }
  ];

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="hidden sm:flex items-center rounded-full bg-white/95 text-slate-700 border border-slate-200 shadow-md px-3 py-1.5 text-xs font-semibold hover:bg-white transition-colors"
          aria-label="Ouvrir le chat WhatsApp avec nos collaboratrices"
        >
          Discuter avec Edwige ou Paola
        </button>
      )}

      {/* Menu de choix (visible uniquement si ouvert) */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-80 max-w-[calc(100vw-2.5rem)] mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-serif font-bold text-slate-800">Parlez a notre equipe</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Choisissez votre interlocutrice et obtenez une reponse rapide pour disponibilites, prix et reservation.
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
                <img
                  src={agent.photoUrl}
                  alt={agent.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 mr-3"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 text-sm group-hover:text-green-700">{agent.name}</div>
                  {agent.statusLabel && (
                    <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {agent.statusLabel}
                    </div>
                  )}
                  <div className="text-xs text-slate-500">{agent.role}</div>
                  <div className="text-[11px] text-slate-400">{agent.numberDisplay}</div>
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