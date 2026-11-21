import {
  Clock,
  CreditCard,
  History,
  Layers,
  MapPin,
  Mic,
  MicOff,
  RotateCcw,
  Search,
  ShieldCheck,
  Wrench,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { CATEGORY_OPTIONS, SFAX_AREAS } from '../data/services';
import { RecentSearchItem, ServiceCategory } from '../types/service';

interface SpeechRecognitionResultAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultItem {
  isFinal: boolean;
  length: number;
  0: SpeechRecognitionResultAlternative;
}

interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultItem>;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface HeroProps {
  searchQuery: string;
  selectedCategory: ServiceCategory;
  selectedCity: string;
  recentSearches: RecentSearchItem[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: ServiceCategory) => void;
  onCityChange: (city: string) => void;
  onSubmitSearch: (queryOverride?: string) => void;
  onSelectRecentSearch: (item: RecentSearchItem) => void;
  onRemoveRecentSearch: (id: string) => void;
  onClearRecentSearches: () => void;
  totalServicesCount: number;
}

export function Hero({
  searchQuery,
  selectedCategory,
  selectedCity,
  recentSearches,
  onSearchChange,
  onCategoryChange,
  onCityChange,
  onSubmitSearch,
  onSelectRecentSearch,
  onRemoveRecentSearch,
  onClearRecentSearches,
  totalServicesCount,
}: HeroProps) {
  const [imgError, setImgError] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<{
    type: 'info' | 'error';
    message: string;
  } | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitSearch();
  };

  const handleToggleVoiceSearch = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const speechWindow = window as WindowWithSpeech;
    const SpeechRecognitionAPI =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVoiceFeedback({
        type: 'error',
        message:
          'المتصفح متاعك ما يدعمش البحث بالصوت توا، جرّب Chrome ولا اكتب اسم الخدمة مباشرة.',
      });
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'ar-TN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback({
          type: 'info',
          message:
            'نسمع فيك بالدارجة التونسية... قول شنوة الخدمة اللي تلوج عليها (مثلاً: بلومبي، تريسيان، نقل دبش).',
        });
      };

      recognition.onresult = (event) => {
        let combinedTranscript = '';
        let hasFinal = false;

        for (let i = 0; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result && result[0]) {
            combinedTranscript += result[0].transcript;
            if (result.isFinal) {
              hasFinal = true;
            }
          }
        }

        const cleaned = combinedTranscript
          .replace(/[،.!؟?]+$/g, '')
          .trim();

        if (cleaned) {
          onSearchChange(cleaned);
          if (hasFinal) {
            setVoiceFeedback({
              type: 'info',
              message: `تم البحث بالصوت على: «${cleaned}»`,
            });
            onSubmitSearch(cleaned);
          }
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        recognitionRef.current = null;

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceFeedback({
            type: 'error',
            message:
              'عافاك فعّل صلاحية الميكروفون في المتصفح باش نجمو نسمعو صوتك.',
          });
        } else if (event.error === 'no-speech') {
          setVoiceFeedback({
            type: 'error',
            message:
              'ما سمعناش صوت واضح، عاود انزل على «بحث بالصوت» واحكي قريب للميكروفون.',
          });
        } else if (event.error === 'aborted') {
          setVoiceFeedback(null);
        } else {
          setVoiceFeedback({
            type: 'error',
            message:
              'تعذّر التقاط الصوت توا، عاود جرّب ولا اكتب اسم الخدمة في خانة البحث.',
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
      setVoiceFeedback({
        type: 'error',
        message:
          'ما نجمناش نشغّلو الميكروفون توا، تأكد من الصلاحيات وعاود جرّب.',
      });
    }
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-hero-premium border-b border-slate-200/80 dark:border-slate-800 transition-colors"
    >
      {/* Subtle Abstract Ambient Shapes with Soft Blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 w-[460px] h-[460px] rounded-full bg-[#1E3A8A]/[0.06] dark:bg-[#2563EB]/[0.12] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 -left-24 w-[380px] h-[380px] rounded-full bg-[#14B8A6]/[0.08] dark:bg-[#14B8A6]/[0.12] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 w-[320px] h-[220px] rounded-full bg-[#0F2547]/[0.04] dark:bg-[#0F2547]/[0.18] blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* 2-Column Balanced Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                دليل الخدمات الشامل · ولاية صفاقس
              </p>

              <h1
                className="font-bold text-[#0F172A] dark:text-white leading-[1.18] tracking-tight text-balance"
                style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.25rem)' }}
              >
                الخدمات الكل في صفاقس، تلقاها واضحة في{' '}
                <span
                  dir="ltr"
                  className="font-brand text-[#0F2547] dark:text-[#2DD4BF] inline-block"
                >
                  winnal9a
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                من تصليح الدار والبلومبي والنقل للانفورماتيك والديزاين
                والاستشارات في مختلف مناطق ولاية صفاقس. قارن الحرفيين
                والمختصين الموثوقين، شوف الأسوام قبل ما تطلب، واحجز موعدك ديركت
                في دقائق.
              </p>
            </div>

            {/* Unified Elevated Search Bar with Voice Search */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/95 dark:bg-[#111C30]/95 backdrop-blur-sm border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_30px_-8px_rgba(15,37,71,0.1)] dark:shadow-[0_12px_34px_-10px_rgba(2,6,23,0.6)] space-y-3"
            >
              {/* Tier 1: Search Input + Voice Search Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <label className="flex-1 relative block">
                  <span className="sr-only">لوّج على خدمة</span>
                  <Search
                    className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="شنوة تلوج؟ (تريسيان، بلومبي، نقل، تنظيف...)"
                    className={`w-full h-11 pr-10 ${
                      searchQuery ? 'pl-9' : 'pl-3'
                    } bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0F1B30] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-colors`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        onSearchChange('');
                        setVoiceFeedback(null);
                      }}
                      aria-label="امسح البحث"
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </label>

                <button
                  type="button"
                  onClick={handleToggleVoiceSearch}
                  aria-pressed={isListening}
                  className={`h-11 px-4 rounded-xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488] ${
                    isListening
                      ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
                      : 'bg-[#F8FAFC] dark:bg-[#0B1426] hover:bg-teal-50/70 dark:hover:bg-teal-950/60 text-[#0F2547] dark:text-slate-100 hover:text-[#0F766E] dark:hover:text-[#2DD4BF] border-slate-200 dark:border-slate-700 hover:border-[#0D9488]'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>وقّف السمع</span>
                    </>
                  ) : (
                    <>
                      <Mic
                        className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF] shrink-0"
                        aria-hidden="true"
                      />
                      <span>بحث بالصوت</span>
                    </>
                  )}
                </button>
              </div>

              {/* Voice Search Live Status / Feedback */}
              {voiceFeedback && (
                <div
                  role={voiceFeedback.type === 'error' ? 'alert' : 'status'}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    voiceFeedback.type === 'error'
                      ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900/70 text-red-700 dark:text-red-300'
                      : 'bg-teal-50/80 dark:bg-teal-950/50 border-teal-200/80 dark:border-teal-800/70 text-[#0F766E] dark:text-[#2DD4BF]'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{voiceFeedback.message}</span>
                </div>
              )}

              {/* Tier 2: Category, Sfax Area & Submit */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <label className="sm:col-span-5 relative block">
                  <span className="sr-only">التصنيف</span>
                  <Layers
                    className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      onCategoryChange(e.target.value as ServiceCategory)
                    }
                    className="w-full h-11 pr-9 pl-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1B30] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-colors cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sm:col-span-4 relative block">
                  <span className="sr-only">الجهة في صفاقس</span>
                  <MapPin
                    className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <select
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="w-full h-11 pr-9 pl-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0F1B30] focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-colors cursor-pointer"
                  >
                    {SFAX_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full h-11 px-4 bg-[#0F2547] dark:bg-[#0F766E] hover:bg-[#173666] dark:hover:bg-[#0D9488] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
                  >
                    لوّج توا
                  </button>
                </div>
              </div>

              {/* Recent Searches Bar */}
              {recentSearches.length > 0 && (
                <div
                  aria-label="عمليات البحث الأخيرة"
                  className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400">
                      <History
                        className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0"
                        aria-hidden="true"
                      />
                      <span>عمليات البحث الأخيرة</span>
                    </span>

                    <button
                      type="button"
                      onClick={onClearRecentSearches}
                      className="font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      مسح الكل
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {recentSearches.map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex items-center rounded-lg bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200/90 dark:border-slate-700 hover:border-[#0D9488] dark:hover:border-[#2DD4BF] transition-colors max-w-full"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectRecentSearch(item)}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#0F2547] dark:hover:text-white inline-flex items-center gap-1.5 truncate cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-r-lg"
                        >
                          <RotateCcw
                            className="w-3 h-3 text-[#0F766E] dark:text-[#2DD4BF] shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.label}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveRecentSearch(item.id)}
                          aria-label={`امسح «${item.label}» من سجل البحث`}
                          className="pl-2 pr-1 py-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer rounded-l-lg"
                        >
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Media Column */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800 shadow-[0_14px_34px_-10px_rgba(15,37,71,0.16)] dark:shadow-[0_18px_40px_-10px_rgba(2,6,23,0.7)]">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_winnal9a_services_1795193380836.jpg"
                  alt="حرفيون ومختصون في الخدمات في استوديو عصري ضمن منصة winnal9a"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 dark:from-[#111C30] dark:via-[#0B1426] dark:to-[#0F2547] flex flex-col items-center justify-center p-6 text-center gap-3">
                  <Wrench className="w-10 h-10 text-[#0F2547] dark:text-[#2DD4BF]" />
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    منصة winnal9a للخدمات في ولاية صفاقس
                  </p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/45 to-transparent p-5">
                <p className="text-sm font-medium text-white">
                  حرفيون ومختصون ثقة في ولاية صفاقس
                </p>
                <p className="text-xs text-slate-200 mt-0.5">
                  تغطية لمختلف مناطق ومعتمديات ولاية صفاقس
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI / Trust Strip */}
        <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#111C30] border border-slate-200/90 dark:border-slate-700 shadow-xs flex items-center justify-center text-[#0F2547] dark:text-[#2DD4BF] shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] dark:text-white tabular-nums">
                +{totalServicesCount * 20}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                حرفي ومؤسسة معتمدة في صفاقس
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#111C30] border border-slate-200/90 dark:border-slate-700 shadow-xs flex items-center justify-center text-[#0F766E] dark:text-[#2DD4BF] shrink-0">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] dark:text-white tabular-nums">
                7 قطاعات
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                تصليح، برمجة، نقل، تنظيف واستشارات
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#111C30] border border-slate-200/90 dark:border-slate-700 shadow-xs flex items-center justify-center text-[#0F2547] dark:text-[#2DD4BF] shrink-0">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] dark:text-white tabular-nums">
                أقل من 90 دق
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                معدل الرد على طلبات الحرفاء
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#111C30] border border-slate-200/90 dark:border-slate-700 shadow-xs flex items-center justify-center text-[#0F766E] dark:text-[#2DD4BF] shrink-0">
              <CreditCard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] dark:text-white">
                خلاص ساهل وآمن
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                كاش وقت تكمل الخدمة ولا بالـ D17 والكارطة
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
