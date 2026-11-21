import { ChevronLeft, Megaphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AnnouncementItem {
  id: string;
  tag: string;
  text: string;
  ctaLabel: string;
  href: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'promo-sfax-1',
    tag: 'عرض خاص',
    text: 'تخفيض 15% على أول طلب تصليح ضو ولا بلومبي في ولاية صفاقس هالجمعة',
    ctaLabel: 'شوف الخدمات',
    href: '#directory',
  },
  {
    id: 'news-payment-2',
    tag: 'جديد المنصة',
    text: 'الخلاص بالـ D17 و Flouci والكارطة البنكية ولّى حاضر بلاش عمولة على الحريف',
    ctaLabel: 'جرّب الخلاص',
    href: '#payment',
  },
  {
    id: 'promo-moving-3',
    tag: 'عرض الويكاند',
    text: 'نقل دبش في ساقية الزيت، قرمدة والعين مع تغليف مجاني للحوايج الحساسة',
    ctaLabel: 'احجز توا',
    href: '#directory',
  },
  {
    id: 'news-providers-4',
    tag: 'للحرفيين',
    text: 'عندك خدمة ولا ورشة في صفاقس؟ زيدها في دليل winnal9a مجاناً في دقيقتين',
    ctaLabel: 'زيد خدمتك',
    href: '#add-service',
  },
];

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [isVisible, isPaused]);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[activeIndex];

  return (
    <div
      role="region"
      aria-label="أخبار وعروض المنصة"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="bg-[#0F2547] text-white border-b border-[#1E3A5F]/80 h-10 flex items-center"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Animated Announcement Content */}
        <div
          key={current.id}
          className="flex-1 min-w-0 flex items-center justify-center sm:justify-start gap-2.5 text-xs sm:text-[13px] animate-banner-slide"
        >
          <Megaphone
            className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0"
            aria-hidden="true"
          />
          <span className="font-bold text-[#2DD4BF] shrink-0">
            {current.tag}
          </span>
          <span aria-hidden="true" className="text-slate-500 shrink-0">
            ·
          </span>
          <span className="truncate text-slate-100 font-medium">
            {current.text}
          </span>
          <a
            href={current.href}
            className="hidden sm:inline-flex items-center gap-0.5 font-semibold text-[#2DD4BF] hover:text-white underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 mr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] rounded"
          >
            <span>{current.ctaLabel}</span>
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Manual Next / Step Indicator & Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1" aria-label="تبديل الإعلانات">
            {ANNOUNCEMENTS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                aria-label={`الإعلان رقم ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex
                    ? 'w-4 bg-[#2DD4BF]'
                    : 'w-1.5 bg-slate-500/70 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="سكّر شريط التنبيهات"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
