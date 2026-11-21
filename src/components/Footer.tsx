import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B1426] border-t border-slate-200/80 dark:border-slate-800 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <a href="#top" className="inline-block">
            <BrandLogo />
          </a>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            منصة موحدة باش تلقى الخدمات الموثوقة في ولاية صفاقس وتحجزها بكل
            وضوح.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
          <a
            href="#directory"
            className="hover:text-[#0F2547] dark:hover:text-white transition-colors whitespace-nowrap"
          >
            دليل الخدمات
          </a>
          <a
            href="#faq"
            className="hover:text-[#0F2547] dark:hover:text-white transition-colors whitespace-nowrap"
          >
            الأسئلة الشائعة
          </a>
          <a
            href="#payment"
            className="hover:text-[#0F2547] dark:hover:text-white transition-colors whitespace-nowrap"
          >
            طرق الخلاص
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#0F2547] dark:hover:text-white transition-colors whitespace-nowrap"
          >
            كيفاش تخدم
          </a>
          <a
            href="#add-service"
            className="hover:text-[#0F2547] dark:hover:text-white transition-colors whitespace-nowrap"
          >
            زيد خدمتك
          </a>
          <a
            href="mailto:contact@winnal9a.tn"
            dir="ltr"
            className="hover:text-[#0F766E] dark:hover:text-[#2DD4BF] transition-colors whitespace-nowrap"
          >
            contact@winnal9a.tn
          </a>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
        <span>© 2026 winnal9a. الحقوق الكل محفوظة.</span>
        <span>أسوام واضحة وحجز ديركت مع الحرفيين والمختصين في صفاقس.</span>
      </div>
    </footer>
  );
}
