import {
  CalendarCheck,
  CheckCircle2,
  Scale,
  Search,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
  CATEGORY_IMAGES,
  CATEGORY_OPTIONS,
  SFAX_AREAS,
} from '../data/services';
import { ServiceCategory, ServiceItem } from '../types/service';

interface AddServiceSectionProps {
  onAddService: (newService: ServiceItem) => void;
}

export function AddServiceSection({ onAddService }: AddServiceSectionProps) {
  const [title, setTitle] = useState('');
  const [providerName, setProviderName] = useState('');
  const [category, setCategory] =
    useState<Exclude<ServiceCategory, 'all'>>('maintenance');
  const [city, setCity] = useState('صفاقس المدينة');
  const [priceFrom, setPriceFrom] = useState('50');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [publishedTitle, setPublishedTitle] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedPrice = Number(priceFrom);
    if (title.trim().length < 5) {
      setErrorMsg('عافاك اكتب عنوان واضح للخدمة (5 حروف على الأقل).');
      return;
    }
    if (providerName.trim().length < 2) {
      setErrorMsg('عافاك اكتب اسمك ولا اسم الورشة متاعك.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('عافاك حط سوم ابتدائي صحيح أكبر من صفر.');
      return;
    }
    if (description.trim().length < 15) {
      setErrorMsg('عافاك زيد وصف واضح للخدمة (15 حرف على الأقل).');
      return;
    }

    const categoryMeta = CATEGORY_OPTIONS.find((c) => c.id === category);

    const created: ServiceItem = {
      id: `srv-custom-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: categoryMeta ? categoryMeta.label : 'خدمات عامة',
      providerName: providerName.trim(),
      city,
      priceFrom: parsedPrice,
      priceUnit: 'د.ت',
      responseTime: 'في ساعة',
      responseMinutes: 60,
      availability: 'متوفر اليوم',
      rating: 5.0,
      reviewCount: 1,
      description: description.trim(),
      deliverables: [
        'تواصل ديركت باش تتفاهمو على تفاصيل الخدمة',
        'سوم واضح ومتفق عليه قبل ما تبدأ الخدمة',
        'التزام بالوقت وجودة في الخدمة',
      ],
      imageUrl: CATEGORY_IMAGES[category],
      verified: true,
      reviews: [],
    };

    onAddService(created);
    setPublishedTitle(created.title);
    setTitle('');
    setProviderName('');
    setPriceFrom('50');
    setDescription('');
  };

  return (
    <section
      id="how-it-works"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Editorial Numbered Steps with Structured Icon Frames */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
              مراحل واضحة وساهلة
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
              كيفاش تستعمل winnal9a؟
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              عملنالك المنصة باش تنقص عليك التلويج وتوصلك ديركت للشخص الصحيح
              في صفاقس بسوم واضح.
            </p>
          </div>

          <div className="divide-y divide-slate-200/80 dark:divide-slate-800 card-premium rounded-2xl px-6">
            <div className="py-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F2547] dark:text-[#2DD4BF] shrink-0 mt-0.5">
                <Search className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#0F172A] dark:text-white">
                  01. لوّج حسب حاجتك وجهتك
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  اختار التصنيف ولا اكتب الخدمة اللي تلوج عليها، وحدّد جهتك في
                  ولاية صفاقس باش تلقى الأقرب ليك.
                </p>
              </div>
            </div>

            <div className="py-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F766E] dark:text-[#2DD4BF] shrink-0 mt-0.5">
                <Scale className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#0F172A] dark:text-white">
                  02. قارن التقييمات والأسوام
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  شوف شنوة تشمل الخدمة، قداش يبطى في الرد، وآراء الناس اللي
                  جرّبوه قبلك قبل ما تطلب.
                </p>
              </div>
            </div>

            <div className="py-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F2547] dark:text-[#2DD4BF] shrink-0 mt-0.5">
                <CalendarCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#0F172A] dark:text-white">
                  03. احجز موعدك واختار كيفاش تخلّص
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  ابعث طلبك في ثواني واختار تخلّص كاش وقت تكمل الخدمة ولا بالـ
                  D17 والكارطة البنكية وتابع الكل في &laquo;طلباتي&raquo;.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Submission Form */}
        <div
          id="add-service"
          className="lg:col-span-7 card-premium rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
              لمزودي الخدمات والحرفيين في صفاقس
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
              عندك خدمة في ولاية صفاقس؟ زيدها في دليل winnal9a
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              اهبط خدمتك توا باش تطلع ديركت في البحث قدّام أولاد وبنات صفاقس
              اللي يلوجو على اختصاصك.
            </p>
          </div>

          {publishedTitle && (
            <div className="p-4 bg-teal-50/80 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-700/60 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
              <div className="text-sm text-teal-950 dark:text-teal-100">
                <p className="font-semibold">
                  تزادت خدمتك بنجاح: {publishedTitle}
                </p>
                <a
                  href="#directory"
                  className="inline-block mt-1 font-medium text-[#0F766E] dark:text-[#2DD4BF] underline underline-offset-4"
                >
                  شوفها توا في دليل الخدمات
                </a>
              </div>
            </div>
          )}

          {errorMsg && (
            <p
              role="alert"
              className="text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 rounded-lg p-3"
            >
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  عنوان الخدمة
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: تصليح فريدجيدارات وكليماتيزور"
                  className="w-full h-11 px-3.5 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  اسمك ولا اسم الورشة
                </span>
                <input
                  type="text"
                  required
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="مثال: ورشة النور للتبريد"
                  className="w-full h-11 px-3.5 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  التصنيف
                </span>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as Exclude<ServiceCategory, 'all'>
                    )
                  }
                  className="w-full h-11 px-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                >
                  {CATEGORY_OPTIONS.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  الجهة في ولاية صفاقس
                </span>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                >
                  {SFAX_AREAS.filter((a) => a !== 'مناطق صفاقس الكل').map(
                    (a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  السوم يبدأ من (د.ت)
                </span>
                <input
                  type="number"
                  min={5}
                  required
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white tabular-nums focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                وصف الخدمة وشنوة تقدّم للحريف
              </span>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="احكي على خبرتك، شنوة يشمل السوم الابتدائي، وأوقات خدمتك..."
                className="w-full p-3.5 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488] resize-none"
              />
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تتهبط خدمتك في الحين في دليل المنصة.
              </p>
              <button
                type="submit"
                className="px-6 py-2.5 min-h-[44px] bg-[#0F2547] hover:bg-[#173666] dark:bg-[#0F766E] dark:hover:bg-[#0D9488] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
              >
                اهبط الخدمة توا
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
