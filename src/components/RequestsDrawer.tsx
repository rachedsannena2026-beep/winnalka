import {
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  Heart,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { BookingRequest, ServiceItem } from '../types/service';
import { CategoryIcon } from './CategoryIcon';

export type SideDrawerTab = 'requests' | 'favorites';

interface RequestsDrawerProps {
  isOpen: boolean;
  activeTab: SideDrawerTab;
  onTabChange: (tab: SideDrawerTab) => void;
  requests: BookingRequest[];
  favoriteServices: ServiceItem[];
  onClose: () => void;
  onRemoveRequest: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onCompleteRequest: (id: string) => void;
  onSubmitReview: (payload: {
    requestId: string;
    rating: number;
    comment: string;
  }) => void;
  onToggleFavorite: (serviceId: string) => void;
  onClearFavorites: () => void;
  onSelectService: (serviceId: string) => void;
  onJumpToPayment: () => void;
}

interface RatingFormProps {
  requestId: string;
  onSubmitReview: (payload: {
    requestId: string;
    rating: number;
    comment: string;
  }) => void;
}

function RequestStatusBadge({ status }: { status: BookingRequest['status'] }) {
  if (status === 'كملت الخدمة') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#0F2547] dark:bg-[#162844] text-white border border-[#0F2547] dark:border-slate-600 shadow-[0_4px_14px_-4px_rgba(15,37,71,0.45)]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (status === 'تأكّد الموعد') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50/95 dark:bg-teal-950/70 text-[#0F766E] dark:text-[#2DD4BF] border border-teal-200/90 dark:border-teal-700/70 shadow-[0_0_16px_-3px_rgba(13,148,136,0.38)]">
        <span className="relative flex w-2 h-2 shrink-0" aria-hidden="true">
          <span className="animate-status-beacon absolute inset-0 rounded-full bg-[#0D9488]" />
          <span className="relative inline-flex rounded-full w-2 h-2 bg-[#0F766E] dark:bg-[#2DD4BF]" />
        </span>
        <CalendarCheck2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50/95 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/90 dark:border-amber-700/60 shadow-[0_0_14px_-3px_rgba(245,158,11,0.35)]">
      <span className="relative flex w-2 h-2 shrink-0" aria-hidden="true">
        <span className="animate-status-beacon absolute inset-0 rounded-full bg-amber-400" />
        <span className="relative inline-flex rounded-full w-2 h-2 bg-amber-500" />
      </span>
      <Clock3 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}

function RequestRatingForm({ requestId, onSubmitReview }: RatingFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeStars = hoverRating || rating;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (rating < 1 || rating > 5) {
      setErrorMsg('عافاك اختار عدد النجوم من 1 لـ 5.');
      return;
    }

    onSubmitReview({
      requestId,
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#0F172A] dark:text-white">
          قيّم الخدمة بعد ما كملت
        </span>
        <span className="text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
          {activeStars} / 5
        </span>
      </div>

      <div
        className="flex items-center gap-1.5"
        role="radiogroup"
        aria-label="اختيار التقييم بالنجوم"
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const filled = starValue <= activeStars;
          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={rating === starValue}
              aria-label={`${starValue} نجوم`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  filled
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-300 dark:text-slate-600 fill-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <p role="alert" className="text-xs text-red-700 dark:text-red-400 font-medium">
          {errorMsg}
        </p>
      )}

      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="اكتب رأيك باختصار على جودة الخدمة والالتزام بالوقت (اختياري)..."
        className="w-full p-2.5 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0D9488] resize-none"
      />

      <button
        type="submit"
        className="w-full py-2 min-h-[40px] px-3 bg-[#0F2547] hover:bg-[#173666] dark:bg-[#0F766E] dark:hover:bg-[#0D9488] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
      >
        ابعث التقييم
      </button>
    </form>
  );
}

export function RequestsDrawer({
  isOpen,
  activeTab,
  onTabChange,
  requests,
  favoriteServices,
  onClose,
  onRemoveRequest,
  onAcceptRequest,
  onCompleteRequest,
  onSubmitReview,
  onToggleFavorite,
  onClearFavorites,
  onSelectService,
  onJumpToPayment,
}: RequestsDrawerProps) {
  if (!isOpen) return null;

  const isFavoritesTab = activeTab === 'favorites';

  return (
    <div
      className="fixed inset-0 z-50 bg-[#091526]/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={isFavoritesTab ? 'قائمة المفضلة' : 'قائمة طلباتي'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#111C30] w-full max-w-md h-full border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl transition-colors">
        {/* Drawer Header & Tab Switcher */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] dark:text-white">
                {isFavoritesTab ? 'الخدمات المفضلة' : 'طلباتي المسجلة'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {isFavoritesTab
                  ? favoriteServices.length === 0
                    ? 'ما فما حتى خدمة محفوظة توا'
                    : `${favoriteServices.length} خدمات محفوظة في المفضلة`
                  : requests.length === 0
                    ? 'ما فما حتى طلب مسجّل توا'
                    : `${requests.length} طلبات مسجلة`}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="سكّر القائمة الجانبية"
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            role="tablist"
            aria-label="أقسام القائمة الجانبية"
            className="px-6 pb-3 grid grid-cols-2 gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isFavoritesTab}
              onClick={() => onTabChange('requests')}
              className={`h-10 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                !isFavoritesTab
                  ? 'bg-[#0F2547] dark:bg-[#0F766E] text-white border-[#0F2547] dark:border-[#0F766E] shadow-xs'
                  : 'bg-[#F8FAFC] dark:bg-[#0B1426] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-[#0F2547] dark:hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>طلباتي ({requests.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={isFavoritesTab}
              onClick={() => onTabChange('favorites')}
              className={`h-10 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                isFavoritesTab
                  ? 'bg-[#0F2547] dark:bg-[#0F766E] text-white border-[#0F2547] dark:border-[#0F766E] shadow-xs'
                  : 'bg-[#F8FAFC] dark:bg-[#0B1426] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-[#0F2547] dark:hover:text-white'
              }`}
            >
              <Heart
                className={`w-4 h-4 shrink-0 ${
                  favoriteServices.length > 0
                    ? isFavoritesTab
                      ? 'text-rose-400 fill-rose-400'
                      : 'text-rose-500 fill-rose-500'
                    : ''
                }`}
                aria-hidden="true"
              />
              <span>المفضلة ({favoriteServices.length})</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {isFavoritesTab ? (
            favoriteServices.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-800/60 flex items-center justify-center mx-auto text-rose-500 dark:text-rose-400">
                  <Heart className="w-6 h-6" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  مازال ما حفظت حتى خدمة في المفضلة
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  كي تعجبك خدمة في الدليل، انزل على زر القلب باش تتحفظ هنا وترجعلها
                  في أي وقت تحب تحجزها.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 min-h-[42px] bg-[#0F2547] dark:bg-[#0F766E] text-white text-xs font-semibold rounded-xl hover:bg-[#173666] dark:hover:bg-[#0D9488] transition-colors cursor-pointer"
                >
                  تصفّح الخدمات
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>محفوظة أوتوماتيكياً على متصفّحك</span>
                  <button
                    type="button"
                    onClick={onClearFavorites}
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    فرّغ الكل
                  </button>
                </div>

                {favoriteServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1 font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                            <CategoryIcon
                              category={service.category}
                              className="w-3 h-3 shrink-0"
                            />
                            <span>{service.categoryLabel}</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{service.city}</span>
                        </div>

                        <h3 className="text-sm font-bold text-[#0F172A] dark:text-white leading-snug line-clamp-2">
                          {service.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1 truncate">
                            {service.verified && (
                              <ShieldCheck
                                className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#2DD4BF] shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            <span className="truncate">
                              {service.providerName}
                            </span>
                          </span>
                          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                            ·
                          </span>
                          <span className="inline-flex items-center gap-0.5 tabular-nums shrink-0 font-semibold text-[#0F172A] dark:text-white">
                            <Star
                              className="w-3 h-3 text-amber-500 fill-amber-500"
                              aria-hidden="true"
                            />
                            {service.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleFavorite(service.id)}
                        aria-label={`نحّي ${service.title} من المفضلة`}
                        title="نحّي من المفضلة"
                        className="p-2 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <Heart
                          className="w-4 h-4 fill-rose-500"
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div className="tabular-nums">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          يبدأ من
                        </span>
                        <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                          {service.priceFrom} {service.priceUnit}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectService(service.id);
                        }}
                        className="px-4 py-2 min-h-[38px] bg-[#0F2547] hover:bg-[#173666] dark:bg-[#0F766E] dark:hover:bg-[#0D9488] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        التفاصيل والحجز
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )
          ) : requests.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                مازال ما حجزت حتى خدمة
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                اختار الخدمة اللي حاجتك بيها من الدليل وابعث الطلب باش يطلعلك
                هنا بنومرو المتابعة وحالة الخلاص والتقييم.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2.5 min-h-[42px] bg-[#0F2547] dark:bg-[#0F766E] text-white text-xs font-semibold rounded-xl hover:bg-[#173666] dark:hover:bg-[#0D9488] transition-colors cursor-pointer"
              >
                شوف الخدمات
              </button>
            </div>
          ) : (
            requests.map((req) => {
              const isPending = req.status === 'في المراجعة';
              const isAccepted = req.status === 'تأكّد الموعد';
              const isCompleted = req.status === 'كملت الخدمة';
              return (
                <div
                  key={req.id}
                  className="p-4 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 text-xs">
                        <span
                          dir="ltr"
                          className="font-mono-num font-semibold text-[#0F766E] dark:text-[#2DD4BF]"
                        >
                          #{req.referenceCode}
                        </span>
                        <RequestStatusBadge status={req.status} />
                      </div>
                      <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                        {req.serviceTitle}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {req.providerName} · {req.city}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveRequest(req.id)}
                      aria-label="لغّي الطلب"
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Live 3-Step Visual Progress Bar */}
                  <div
                    aria-label={`تقدم الطلب: ${req.status}`}
                    className="grid grid-cols-3 gap-1.5 pt-0.5"
                  >
                    <div className="space-y-1">
                      <div
                        className={`h-1 rounded-full transition-colors ${
                          isPending
                            ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                            : 'bg-[#0D9488]'
                        }`}
                      />
                      <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        في المراجعة
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`h-1 rounded-full transition-colors ${
                          isAccepted || isCompleted
                            ? 'bg-[#0D9488] shadow-[0_0_8px_rgba(13,148,136,0.45)]'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                      <span
                        className={`block text-[10px] font-medium ${
                          isAccepted || isCompleted
                            ? 'text-[#0F766E] dark:text-[#2DD4BF]'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        تأكّد الموعد
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`h-1 rounded-full transition-colors ${
                          isCompleted
                            ? 'bg-[#0F2547] dark:bg-[#2DD4BF] shadow-[0_0_8px_rgba(15,37,71,0.4)]'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                      <span
                        className={`block text-[10px] font-medium ${
                          isCompleted
                            ? 'text-[#0F2547] dark:text-white'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        كملت
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {req.preferredDate}
                      </span>
                      <span className="font-semibold text-[#0F172A] dark:text-white tabular-nums">
                        {req.priceFrom} د.ت
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {req.paymentMethodLabel}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          req.paymentStatus === 'تخلّصت أونلاين'
                            ? 'text-[#0F766E] dark:text-[#2DD4BF]'
                            : 'text-[#0F2547] dark:text-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {req.paymentStatus}
                      </span>
                    </div>

                    {/* Action buttons before completion / payment */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => onAcceptRequest(req.id)}
                          className="flex-1 py-2 min-h-[40px] px-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-700/60 hover:bg-teal-100/80 dark:hover:bg-teal-900/60 text-[#0F766E] dark:text-[#2DD4BF] font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          قبول من المزود
                        </button>
                      )}

                      {req.paymentStatus !== 'تخلّصت أونلاين' && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onJumpToPayment();
                          }}
                          className="flex-1 py-2 min-h-[40px] px-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 hover:border-[#0D9488] dark:hover:border-[#2DD4BF] hover:text-[#0F766E] dark:hover:text-[#2DD4BF] text-[#0F2547] dark:text-slate-200 font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          خلّص أونلاين توا
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => onCompleteRequest(req.id)}
                          className="flex-1 py-2 min-h-[40px] px-3 bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          أكّد إنها كملت
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Rating Form after completion, or Submitted Review display */}
                  {isCompleted && !req.userRating && (
                    <RequestRatingForm
                      requestId={req.id}
                      onSubmitReview={onSubmitReview}
                    />
                  )}

                  {isCompleted && req.userRating && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111C30] rounded-xl p-3 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                          تقييمك المسجّل
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= (req.userRating || 0)
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {req.userReview && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {req.userReview}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0B1426]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 min-h-[44px] bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            كمّل التصفح
          </button>
        </div>
      </div>
    </div>
  );
}
