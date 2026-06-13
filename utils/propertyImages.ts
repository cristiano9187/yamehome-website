import { getISOWeek, getISOWeekYear } from 'date-fns';

const hashString = (value: string): number => {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
  }
  return h >>> 0;
};

const getIsoWeekKey = (date: Date) => {
  const year = getISOWeekYear(date);
  const week = getISOWeek(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

/** Nombre de photos affichées sur la carte (le reste = galerie uniquement). */
export const CARD_PREVIEW_COUNT = 3;

export const rotateImagesWeekly = (images: string[], propertyId: string, now: Date = new Date()) => {
  if (!images.length) return images;
  if (images.length === 1) return images;

  const weekKey = getIsoWeekKey(now);
  const salt = hashString(`${propertyId}|${weekKey}`);
  const start = salt % images.length;
  if (start === 0) return images;

  return [...images.slice(start), ...images.slice(0, start)];
};

/** Aperçu carte : max 3 photos, rotation hebdomadaire. */
export const getCardPreviewImages = (images: string[], propertyId: string) => {
  const preview = images.slice(0, CARD_PREVIEW_COUNT);
  return rotateImagesWeekly(preview, propertyId);
};

/** Précharge discrètement l'image suivante/précédente dans la galerie. */
export const preloadImage = (src: string) => {
  if (!src || typeof window === 'undefined') return;
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
};
