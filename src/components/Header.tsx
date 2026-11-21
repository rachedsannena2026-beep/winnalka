import { Heart, Moon, Sun } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  requestsCount: number;
  favoritesCount: number;
  isDark: boolean;
  onToggleDarkMode: () => void;
  onOpenRequests: () => void;
  onOpenFavorites: () => void;
  onJumpToAddService: () => void;
}

export function Header({
  requestsCount,
  favoritesCount,
  isDark,
  onToggleDarkMode,
  onOpenRequests,
  onOpenFavorites,
  onJumpToAddService,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 dark:bg-[#0B1426]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2.5 sm:gap-8">
        {/* Zone 1: Single-line Brand Logo + Wordmark */}
        <a
          href="#top"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-md whitespace-nowrap shrink-0"
        >
          <BrandLogo />
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <a
            href="#directory"
            className="hover:text-[#0F2547] dark:hover:text-white hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            الخدمات
          </a>
          <a
            href="#categories"
            className="hover:text-[#0F2547] dark:hover:text-white hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            التصنيفات
          </a>
          <a
            href="#payment"
            className="hover:text-[#0F2547] dark:hover:text-white hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            الخلاص
          </a>
          <button
            type="button"
            onClick={onOpenFavorites}
            className="inline-flex items-center gap-1.5 hover:text-[#0F2547] dark:hover:text-white hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            <Heart
              className={`w-4 h-4 shrink-0 ${
                favoritesCount > 0
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-slate-400'
              }`}
              aria-hidden="true"
            />
            <span>المفضلة</span>
            {favoritesCount > 0 && (
              <span className="text-rose-600 dark:text-rose-400 font-semibold tabular-nums">
                ({favoritesCount})
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onOpenRequests}
            className="hover:text-[#0F2547] dark:hover:text-white hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            طلباتي
            {requestsCount > 0 && (
              <span className="mr-1.5 text-[#0F766E] dark:text-[#2DD4BF] font-semibold tabular-nums">
                ({requestsCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Mobile utility triggers, Dark Mode Toggle & Primary action */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenFavorites}
            aria-label={`المفضلة (${favoritesCount})`}
            className="md:hidden inline-flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0F2547] dark:hover:text-white px-2 py-2 min-h-[40px] whitespace-nowrap shrink-0 cursor-pointer rounded-lg"
          >
            <Heart
              className={`w-4 h-4 shrink-0 ${
                favoritesCount > 0
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-hidden="true"
            />
            {favoritesCount > 0 && (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenRequests}
            className="md:hidden text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0F2547] dark:hover:text-white px-2 py-2 min-h-[40px] whitespace-nowrap shrink-0 cursor-pointer"
          >
            طلباتي{requestsCount > 0 ? ` (${requestsCount})` : ''}
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-pressed={isDark}
            aria-label={isDark ? 'رجّع للوضع النهاري' : 'بدّل للوضع الليلي'}
            title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-[#111C30] text-slate-700 dark:text-amber-300 hover:border-[#0D9488] dark:hover:border-[#2DD4BF] hover:text-[#0F2547] dark:hover:text-amber-200 shadow-2xs transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            {isDark ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onJumpToAddService}
            className="px-3.5 sm:px-4 py-2 min-h-[40px] text-sm font-semibold text-white bg-[#0F2547] dark:bg-[#0F766E] rounded-lg hover:bg-[#173666] dark:hover:bg-[#0D9488] active:scale-[0.99] shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
          >
            زيد خدمتك
          </button>
        </div>
      </div>
    </header>
  );
}
