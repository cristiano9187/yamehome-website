import React, { useEffect, useRef, useState } from 'react';
import {
  GraduationCap,
  Star,
  KeyRound,
  Smartphone,
  MapPin,
  BadgePercent,
  ShieldCheck,
  ExternalLink,
  Home,
  LucideIcon,
} from 'lucide-react';

/** Fiche Google Maps — Matera (alignée sur App.tsx / LocationSection) */
const GOOGLE_MATERA_REVIEW_URL = 'https://maps.app.goo.gl/Hi81DN2jpjqzdWyz6';

type SocialTile = {
  id: string;
  source: string;
  headline: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
  icon: LucideIcon;
  /** Fond + couleur du trait Lucide (couleurs produits reconnues) */
  iconShellClass: string;
  /** Filet vertical à gauche de la carte */
  stripClass: string;
};

type ValueItem = {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
};

const VALUE_ITEMS: ValueItem[] = [
  {
    icon: ShieldCheck,
    title: 'Énergie & eau fiables',
    description: (
      <>
        Tous nos logements à Yaoundé disposent d’un{' '}
        <strong className="text-primary font-semibold">système anti-délestage</strong> et d’une solution pour{' '}
        <strong className="text-primary font-semibold">l’eau 24h/24</strong>, pour un séjour sans mauvaises surprises.
      </>
    ),
  },
  {
    icon: GraduationCap,
    title: 'Équipe en formation continue',
    description:
      'Notre personnel se forme régulièrement : accueil, qualité de service et standards du métier pour vous recevoir au mieux.',
  },
  {
    icon: Star,
    title: 'Réputation vérifiable',
    description:
      'De bonnes notes et avis sur Booking.com, Airbnb (Superhost) et Google Maps : une crédibilité construite avec nos voyageurs.',
  },
  {
    icon: KeyRound,
    title: 'Arrivée à toute heure',
    description:
      'Accédez à votre logement même tard le soir grâce à des keybox sécurisées — autonomie et tranquillité d’esprit.',
  },
  {
    icon: Smartphone,
    title: 'Service digital & sur mesure',
    description:
      'Reçus numériques, factures pour entreprises, réactivité WhatsApp et écoute attentive des besoins de chaque voyageur.',
  },
  {
    icon: MapPin,
    title: 'Accès facilité',
    description:
      'Implantation proche de l’axe N2 vers l’aéroport de Nsimalen : trajets simples pour arrivées et départs depuis Yaoundé.',
  },
  {
    icon: BadgePercent,
    title: 'Paiements via codes marchands',
    description: (
      <>
        Paiement par <strong className="text-primary font-semibold">codes marchands</strong> :{' '}
        <strong className="text-primary font-semibold">pas de frais de retrait</strong> à votre charge. Les modalités
        précises seront bientôt détaillées avec nos moyens de paiement.
      </>
    ),
  },
];

const SOCIAL_PROOF_TILES: SocialTile[] = [
  {
    id: 'google',
    source: 'Google Maps',
    headline: '4,7 ★',
    detail: '21 avis · Matera YameHome',
    href: GOOGLE_MATERA_REVIEW_URL,
    hrefLabel: 'Voir la fiche',
    icon: MapPin,
    iconShellClass: 'bg-[#EA4335]/14 text-[#EA4335]',
    stripClass: 'bg-gradient-to-b from-[#EA4335] to-[#FBBC04]',
  },
  {
    id: 'booking',
    source: 'Booking.com',
    headline: 'Jusqu’à 9,3 / 10',
    detail: 'Ex. Rieti · 9,3 — Matera · 8,4 (scores invités)',
    icon: Star,
    iconShellClass: 'bg-[#003580]/10 text-[#003580]',
    stripClass: 'bg-gradient-to-b from-[#003580] to-[#0057b8]',
  },
  {
    id: 'airbnb',
    source: 'Airbnb',
    headline: 'Superhost',
    detail: 'Profil et avis sur la plateforme',
    icon: Home,
    iconShellClass: 'bg-[#FF385C]/12 text-[#FF385C]',
    stripClass: 'bg-gradient-to-b from-[#FF385C] to-[#E31C5F]',
  },
];

type YaoundeValuePropsProps = {
  onOpenPaymentInfo?: () => void;
};

function useSectionReveal(): [React.RefObject<HTMLElement | null>, boolean, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    if (mq.matches) {
      setRevealed(true);
      return () => mq.removeEventListener('change', onChange);
    }

    const el = ref.current;
    if (!el) return () => mq.removeEventListener('change', onChange);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    obs.observe(el);
    return () => {
      mq.removeEventListener('change', onChange);
      obs.disconnect();
    };
  }, []);

  return [ref, revealed, reducedMotion];
}

const YaoundeValueProps: React.FC<YaoundeValuePropsProps> = ({ onOpenPaymentInfo }) => {
  const [sectionRef, revealed, reducedMotion] = useSectionReveal();

  return (
    <section
      ref={sectionRef}
      id="avantages-yaounde"
      className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-100/80 bg-gradient-to-b from-white via-slate-50/50 to-cream"
      aria-labelledby="yaounde-value-heading"
    >
      {/* décor atmosphère */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.65]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="pointer-events-none absolute -top-40 -left-24 h-[min(32rem,80vw)] w-[min(32rem,80vw)] rounded-full bg-accent/[0.09] blur-3xl motion-safe:animate-[pulse_7s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-amber-300/[0.12] blur-3xl motion-safe:animate-[pulse_9s_ease-in-out_infinite]"
        style={{ animationDelay: '1.5s' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-slate-300/15 blur-3xl"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-12 sm:mb-16 max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={reducedMotion ? { opacity: 1, transform: 'none' } : undefined}
        >
          <span className="inline-flex items-center gap-2 text-accent uppercase tracking-[0.2em] font-bold text-xs sm:text-sm">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent/60" aria-hidden />
            Yaoundé • Odza
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent/60" aria-hidden />
          </span>
          <h2
            id="yaounde-value-heading"
            className="text-3xl sm:text-4xl md:text-[2.75rem] font-serif font-bold text-primary mt-4 leading-tight"
          >
            Ce qui nous{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-accent via-amber-500 to-amber-600 bg-clip-text text-transparent">
                différencie
              </span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-accent/0 via-accent/70 to-accent/0 motion-safe:animate-[pulse_3s_ease-in-out_infinite]"
                aria-hidden
              />
            </span>
          </h2>
          <p className="mt-6 text-slate-600 text-base sm:text-lg leading-relaxed">
            Confort technique, confiance en ligne et service humain : les avantages qui font du quotidien chez YameHome.
          </p>
        </div>

        {/* Preuve sociale — même esprit « fiche voyage » que Booking, couleurs YameHome */}
        <div
          className={`mb-12 sm:mb-14 max-w-5xl mx-auto transition-all duration-1000 ease-out delay-100 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={reducedMotion ? { opacity: 1, transform: 'none' } : undefined}
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Ils en parlent en ligne
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
            {SOCIAL_PROOF_TILES.map((tile) => {
              const Icon = tile.icon;
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tile.iconShellClass}`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{tile.source}</span>
                    </div>
                  </div>
                  <p className="font-serif text-2xl sm:text-[1.65rem] font-bold text-primary leading-none mb-2">
                    {tile.headline}
                  </p>
                  <p className="text-sm text-slate-600 leading-snug">{tile.detail}</p>
                  {tile.href && tile.hrefLabel && (
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent">
                      {tile.hrefLabel}
                      <ExternalLink className="h-3.5 w-3.5 opacity-80" strokeWidth={2.5} aria-hidden />
                    </span>
                  )}
                </>
              );

              const cardClass =
                'relative flex-1 min-w-0 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm shadow-slate-200/50 text-left transition-all duration-300 hover:border-accent/30 hover:shadow-md hover:shadow-accent/5';

              if (tile.href) {
                return (
                  <a
                    key={tile.id}
                    href={tile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cardClass} group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
                  >
                    <span
                      className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full opacity-90 group-hover:opacity-100 transition-opacity ${tile.stripClass}`}
                      aria-hidden
                    />
                    <div className="pl-3">{inner}</div>
                  </a>
                );
              }

              return (
                <div key={tile.id} className={cardClass}>
                  <span
                    className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${tile.stripClass}`}
                    aria-hidden
                  />
                  <div className="pl-3">{inner}</div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            Les notes et le nombre d’avis évoluent sur chaque plateforme — pensez à vérifier la fiche la plus à jour avant de réserver.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 list-none p-0 m-0">
          {VALUE_ITEMS.map(({ icon: Icon, title, description }, index) => {
            const isPaymentCard = title === 'Paiements via codes marchands';
            const delayMs = reducedMotion ? 0 : index * 85;
            return (
              <li
                key={title}
                className={`group relative rounded-2xl transition-all duration-700 ease-out motion-reduce:transition-none ${
                  revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${delayMs}ms` }}
              >
                <div
                  className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-accent/25 via-accent/5 to-slate-200/40 opacity-0 blur-[1px] transition-opacity duration-500 group-hover:opacity-100 motion-reduce:group-hover:opacity-0"
                  aria-hidden
                />
                <div className="relative h-full rounded-2xl border border-slate-100/90 bg-white/90 backdrop-blur-[2px] p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-500 group-hover:border-accent/25 group-hover:shadow-[0_20px_48px_-12px_rgba(217,119,6,0.14),0_8px_16px_-8px_rgba(15,23,42,0.06)] group-hover:-translate-y-1 motion-reduce:group-hover:translate-y-0 overflow-hidden">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:group-hover:opacity-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-transparent"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/[0.06] transition-transform duration-700 group-hover:scale-150 motion-reduce:group-hover:scale-100"
                    aria-hidden
                  />
                  <div className="relative">
                    <div
                      className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-accent/12 to-amber-500/5 p-[1px] shadow-inner shadow-white/50"
                      aria-hidden
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-[0.9rem] bg-white/80 text-accent transition-all duration-500 group-hover:scale-110 group-hover:text-amber-600 group-hover:shadow-md motion-reduce:group-hover:scale-100">
                        <Icon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-6 motion-reduce:group-hover:rotate-0" strokeWidth={1.75} />
                      </div>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-primary mb-2 pr-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{description}</p>
                    {isPaymentCard && onOpenPaymentInfo && (
                      <button
                        type="button"
                        onClick={onOpenPaymentInfo}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:text-amber-700 transition-colors"
                      >
                        Voir moyens de paiement & conditions
                        <span className="inline-block transition-transform group-hover:translate-x-0.5" aria-hidden>
                          →
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default YaoundeValueProps;
