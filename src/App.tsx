import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AddServiceSection } from './components/AddServiceSection';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { CategoryIcon } from './components/CategoryIcon';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MonthlyStatsSection } from './components/MonthlyStatsSection';
import { PaymentSection } from './components/PaymentSection';
import { RequestsDrawer, SideDrawerTab } from './components/RequestsDrawer';
import { ServiceCard } from './components/ServiceCard';
import { ServiceModal } from './components/ServiceModal';
import { ToastContainer, ToastNotification } from './components/ToastContainer';
import {
  CATEGORY_OPTIONS,
  INITIAL_SERVICES,
  SFAX_AREAS,
} from './data/services';
import {
  BookingRequest,
  RecentSearchItem,
  ServiceCategory,
  ServiceItem,
  ServiceReview,
  SortOption,
} from './types/service';

const STORAGE_SERVICES_KEY = 'winnal9a_sfax_services_v2';
const STORAGE_REQUESTS_KEY = 'winnal9a_sfax_requests_v3';
const STORAGE_REVIEWS_KEY = 'winnal9a_sfax_reviews_v2';
const STORAGE_FAVORITES_KEY = 'winnal9a_sfax_favorites_v1';
const STORAGE_RECENT_SEARCHES_KEY = 'winnal9a_sfax_recent_searches_v1';
const STORAGE_THEME_KEY = 'winnal9a_sfax_theme_v1';

const DARIJA_STOPWORDS = new Set([
  'نحب',
  'لوج',
  'لوجلي',
  'ابحث',
  'على',
  'في',
  'من',
  'مع',
  'عن',
  'عندي',
  'خدمه',
  'متاع',
  'تاع',
  'بجاه',
  'عافاك',
  'توا',
  'شكون',
  'يعمل',
  'يصلح',
  'صفاقس',
]);

function normalizeArabicText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

export default function App() {
  const [customServices, setCustomServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SERVICES_KEY);
      return saved ? (JSON.parse(saved) as ServiceItem[]) : [];
    } catch {
      return [];
    }
  });

  const [requests, setRequests] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REQUESTS_KEY);
      return saved ? (JSON.parse(saved) as BookingRequest[]) : [];
    } catch {
      return [];
    }
  });

  const [userReviews, setUserReviews] = useState<
    Record<string, ServiceReview[]>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REVIEWS_KEY);
      return saved
        ? (JSON.parse(saved) as Record<string, ServiceReview[]>)
        : {};
    } catch {
      return {};
    }
  });

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === 'string')
        : [];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_RECENT_SEARCHES_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? (parsed as RecentSearchItem[]).slice(0, 6)
          : [];
      } catch {
        return [];
      }
    }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>('all');
  const [selectedCity, setSelectedCity] = useState('مناطق صفاقس الكل');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<SideDrawerTab>('requests');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  const requestsRef = useRef<BookingRequest[]>(requests);
  const acceptanceTimersRef = useRef<Record<string, number>>({});
  const notifiedAcceptIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  useEffect(() => {
    return () => {
      Object.values(acceptanceTimersRef.current).forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      acceptanceTimersRef.current = {};
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_SERVICES_KEY,
        JSON.stringify(customServices)
      );
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [customServices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(requests));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(userReviews));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [userReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_RECENT_SEARCHES_KEY,
        JSON.stringify(recentSearches)
      );
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [recentSearches]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [isDark]);

  const allServices = useMemo(() => {
    const baseList = [...customServices, ...INITIAL_SERVICES];
    return baseList.map((service) => {
      const added = userReviews[service.id];
      if (!added || added.length === 0) return service;

      const baseSum = service.rating * service.reviewCount;
      const addedSum = added.reduce((sum, r) => sum + r.rating, 0);
      const newCount = service.reviewCount + added.length;
      const newRating = Math.round(((baseSum + addedSum) / newCount) * 10) / 10;

      return {
        ...service,
        rating: newRating,
        reviewCount: newCount,
        reviews: [...added, ...service.reviews],
      };
    });
  }, [customServices, userReviews]);

  const activeService = useMemo(
    () => allServices.find((s) => s.id === activeServiceId) || null,
    [allServices, activeServiceId]
  );

  const favoriteServices = useMemo(() => {
    const mapById = new Map(allServices.map((s) => [s.id, s]));
    return favoriteIds
      .map((id) => mapById.get(id))
      .filter((item): item is ServiceItem => Boolean(item));
  }, [allServices, favoriteIds]);

  const filteredServices = useMemo(() => {
    const rawQuery = searchQuery.trim();
    const normalizedQuery = normalizeArabicText(rawQuery);
    const tokens = normalizedQuery
      .split(/\s+/)
      .filter((word) => word.length > 1 && !DARIJA_STOPWORDS.has(word));

    const matches = allServices.filter((service) => {
      const categoryMatch =
        selectedCategory === 'all' || service.category === selectedCategory;
      const cityMatch =
        selectedCity === 'مناطق صفاقس الكل' || service.city === selectedCity;

      if (normalizedQuery === '') {
        return categoryMatch && cityMatch;
      }

      const combinedText = normalizeArabicText(
        `${service.title} ${service.description} ${service.providerName} ${service.categoryLabel} ${service.city}`
      );

      const queryMatch =
        combinedText.includes(normalizedQuery) ||
        (tokens.length > 0 &&
          tokens.every((token) => combinedText.includes(token)));

      return categoryMatch && cityMatch && queryMatch;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceFrom - b.priceFrom;
      if (sortBy === 'fast') return a.responseMinutes - b.responseMinutes;
      return b.rating - a.rating || b.reviewCount - a.reviewCount;
    });
  }, [allServices, searchQuery, selectedCategory, selectedCity, sortBy]);

  const handleScrollToDirectory = () => {
    document
      .getElementById('directory')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitHeroSearch = (queryOverride?: string) => {
    const effectiveQuery = (queryOverride ?? searchQuery).trim();
    const hasCustomCategory = selectedCategory !== 'all';
    const hasCustomCity = selectedCity !== 'مناطق صفاقس الكل';

    if (effectiveQuery !== '' || hasCustomCategory || hasCustomCity) {
      const categoryLabel =
        CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)?.label || '';

      let label = effectiveQuery;
      if (label && hasCustomCity) {
        label = `${label} · ${selectedCity}`;
      } else if (label && hasCustomCategory) {
        label = `${label} · ${categoryLabel}`;
      } else if (!label && hasCustomCategory && hasCustomCity) {
        label = `${categoryLabel} · ${selectedCity}`;
      } else if (!label && hasCustomCategory) {
        label = categoryLabel;
      } else if (!label && hasCustomCity) {
        label = selectedCity;
      }

      const normalizedKey = `${normalizeArabicText(effectiveQuery)}|${selectedCategory}|${selectedCity}`;
      const newEntry: RecentSearchItem = {
        id: `srch-${Date.now()}`,
        query: effectiveQuery,
        category: selectedCategory,
        city: selectedCity,
        label,
      };

      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (item) =>
            `${normalizeArabicText(item.query)}|${item.category}|${item.city}` !==
            normalizedKey
        );
        return [newEntry, ...filtered].slice(0, 6);
      });
    }

    handleScrollToDirectory();
  };

  const handleSelectRecentSearch = (item: RecentSearchItem) => {
    setSearchQuery(item.query);
    setSelectedCategory(item.category);
    setSelectedCity(item.city);
    setRecentSearches((prev) => [
      item,
      ...prev.filter((entry) => entry.id !== item.id),
    ]);
    handleScrollToDirectory();
  };

  const handleRemoveRecentSearch = (id: string) => {
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleJumpToAddService = () => {
    document
      .getElementById('add-service')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToPayment = () => {
    document
      .getElementById('payment')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('مناطق صفاقس الكل');
    setSortBy('rating');
  };

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastNotification, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
    },
    []
  );

  const openDrawer = useCallback((tab: SideDrawerTab) => {
    setDrawerTab(tab);
    setIsDrawerOpen(true);
  }, []);

  const handleAcceptRequest = useCallback(
    (id: string) => {
      const pendingTimer = acceptanceTimersRef.current[id];
      if (pendingTimer) {
        window.clearTimeout(pendingTimer);
        delete acceptanceTimersRef.current[id];
      }

      const target = requestsRef.current.find((r) => r.id === id);
      if (!target || target.status !== 'في المراجعة') return;

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id && r.status === 'في المراجعة'
            ? { ...r, status: 'تأكّد الموعد' }
            : r
        )
      );

      if (!notifiedAcceptIdsRef.current.has(id)) {
        notifiedAcceptIdsRef.current.add(id);
        pushToast({
          variant: 'accepted',
          title: `مزود الخدمة قبل طلبك (#${target.referenceCode})`,
          message: `${target.providerName} أكّد موعد «${target.serviceTitle}» نهار ${target.preferredDate} في ${target.city}.`,
          actionLabel: 'شوف التفاصيل',
          onAction: () => openDrawer('requests'),
        });
      }
    },
    [openDrawer, pushToast]
  );

  const handleCreateBooking = (booking: BookingRequest) => {
    setRequests((prev) => [booking, ...prev]);

    pushToast({
      variant: 'booking',
      title: `تم تسجيل الحجز بنجاح (#${booking.referenceCode})`,
      message: `طلبك لـ «${booking.serviceTitle}» وصل لـ ${booking.providerName}. باش يأكد معاك الموعد قريب.`,
      actionLabel: 'شوف في طلباتي',
      onAction: () => openDrawer('requests'),
    });

    // Simulate real-time provider acceptance notification shortly after booking
    acceptanceTimersRef.current[booking.id] = window.setTimeout(() => {
      handleAcceptRequest(booking.id);
    }, 5000);
  };

  const handleToggleFavorite = (serviceId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [serviceId, ...prev]
    );
  };

  const handleClearFavorites = () => {
    setFavoriteIds([]);
  };

  const handleRemoveRequest = (id: string) => {
    const pendingTimer = acceptanceTimersRef.current[id];
    if (pendingTimer) {
      window.clearTimeout(pendingTimer);
      delete acceptanceTimersRef.current[id];
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCompleteRequest = (id: string) => {
    const pendingTimer = acceptanceTimersRef.current[id];
    if (pendingTimer) {
      window.clearTimeout(pendingTimer);
      delete acceptanceTimersRef.current[id];
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'كملت الخدمة' } : r))
    );
  };

  const handleSubmitReview = ({
    requestId,
    rating,
    comment,
  }: {
    requestId: string;
    rating: number;
    comment: string;
  }) => {
    const targetRequest = requests.find((r) => r.id === requestId);
    if (!targetRequest || targetRequest.userRating) return;

    const todayLabel = new Date().toLocaleDateString('ar-TN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const newReview: ServiceReview = {
      id: `rev-${Date.now()}`,
      author: targetRequest.customerName,
      city: targetRequest.city,
      rating,
      comment:
        comment ||
        `تقيّمت الخدمة بـ ${rating} من 5 نجوم بعد ما كملت بنجاح.`,
      date: todayLabel,
    };

    setUserReviews((prev) => ({
      ...prev,
      [targetRequest.serviceId]: [
        newReview,
        ...(prev[targetRequest.serviceId] || []),
      ],
    }));

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              userRating: rating,
              userReview: comment,
              reviewedAt: todayLabel,
            }
          : r
      )
    );
  };

  const handleAddService = (newService: ServiceItem) => {
    setCustomServices((prev) => [newService, ...prev]);
    setSelectedCategory('all');
    setSelectedCity('مناطق صفاقس الكل');
    setSearchQuery('');
  };

  const handleSettlePayment = ({
    referenceCode,
    method,
  }: {
    referenceCode: string;
    method: 'd17' | 'card';
    amount: number;
    payerDetail: string;
  }) => {
    const paymentRef = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const methodLabel =
      method === 'd17' ? 'D17 ولا Flouci' : 'كارطة بنكية (CIB / Visa)';

    setRequests((prev) =>
      prev.map((req) =>
        req.referenceCode.toUpperCase() === referenceCode.toUpperCase()
          ? {
              ...req,
              paymentMethod: method,
              paymentMethodLabel: methodLabel,
              paymentStatus: 'تخلّصت أونلاين',
              paymentRef,
            }
          : req
      )
    );

    return paymentRef;
  };

  return (
    <div className="min-h-screen flex flex-col bg-marketplace-canvas text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      <AnnouncementBanner />

      <Header
        requestsCount={requests.length}
        favoritesCount={favoriteServices.length}
        isDark={isDark}
        onToggleDarkMode={() => setIsDark((prev) => !prev)}
        onOpenRequests={() => openDrawer('requests')}
        onOpenFavorites={() => openDrawer('favorites')}
        onJumpToAddService={handleJumpToAddService}
      />

      <main className="flex-1">
        <Hero
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          recentSearches={recentSearches}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onCityChange={setSelectedCity}
          onSubmitSearch={handleSubmitHeroSearch}
          onSelectRecentSearch={handleSelectRecentSearch}
          onRemoveRecentSearch={handleRemoveRecentSearch}
          onClearRecentSearches={handleClearRecentSearches}
          totalServicesCount={allServices.length}
        />

        {/* Directory & Filter Workspace */}
        <section
          id="directory"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                حرفيون ومختصون ثقة
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                دليل الخدمات الموجودة في صفاقس
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 tabular-nums">
                يعرض {filteredServices.length} من جملة {allServices.length} خدمة
                موثوقة
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span>الجهة:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-10 px-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:border-[#0D9488] cursor-pointer"
                >
                  {SFAX_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span>رتّب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-10 px-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:border-[#0D9488] cursor-pointer"
                >
                  <option value="rating">الأعلى تقييم</option>
                  <option value="price-asc">الأرخص سوم</option>
                  <option value="fast">الأسرع في الرد</option>
                </select>
              </label>
            </div>
          </div>

          {/* Interactive Category Filter Segmented Bar with Organized Uniform Icons */}
          <div
            id="categories"
            role="tablist"
            aria-label="تصنيفات الخدمات"
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2"
          >
            {CATEGORY_OPTIONS.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 min-h-[42px] text-sm font-medium rounded-xl border inline-flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    isActive
                      ? 'bg-[#0F2547] dark:bg-[#0F766E] text-white border-[#0F2547] dark:border-[#0F766E] shadow-sm'
                      : 'bg-white dark:bg-[#111C30] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:text-[#0F2547] dark:hover:text-white shadow-2xs'
                  }`}
                >
                  <CategoryIcon
                    category={cat.id}
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#2DD4BF]' : 'text-[#0F766E] dark:text-[#2DD4BF]'
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="card-premium rounded-2xl p-12 text-center space-y-3">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                ما لقيناش خدمات تطابق البحث متاعك توا
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                جرّب بدّل الكلمات اللي كتبتها ولا اختار &laquo;مناطق صفاقس
                الكل&raquo; باش يطلعولك أكثر مزودين.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 min-h-[44px] bg-[#0F2547] hover:bg-[#173666] dark:bg-[#0F766E] dark:hover:bg-[#0D9488] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                رجّع البحث من جديد
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isFavorite={favoriteIds.includes(service.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelect={(item) => setActiveServiceId(item.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Frequently Asked Questions about Booking & Payments in Sfax */}
        <FaqSection />

        {/* Monthly Completed Requests Statistics (Recharts) */}
        <MonthlyStatsSection requests={requests} isDark={isDark} />

        {/* Dedicated Payment Hub & Quick Settlement Section */}
        <PaymentSection
          requests={requests}
          onSettlePayment={handleSettlePayment}
        />

        <AddServiceSection onAddService={handleAddService} />
      </main>

      <Footer />

      {activeService && (
        <ServiceModal
          service={activeService}
          isFavorite={favoriteIds.includes(activeService.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setActiveServiceId(null)}
          onCreateBooking={handleCreateBooking}
          onOpenRequests={() => openDrawer('requests')}
        />
      )}

      <RequestsDrawer
        isOpen={isDrawerOpen}
        activeTab={drawerTab}
        onTabChange={setDrawerTab}
        requests={requests}
        favoriteServices={favoriteServices}
        onClose={() => setIsDrawerOpen(false)}
        onRemoveRequest={handleRemoveRequest}
        onAcceptRequest={handleAcceptRequest}
        onCompleteRequest={handleCompleteRequest}
        onSubmitReview={handleSubmitReview}
        onToggleFavorite={handleToggleFavorite}
        onClearFavorites={handleClearFavorites}
        onSelectService={(serviceId) => setActiveServiceId(serviceId)}
        onJumpToPayment={handleJumpToPayment}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
