import React from 'react';
import { X, CreditCard, Smartphone, Banknote, ShieldCheck, Clock, Info, CheckCircle2, Globe } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
  city?: 'YAOUNDE' | 'BANGANGTE';
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose, city = 'YAOUNDE' }) => {
  // Configuration dynamique des données Mobile Money selon la ville
  const mobileMoneyData = {
    YAOUNDE: {
      orange: "656 75 13 10",
      mtn: "677 59 84 32",
      name: "Nkouayep cheuwa Edwige"
    },
    BANGANGTE: {
      orange: "6 97 44 73 60",
      mtn: "6 81 98 63 54",
      name: "RÉGINE TCHADEU epse TONAG"
    }
  };

  const currentMobile = mobileMoneyData[city];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Overlay pour fermer au clic extérieur */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative animate-in zoom-in-95 duration-300 z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              < ShieldCheck className="text-accent" size={24} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-800 text-xl md:text-2xl leading-none">Conditions & Paiements</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Secteur : {city}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto bg-slate-50 flex-grow">
          
          {/* SECTION A: PAIEMENT */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-1 bg-accent rounded-full"></div>
              <h4 className="text-lg font-bold text-slate-800 uppercase tracking-wide">A. Moyens de paiement & Acompte</h4>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 flex items-start gap-3">
              <Info className="text-accent flex-shrink-0 mt-0.5" size={20} />
              <p className="text-amber-900 text-sm leading-relaxed">
                Les réservations sont confirmées uniquement après le versement d'un acompte d'au moins <strong>1/3 (33%) du montant total</strong> du séjour.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Virement Italie */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Globe size={18} className="text-accent" />
                  <span className="font-bold text-sm uppercase">Virement Bancaire (Italie)</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p><span className="text-slate-400">Banque:</span> <span className="font-bold text-slate-900">INTESA SANPAOLO</span></p>
                  <p><span className="text-slate-400">Titulaire:</span> <span className="font-bold text-slate-900 uppercase">Yamepi Tonag Christian</span></p>
                  <p className="break-all mt-1">
                    <span className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold">IBAN:</span>
                    <span className="font-mono text-sm font-bold text-slate-900 bg-white px-1 border border-slate-200 rounded">IT16R0306912916100000003005</span>
                  </p>
                  <p className="mt-1"><span className="text-slate-400">BIC:</span> <span className="font-mono font-bold text-slate-900">BCITITMMXXX</span></p>
                </div>
              </div>

              {/* Mobile Money Dynamique */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Smartphone size={18} className="text-accent" />
                  <span className="font-bold text-sm uppercase">Mobile Money ({city === 'YAOUNDE' ? 'Yaoundé' : 'Bangangté'})</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-orange-50 border border-orange-100">
                    <span className="text-xs font-bold text-orange-700">Orange Money:</span>
                    <span className="text-base font-mono font-bold text-slate-900">{currentMobile.orange}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-yellow-50 border border-yellow-100">
                    <span className="text-xs font-bold text-yellow-700">MTN Money:</span>
                    <span className="text-base font-mono font-bold text-slate-900">{currentMobile.mtn}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold px-1 uppercase leading-tight">Au nom de : <span className="text-slate-900">{currentMobile.name}</span></p>
                </div>
              </div>

              {/* PayPal & Cash */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <CreditCard size={18} className="text-accent" />
                    <span className="font-bold text-sm uppercase">PayPal</span>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700">Email:</span>
                    <span className="text-sm font-mono font-bold text-slate-900">cyamepi@gmail.com</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <Banknote size={16} className="text-green-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase">Espèces (Cash) acceptées sur place</span>
                </div>
              </div>

              {/* Taux de Change */}
              <div className="bg-slate-800 p-4 rounded-xl text-white shadow-lg flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={18} className="text-accent" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Taux de change fixe</span>
                </div>
                <div className="text-2xl font-serif font-bold text-center py-2 text-white">
                  1€ = <span className="text-accent">655.95</span> FCFA
                </div>
              </div>
            </div>
          </section>

          {/* SECTION B: RÈGLES */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-1 bg-accent rounded-full"></div>
              <h4 className="text-lg font-bold text-slate-800 uppercase tracking-wide">B. Conditions & Règles de vie</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Nouvelle Politique d'Annulation Intégrée */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-accent" /> Politique d'Annulation
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                        L'acompte (1/3 du montant total hors caution) est soumis aux règles suivantes :
                    </p>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 ml-1">
                        <li>
                            <span className="font-semibold text-slate-900">100% remboursé :</span> Si annulation sous 24h après réservation (et séjour dans +14j).
                        </li>
                        <li>
                            <span className="font-semibold text-slate-900">50% remboursé :</span> Si annulation jusqu'à 7 jours avant l'arrivée.
                        </li>
                        <li>
                            <span className="font-semibold text-slate-900">Non remboursable :</span> Si annulation moins de 7 jours avant l'arrivée.
                        </li>
                    </ul>
                </div>
                
                <div className="flex gap-3 px-1">
                  <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600 flex-shrink-0">
                    <Clock size={14} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">Horaires</h5>
                    <p className="text-sm text-slate-600">
                      <strong>Check-in :</strong> à partir de 15h00<br/>
                      <strong>Check-out :</strong> avant 11h30
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 bg-green-100 p-1 rounded text-green-600 flex-shrink-0">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">Règlement intérieur</h5>
                    <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 leading-relaxed">
                      <li>Respect du voisinage exigé.</li>
                      <li>Calme obligatoire entre 22h et 7h.</li>
                      <li>Fêtes et soirées strictement interdites.</li>
                      <li>Logements non-fumeurs à l'intérieur.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-center md:justify-end">
          <button 
            onClick={onClose}
            className="w-full md:w-auto px-10 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg active:scale-95"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;