/**
 * Script de génération des pages og:image statiques pour WhatsApp link preview.
 * Exécuter avec : node public/og/gen-og.js
 * (depuis la racine du projet yamehome-website_production)
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://yamehome.com';
const OUT_DIR = path.join(__dirname);

const properties = [
  {
    id: 'rieti-terracotta',
    title: 'Appartement Terracotta',
    siteName: 'RIETI YAMEHOME — Yaoundé',
    description: "Idéal pour rejoindre l'aéroport (15 min). Spacieux, lumineux, cuisine européenne, énergie solaire.",
    image: '/images/terracotta/salon.jpg',
  },
  {
    id: 'rieti-emeraude',
    title: 'Appartement Emeraude',
    siteName: 'RIETI YAMEHOME — Yaoundé',
    description: "Élégance et verdure. Moderne tout confort, à 9km de Nsimalen.",
    image: '/images/emeraude/salon.jpg',
  },
  {
    id: 'modena-haut-standing',
    title: 'Appartement Haut Standing',
    siteName: 'MODENA YAMEHOME — Yaoundé',
    description: "Finitions haut de gamme, autonomie totale eau et électricité, machine à laver.",
    image: '/images/brigade/salon.jpg',
  },
  {
    id: 'matera-deluxe',
    title: 'Appartement Deluxe',
    siteName: 'MATERA YAMEHOME — Yaoundé',
    description: "Grand standing dans un immeuble futuriste. Espaces généreux, anti-délestage, forage.",
    image: '/images/deluxe/salon.jpg',
  },
  {
    id: 'matera-studio',
    title: 'Studio Américain',
    siteName: 'MATERA YAMEHOME — Yaoundé',
    description: "Vaste studio de 60m² au design américain. Backup électrique + forage. Wifi illimité.",
    image: '/images/americain/salon.jpg',
  },
  {
    id: 'matera-studio-superior',
    title: 'Studio Américain Superior',
    siteName: 'MATERA YAMEHOME — Yaoundé',
    description: "Studio 60m², décoration soignée, équipements technologiques complets. Sécurité H24.",
    image: '/images/superior/sejour.jpg',
  },
  {
    id: 'matera-chambre-a',
    title: 'Chambre Standard A',
    siteName: 'MATERA YAMEHOME — Yaoundé',
    description: "Suite hôtelière 22m², lit King Size, frigo, micro-ondes. Anti-délestage.",
    image: '/images/chambrea/vue_lit.jpg',
  },
  {
    id: 'matera-chambre-b',
    title: 'Chambre Standard B',
    siteName: 'MATERA YAMEHOME — Yaoundé',
    description: "Chambre 22m², lit King Size, douche privative. Anti-délestage.",
    image: '/images/chambreb/lit_frigo.jpg',
  },
  {
    id: 'bgt-cuisine',
    title: 'Chambre avec Cuisine',
    siteName: 'GALLAGHERS CITY — Bangangté',
    description: "La seule chambre avec cuisine interne. Idéale pour les longs séjours.",
    image: '/images/bgte/cuisine_chambre.jpg',
  },
  {
    id: 'bgt-standard-a',
    title: 'Chambre Standard A',
    siteName: 'GALLAGHERS CITY — Bangangté',
    description: "Chambre confortable et calme. Douche privée, TV, eau chaude.",
    image: '/images/bgte/chambre_a_chambre.jpg',
  },
  {
    id: 'bgt-standard-b',
    title: 'Chambre Standard B',
    siteName: 'GALLAGHERS CITY — Bangangté',
    description: "Hébergement de qualité au cœur de la résidence. Douche privée, TV.",
    image: '/images/bgte/chambre_b_chambre.jpg',
  },
  {
    id: 'bgt-standard-c',
    title: 'Chambre Standard C',
    siteName: 'GALLAGHERS CITY — Bangangté',
    description: "Simple, propre et sécurisée. Le meilleur rapport qualité/prix.",
    image: '/images/bgte/chambre_c_chambre.jpg',
  },
];

const html = (p) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Open Graph / WhatsApp link preview -->
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="YameHome | Locations Meublées Cameroun" />
  <meta property="og:url"         content="${BASE_URL}/og/${p.id}.html" />
  <meta property="og:title"       content="${p.title} — ${p.siteName}" />
  <meta property="og:description" content="${p.description}" />
  <meta property="og:image"       content="${BASE_URL}${p.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Card (bonus) -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${p.title} — ${p.siteName}" />
  <meta name="twitter:description" content="${p.description}" />
  <meta name="twitter:image"       content="${BASE_URL}${p.image}" />

  <!-- Redirect immédiat vers la galerie SPA -->
  <meta http-equiv="refresh" content="0; url=${BASE_URL}/?property=${p.id}&view=photos" />
  <link rel="canonical" href="${BASE_URL}/?property=${p.id}&view=photos" />

  <title>${p.title} — YameHome</title>
</head>
<body>
  <p style="font-family:sans-serif;padding:2rem;color:#1e293b">
    Chargement de l'album photo <strong>${p.title}</strong>…<br/>
    <a href="${BASE_URL}/?property=${p.id}&view=photos">Cliquez ici si le chargement ne démarre pas.</a>
  </p>
</body>
</html>
`;

let count = 0;
for (const p of properties) {
  const file = path.join(OUT_DIR, `${p.id}.html`);
  fs.writeFileSync(file, html(p), 'utf8');
  console.log(`✓ ${p.id}.html`);
  count++;
}
console.log(`\n${count} fichiers générés dans ${OUT_DIR}`);
