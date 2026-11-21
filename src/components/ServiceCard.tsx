import { Clock, Heart, Share2, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';
import { ServiceItem } from '../types/service';
import {
  buildFacebookShareUrl,
  buildTwitterShareUrl,
  buildWhatsAppShareUrl,
} from '../utils/share';
import { CategoryIcon } from './CategoryIcon';

interface ServiceCardProps {
  service: ServiceItem;
  isFavorite: boolean;
  onToggleFavorite: (serviceId: string) => void;
  onSelect: (service: ServiceItem) => void;
}

export function ServiceCard({
  service,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: ServiceCardProps) {
  const [imgError, setImgError] = useState(false);
  const roundedStars = Math.round(service.rating);

  return (
    <article className="group card-premium rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5">
      <div>
        {/* 4:3 Media Header */}
        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800">
          {!imgError ? (
            <img
              src={service.imageUrl}
              alt={service.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-teal-50/40 dark:from-[#111C30] dark:to-[#0B1426] flex flex-col items-center justify-center p-4 text-center gap-2">
              <CategoryIcon
                category={service.category}
                className="w-8 h-8 text-[#0F2547] dark:text-[#2DD4BF]"
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {service.categoryLabel}
              </span>
            </div>
          )}

          {/* Add to Favorites Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(service.id);
            }}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'نحّي من المفضلة' : 'إضافة للمفضلة'}
            title={isFavorite ? 'نحّي من المفضلة' : 'إضافة للمفضلة'}
            className={`absolute top-3 left-3 z-10 w-10 h-10 flex items-center justify-center rounded-xl border shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
              isFavorite
                ? 'bg-white/95 dark:bg-[#111C30]/95 border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60'
                : 'bg-white/90 dark:bg-[#111C30]/85 backdrop-blur-xs border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 hover:bg-white dark:hover:bg-[#111C30]'
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500 scale-105'
                  : 'fill-transparent'
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Unboxed Metadata Kicker (Zero-Pill Rule) */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
              <CategoryIcon
                category={service.category}
                className="w-3.5 h-3.5 shrink-0"
              />
              <span>{service.categoryLabel}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{service.city}</span>
            <span aria-hidden="true">·</span>
            <span>{service.availability}</span>
          </div>

          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white leading-snug">
            <button
              type="button"
              onClick={() => onSelect(service)}
              className="text-right hover:text-[#0F766E] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
            >
              {service.title}
            </button>
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>

      {/* Footer Info, Average Rating & Action */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 min-w-0">
            {service.verified && (
              <ShieldCheck
                className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0"
                aria-label="مزود موثق"
              />
            )}
            <span className="truncate font-medium text-slate-800 dark:text-slate-200">
              {service.providerName}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{service.responseTime}</span>
          </span>
        </div>

        {/* Dedicated Average Rating Row */}
        <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1426]/80 border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-0.5"
              aria-label={`معدل التقييم ${service.rating.toFixed(1)} من 5`}
            >
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <Star
                  key={starIndex}
                  className={`w-3.5 h-3.5 ${
                    starIndex <= roundedStars
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#0F172A] dark:text-white tabular-nums">
              {service.rating.toFixed(1)}
            </span>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            معدل التقييم ({service.reviewCount})
          </span>
        </div>

        {/* Social Share Bar (WhatsApp, Facebook, X) */}
        <div className="flex items-center justify-between gap-2 flex-wrap py-2 px-3 rounded-xl bg-[#F8FAFC]/85 dark:bg-[#0B1426]/80 border border-slate-200/70 dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <Share2 className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" aria-hidden="true" />
            <span>شاركها:</span>
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            <a
              href={buildWhatsAppShareUrl(service)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`مشاركة ${service.title} على واتساب`}
              title="مشاركة على واتساب"
              className="px-2.5 py-1.5 min-h-[34px] text-[11px] font-semibold rounded-lg border border-emerald-200/90 dark:border-emerald-500/35 bg-white dark:bg-[#111C30] text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:-translate-y-0.5 shadow-2xs transition-all inline-flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current shrink-0"
                aria-hidden="true"
              >
                <path d="M12.04 2a9.9 9.9 0 0 0-8.52 14.95L2 22l5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm5.78 14.03c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.13.1-1.82-.12-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.37-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.29.58-.36.77-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .9 2.14.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.3.38-.43.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.29.39-.24.66-.14.27.1 1.71.8 2 .95.29.15.48.22.55.34.07.12.07.7-.17 1.38Z" />
              </svg>
              <span>واتساب</span>
            </a>

            <a
              href={buildFacebookShareUrl(service)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`مشاركة ${service.title} على فايسبوك`}
              title="مشاركة على فايسبوك"
              className="px-2.5 py-1.5 min-h-[34px] text-[11px] font-semibold rounded-lg border border-blue-200/90 dark:border-blue-500/35 bg-white dark:bg-[#111C30] text-blue-700 dark:text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 shadow-2xs transition-all inline-flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current shrink-0"
                aria-hidden="true"
              >
                <path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14c-.3-.04-1.3-.14-2.48-.14-2.45 0-4.13 1.5-4.13 4.24v2.36H7.4v3.2h2.78V21h3.32Z" />
              </svg>
              <span>فايسبوك</span>
            </a>

            <a
              href={buildTwitterShareUrl(service)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`مشاركة ${service.title} على X`}
              title="مشاركة على تويتر / X"
              className="px-2.5 py-1.5 min-h-[34px] text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111C30] text-slate-800 dark:text-slate-200 hover:bg-[#0F172A] dark:hover:bg-white hover:text-white dark:hover:text-[#0F172A] hover:border-[#0F172A] dark:hover:border-white hover:-translate-y-0.5 shadow-2xs transition-all inline-flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 fill-current shrink-0"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
              </svg>
              <span>X</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="tabular-nums">
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              يبدأ من
            </span>
            <span className="text-base font-bold text-[#0F172A] dark:text-white">
              {service.priceFrom} {service.priceUnit}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(service)}
            className="px-4 py-2.5 min-h-[42px] text-sm font-semibold text-[#0F2547] dark:text-slate-100 bg-slate-100 dark:bg-[#1A2B49] hover:bg-[#0F2547] dark:hover:bg-[#0F766E] hover:text-white rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            التفاصيل والحجز
          </button>
        </div>
      </div>
    </article>
  );
}
