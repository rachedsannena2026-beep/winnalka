import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type FaqTopic = 'all' | 'booking' | 'payment' | 'coverage';

interface FaqItem {
  id: string;
  topic: Exclude<FaqTopic, 'all'>;
  topicLabel: string;
  question: string;
  answer: string;
}

const FAQ_TOPICS: { id: FaqTopic; label: string }[] = [
  { id: 'all', label: 'الأسئلة الكل' },
  { id: 'booking', label: 'الحجز والمواعيد' },
  { id: 'payment', label: 'الخلاص والفواتير' },
  { id: 'coverage', label: 'مناطق صفاقس والضمان' },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    topic: 'booking',
    topicLabel: 'الحجز والمواعيد',
    question: 'كيفاش نحجز خدمة في ولاية صفاقس عبر منصة winnal9a؟',
    answer:
      'اختار الخدمة اللي حاجتك بيها من الدليل، وانزل على «التفاصيل والحجز». اكتب اسمك، نومرو تليفونك، جهتك في ولاية صفاقس، والنهار المناسب، وابعث الطلب باش تاخو في الحين نومرو متابعة (#WN-xxxx) تلقاه ديما في قائمة «طلباتي».',
  },
  {
    id: 'faq-2',
    topic: 'payment',
    topicLabel: 'الخلاص والفواتير',
    question: 'شنوة طرق الخلاص الموجودة وقت تحجز خدمة في صفاقس؟',
    answer:
      'عندك 4 طرق خلاص ساهلين: تخلّص كاش ديركت وقت تكمل الخدمة، ولا تخلّص عبر D17 وFlouci، ولا بالكارطة البنكية التونسية (CIB وVisa وMastercard)، وبالنسبة للشركات والمشاريع فما زادة التحويل البنكي (RIB).',
  },
  {
    id: 'faq-3',
    topic: 'payment',
    topicLabel: 'الخلاص والفواتير',
    question: 'نجم نخلّص أونلاين بعد ما نبعث الطلب متاعي؟',
    answer:
      'إي تنجم. كان اخترت الخلاص وقت الإنجاز ومن بعد حبيت تخلّص بالـ D17 ولا الكارطة البنكية، ادخل لخانة «بوابة الخلاص السريع» ولا انزل على «خلّص أونلاين توا» من قائمة «طلباتي»، حط نومرو المرجع وكمل الخلاص في ثواني.',
  },
  {
    id: 'faq-4',
    topic: 'payment',
    topicLabel: 'الخلاص والفواتير',
    question: 'فماش عمولة زايدة على الحريف، والأسوام نهائية ولا تقديرية؟',
    answer:
      'المنصة ما تاخو حتى مليم عمولة على الحريف (0 د.ت). الأسوام المكتوبة في البطاقات هي أسوام مبدئية واضحة للخدمة الأساسية، والحرفي يأكد معاك السوم النهائي قبل ما يبدأ يخدم كان فما بياس ولا أشغال زايدة.',
  },
  {
    id: 'faq-5',
    topic: 'coverage',
    topicLabel: 'مناطق صفاقس والضمان',
    question: 'أما هي المناطق والمعتمديات اللي تخدمو فيها في ولاية صفاقس؟',
    answer:
      'المنصة مخصصة كان لولاية صفاقس وتغطي صفاقس المدينة، ساقية الزيت، ساقية الداير، قرمدة، طريق العين، طينة، والمحرس، وتنجم تحدّد جهتك بالضبط من شريط البحث باش يطلعولك الأقرب ليك.',
  },
  {
    id: 'faq-6',
    topic: 'booking',
    topicLabel: 'الحجز والمواعيد',
    question: 'كيفاش نقيّم الخدمة بعد ما تكمل، وإذا حبيت نلغّي طلب؟',
    answer:
      'حل قائمة «طلباتي» من الفوق: تنجم تلغّي أي طلب قبل ما يبدأ عبر أيقونة الفسخ، ووقت الحرفي يكمل خدمتو انزل على «أكّد إنها كملت» باش يطلعلك نموذج التقييم بالنجوم والتعليق، ويتحسب ديركت في معدل تقييم الخدمة.',
  },
  {
    id: 'faq-7',
    topic: 'coverage',
    topicLabel: 'مناطق صفاقس والضمان',
    question: 'خدمات التصليح والحرف في صفاقس عندهم ضمان؟',
    answer:
      'إي، الحرفيين المعتمدين في الضو والبلومبي والتبريد يقدّمولك معاينة واضحة وضمان على اليد العاملة ولا البياس اللي يتبدّل حسب تفاصيل كل عرض قبل ما تحجز.',
  },
];

export function FaqSection() {
  const [selectedTopic, setSelectedTopic] = useState<FaqTopic>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string>(FAQ_ITEMS[0].id);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const topicMatch =
        selectedTopic === 'all' || item.topic === selectedTopic;
      const queryMatch =
        q === '' ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.topicLabel.toLowerCase().includes(q);
      return topicMatch && queryMatch;
    });
  }, [selectedTopic, query]);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="faq"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Right/Start Column: Section Heading, Topic Filters & Search */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
              إجابات سريعة وواضحة
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white leading-snug">
              الأسئلة اللي تتعاود برشا على الحجز والخلاص في صفاقس
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              تصفح الإجابات على أكثر الأسئلة اللي يسألوها الناس على طريقة طلب
              الخدمات، المناطق المغطاة في ولاية صفاقس، وطرق الخلاص المضمونة.
            </p>
          </div>

          {/* Search input inside FAQ */}
          <label className="relative block">
            <span className="sr-only">لوّج في الأسئلة الشائعة</span>
            <Search
              className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="لوّج بكلمة (مثلاً: D17، إلغاء، ضمان...)"
              className="w-full h-11 pr-10 pl-3.5 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-colors"
            />
          </label>

          {/* Topic Filter Buttons */}
          <div
            role="tablist"
            aria-label="تصنيفات الأسئلة الشائعة"
            className="flex flex-wrap items-center gap-2"
          >
            {FAQ_TOPICS.map((topic) => {
              const isActive = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    isActive
                      ? 'bg-[#0F2547] dark:bg-[#0F766E] text-white border-[#0F2547] dark:border-[#0F766E] shadow-xs'
                      : 'bg-white dark:bg-[#111C30] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-[#0F2547] dark:hover:text-white'
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>

          {/* Direct Support Note */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F766E] dark:text-[#2DD4BF] shrink-0">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-[#0F172A] dark:text-white">
                ما لقيتش جواب لسؤالك؟
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                تنجم تراسلنا ديركت على{' '}
                <a
                  href="mailto:contact@winnal9a.tn"
                  dir="ltr"
                  className="font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline"
                >
                  contact@winnal9a.tn
                </a>{' '}
                ولا تشوف{' '}
                <a
                  href="#payment"
                  className="font-semibold text-[#0F2547] dark:text-white hover:underline"
                >
                  طرق الخلاص
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Left/End Column: Accordion Questions List */}
        <div className="lg:col-span-7">
          {filteredFaqs.length === 0 ? (
            <div className="card-premium rounded-2xl p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
                ما فماش أسئلة تطابق الكلمة اللي كتبتها
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                جرّب كلمة أخرى ولا اختار «الأسئلة الكل».
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedTopic('all');
                }}
                className="px-4 py-2 min-h-[40px] bg-[#0F2547] dark:bg-[#0F766E] hover:bg-[#173666] dark:hover:bg-[#0D9488] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                ورّي الأسئلة الكل
              </button>
            </div>
          ) : (
            <div className="card-premium rounded-2xl divide-y divide-slate-200/80 dark:divide-slate-800 overflow-hidden">
              {filteredFaqs.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div key={item.id} className="bg-white dark:bg-[#111C30]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() => handleToggle(item.id)}
                      className="w-full px-5 sm:px-6 py-5 text-right flex items-start justify-between gap-4 hover:bg-[#F8FAFC]/80 dark:hover:bg-[#16233B]/70 transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-[#F8FAFC] dark:focus-visible:bg-[#16233B]"
                    >
                      <div className="space-y-1">
                        <span className="block text-xs font-medium text-[#0F766E] dark:text-[#2DD4BF]">
                          {item.topicLabel}
                        </span>
                        <span
                          className={`block text-base font-bold leading-snug ${
                            isOpen
                              ? 'text-[#0F2547] dark:text-[#2DD4BF]'
                              : 'text-[#0F172A] dark:text-white'
                          }`}
                        >
                          {item.question}
                        </span>
                      </div>

                      <span
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                          isOpen
                            ? 'bg-[#0F2547] dark:bg-[#0F766E] border-[#0F2547] dark:border-[#0F766E] text-white'
                            : 'bg-[#F8FAFC] dark:bg-[#0B1426] border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-panel-${item.id}`}
                        className="px-5 sm:px-6 pb-5 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
