import React, { useCallback, useEffect, useRef, useState } from 'react';
import { preloadImage } from '../utils/propertyImages';
import { getYoutubeEmbedUrl } from '../utils/youtube';
import { X, ChevronLeft, ChevronRight, ExternalLink, ZoomIn, ZoomOut, Play, Images } from 'lucide-react';

interface PropertyPhotoGalleryProps {
  images: string[];
  title: string;
  initialIndex?: number;
  initialView?: 'photos' | 'video';
  driveFolderUrl?: string;
  youtubeVideoUrl?: string;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 48;

const PropertyPhotoGallery: React.FC<PropertyPhotoGalleryProps> = ({
  images,
  title,
  initialIndex = 0,
  initialView = 'photos',
  driveFolderUrl,
  youtubeVideoUrl,
  onClose,
}) => {
  const [index, setIndex] = useState(initialIndex);
  const [view, setView] = useState<'photos' | 'video'>(initialView);
  const embedUrl = youtubeVideoUrl ? getYoutubeEmbedUrl(youtubeVideoUrl) : null;
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampIndex = useCallback(
    (i: number) => Math.max(0, Math.min(images.length - 1, i)),
    [images.length]
  );

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => clampIndex(i - 1));
    resetZoom();
  }, [clampIndex, resetZoom]);

  const goNext = useCallback(() => {
    setIndex((i) => clampIndex(i + 1));
    resetZoom();
  }, [clampIndex, resetZoom]);

  useEffect(() => {
    setIndex(clampIndex(initialIndex));
    setView(initialView);
    resetZoom();
  }, [initialIndex, initialView, clampIndex, resetZoom]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (view !== 'photos' || scale !== 1) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose, scale, view]);

  useEffect(() => {
    if (images[index + 1]) preloadImage(images[index + 1]);
    if (images[index - 1]) preloadImage(images[index - 1]);
  }, [images, index]);

  const getTouchDistance = (touches: React.TouchList) => {
    const [a, b] = [touches[0], touches[1]];
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStart.current = { distance: getTouchDistance(e.touches), scale };
      touchStart.current = null;
      return;
    }
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if (scale > 1) {
        dragStart.current = { x: t.clientX, y: t.clientY, ox: offset.x, oy: offset.y };
        setDragging(true);
      } else {
        touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current) {
      const distance = getTouchDistance(e.touches);
      const ratio = distance / pinchStart.current.distance;
      const next = Math.min(4, Math.max(1, pinchStart.current.scale * ratio));
      setScale(next);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return;
    }
    if (scale > 1 && dragStart.current && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = t.clientX - dragStart.current.x;
      const dy = t.clientY - dragStart.current.y;
      setOffset({
        x: dragStart.current.ox + dx,
        y: dragStart.current.oy + dy,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    pinchStart.current = null;
    dragStart.current = null;
    setDragging(false);

    if (scale > 1 || !touchStart.current || e.changedTouches.length !== 1) {
      touchStart.current = null;
      return;
    }

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const elapsed = Date.now() - touchStart.current.time;
    touchStart.current = null;

    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) && elapsed < 600) {
      if (dx < 0) goNext();
      else goPrev();
      return;
    }

    if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && elapsed < 300) {
      if (scale === 1) setScale(2.2);
      else resetZoom();
    }
  };

  const toggleZoom = () => {
    if (scale > 1) resetZoom();
    else setScale(2.2);
  };

  if (!images.length && !embedUrl) return null;

  const showPhotos = view === 'photos' && images.length > 0;

  return (
    <div
      className="fixed inset-0 z-[140] bg-black text-white flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Photos — ${title}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="min-w-0 pr-3">
          <p className="text-sm font-bold truncate">{title}</p>
          <p className="text-xs text-white/70">
            {showPhotos
              ? `${index + 1} / ${images.length}${scale > 1 ? ' · Zoom actif' : ' · Glissez · Pincez pour zoomer'}`
              : 'Visite vidéo du logement'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
          aria-label="Fermer"
        >
          <X size={22} />
        </button>
      </div>

      {/* Image / video area */}
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden touch-none select-none"
        onTouchStart={showPhotos ? handleTouchStart : undefined}
        onTouchMove={showPhotos ? handleTouchMove : undefined}
        onTouchEnd={showPhotos ? handleTouchEnd : undefined}
        onDoubleClick={showPhotos ? toggleZoom : undefined}
      >
        {showPhotos && index > 0 && scale === 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="hidden sm:flex absolute left-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Photo précédente"
          >
            <ChevronLeft size={28} />
          </button>
        )}
        {showPhotos && index < images.length - 1 && scale === 1 && (
          <button
            type="button"
            onClick={goNext}
            className="hidden sm:flex absolute right-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Photo suivante"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {showPhotos ? (
          <img
            key={images[index]}
            src={images[index]}
            alt={`${title} — photo ${index + 1}`}
            decoding="async"
            className={`max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-75 ${dragging ? '' : 'duration-200'}`}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: 'center center',
            }}
            draggable={false}
          />
        ) : embedUrl ? (
          <div className="w-full max-w-4xl px-4 aspect-video">
            <iframe
              src={embedUrl}
              title={`Visite vidéo — ${title}`}
              className="w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black/90 to-transparent z-20 space-y-3">
        {/* Thumbnails */}
        {showPhotos && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => {
                  setIndex(i);
                  resetZoom();
                }}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === index ? 'border-white opacity-100' : 'border-transparent opacity-50'
                }`}
              >
                <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          {showPhotos ? (
            <button
              type="button"
              onClick={toggleZoom}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-xs font-bold active:scale-95"
            >
              {scale > 1 ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
              {scale > 1 ? 'Réduire' : 'Zoomer'}
            </button>
          ) : embedUrl && images.length > 0 ? (
            <button
              type="button"
              onClick={() => setView('photos')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-xs font-bold active:scale-95"
            >
              <Images size={16} />
              Voir les photos
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2 ml-auto">
            {embedUrl && showPhotos && (
              <button
                type="button"
                onClick={() => {
                  setView('video');
                  resetZoom();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-bold active:scale-95"
              >
                <Play size={14} fill="currentColor" />
                Visite vidéo
              </button>
            )}
            {driveFolderUrl && (
              <a
                href={driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent text-white text-xs font-bold active:scale-95"
              >
                <ExternalLink size={14} />
                Album complet
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPhotoGallery;
