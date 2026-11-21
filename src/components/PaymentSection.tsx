import {
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  Smartphone,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { BookingRequest } from '../types/service';

interface PaymentSectionProps {
  requests: BookingRequest[];
  onSettlePayment: (payload: {
    referenceCode: string;
    method: 'd17' | 'card';
    amount: number;
    payerDetail: string;
  }) => string;
}

export function PaymentSection({
  requests,
  onSettlePayment,
}: PaymentSectionProps) {
  const unpaidRequests = requests.filter(
    (r) => r.paymentStatus !== 'تخلّصت أونلاين'
  );

  const [selectedRef, setSelectedRef] = useState('');
  const [manualRef, setManualRef] = useState('');
  const [amount, setAmount] = useState('45');
  const [method, setMethod] = useState<'d17' | 'card'>('d17');
  const [walletPhone, setWalletPhone] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState<{
    paymentRef: string;
    bookingRef: string;
    amount: number;
    methodLabel: string;
  } | null>(null);

  const handleSelectRequest = (refCode: string) => {
    setSelectedRef(refCode);
    const found = unpaidRequests.find((r) => r.referenceCode === refCode);
    if (found) {
      setManualRef(found.referenceCode);
      setAmount(String(found.priceFrom));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetRef = (selectedRef || manualRef).trim().replace(/^#/, '');
    const parsedAmount = Number(amount);

    if (targetRef.length < 4) {
      setErrorMsg('عافاك حط نومرو المرجع ولا اختار حجز من القائمة.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('عافاك اكتب مبلغ صحيح أكبر من صفر.');
      return;
    }

    if (method === 'd17') {
      const cleaned = walletPhone.replace(/\s+/g, '');
      if (!/^\d{8}$/.test(cleaned)) {
        setErrorMsg('عافاك اكتب نومرو تليفون D17 / Flouci متاع 8 أرقام.');
        return;
      }
    } else {
      const cleanedCard = cardNumber.replace(/\s+/g, '');
      if (cardHolder.trim().length < 3 || !/^\d{12,16}$/.test(cleanedCard)) {
        setErrorMsg('عافاك اكتب اسم مولى الكارطة ونومرو الكارطة (12–16 رقم).');
        return;
      }
    }

    const payerDetail =
      method === 'd17'
        ? walletPhone.trim()
        : `•••• ${cardNumber.replace(/\s+/g, '').slice(-4)}`;

    const paymentRef = onSettlePayment({
      referenceCode: targetRef,
      method,
      amount: parsedAmount,
      payerDetail,
    });

    setReceipt({
      paymentRef,
      bookingRef: targetRef,
      amount: parsedAmount,
      methodLabel:
        method === 'd17' ? 'D17 ولا Flouci' : 'كارطة بنكية (CIB / Visa)',
    });

    setWalletPhone('');
    setCardHolder('');
    setCardNumber('');
    setSelectedRef('');
    setManualRef('');
  };

  return (
    <section
      id="payment"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-[#091526] via-[#0F2547] to-[#113356] bg-navy-mesh text-white rounded-3xl border border-[#1E3A5F]/60 dark:border-slate-700/70 shadow-[0_20px_50px_-12px_rgba(15,37,71,0.28)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Soft Ambient Turquoise & Deep Blue Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#14B8A6]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-[#1D4ED8]/15 blur-3xl"
        />

        {/* Right/Start: Payment Options & Guarantees */}
        <div className="relative z-10 lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#2DD4BF] tracking-wide">
              الخلاص والمعاملات المالية
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              طرق خلاص ساهلة وآمنة لخدمات ولاية صفاقس
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              تحب تخلّص كاش وقت تكمل الخدمة ولا أونلاين بالفيسع، نوفرولك
              طرق الخلاص المعتمدة الكل في تونس من غير حتى مليم عمولة زايدة على
              الحريف.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 space-y-2.5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0F2547] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <Banknote className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                كاش وقت تكمل الخدمة
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                خلّص الحرفي ولا المزود ديركت بعد ما تشوف الخدمة وتتثبت من
                الجودة.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 space-y-2.5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0F2547] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <Smartphone className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                محفظة D17 و Flouci
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                خلاص في الحين بالتليفون مع ميساج تأكيد ديركت لنومرو الحجز
                متاعك.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 space-y-2.5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0F2547] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <CreditCard className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                الكارطات البنكية التونسية
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                يقبل كارطات CIB وVisa وMastercard باش تخلّص مستحقاتك بأمان.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 space-y-2.5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0F2547] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <Building2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                تحويل بنكي للشركات
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                تحويل عبر RIB للمشاريع والشركات مع وصل وفاتورة رسمية.
              </p>
            </div>
          </div>
        </div>

        {/* Left/End: Interactive Quick Payment Settlement Box */}
        <div className="relative z-10 lg:col-span-6 bg-white dark:bg-[#111C30] text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-lg p-6 space-y-5 transition-colors">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                بوابة الخلاص السريع لحجوزاتك
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                خلّص سوم أي خدمة حجزتها ولا فاتورة متفاهمين عليها بنومرو المرجع
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F766E] dark:text-[#2DD4BF] shrink-0">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {receipt ? (
            <div className="py-3 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    تعدّى الخلاص بنجاح
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    العملية تسجّلت وتبدّلت حالة الحجز متاعك أوتوماتيكياً.
                  </p>
                </div>
              </div>

              <div className="bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">نومرو وصل الخلاص</span>
                  <span
                    dir="ltr"
                    className="font-mono-num font-semibold text-[#0F766E] dark:text-[#2DD4BF]"
                  >
                    {receipt.paymentRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">مرجع الحجز</span>
                  <span dir="ltr" className="font-mono-num text-slate-900 dark:text-white">
                    #{receipt.bookingRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">طريقة الخلاص</span>
                  <span className="text-slate-900 dark:text-white">{receipt.methodLabel}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    المبلغ اللي تخلّص
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {receipt.amount} د.ت
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="w-full py-2.5 min-h-[44px] px-4 bg-[#0F2547] hover:bg-[#173666] dark:bg-[#0F766E] dark:hover:bg-[#0D9488] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                اعمل عملية خلاص أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <p
                  role="alert"
                  className="text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 rounded-lg p-3"
                >
                  {errorMsg}
                </p>
              )}

              {unpaidRequests.length > 0 && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    اختار من طلباتك اللي مازالت ما تخلّصتش (اختياري)
                  </span>
                  <select
                    value={selectedRef}
                    onChange={(e) => handleSelectRequest(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                  >
                    <option value="">-- اكتب نومرو المرجع بيدك --</option>
                    {unpaidRequests.map((req) => (
                      <option key={req.id} value={req.referenceCode}>
                        #{req.referenceCode} — {req.serviceTitle} (
                        {req.priceFrom} د.ت)
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    مرجع الحجز
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={manualRef}
                    onChange={(e) => {
                      setManualRef(e.target.value);
                      setSelectedRef('');
                    }}
                    placeholder="WN-4820"
                    className="w-full h-11 px-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-right font-mono-num focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    المبلغ (د.ت)
                  </span>
                  <input
                    type="number"
                    min={1}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white tabular-nums focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                  />
                </label>
              </div>

              {/* Segmented Electronic Method Switch */}
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  كيفاش تحب تخلّص أونلاين؟
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-[#0B1426] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMethod('d17')}
                    className={`py-2.5 px-3 min-h-[40px] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      method === 'd17'
                        ? 'bg-white dark:bg-[#172844] text-[#0F2547] dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF]" aria-hidden="true" />
                    <span>D17 / Flouci</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`py-2.5 px-3 min-h-[40px] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      method === 'card'
                        ? 'bg-white dark:bg-[#172844] text-[#0F2547] dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF]" aria-hidden="true" />
                    <span>كارطة بنكية</span>
                  </button>
                </div>
              </div>

              {method === 'd17' ? (
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    نومرو التليفون المربوط بـ D17 / Flouci
                  </span>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    placeholder="20 123 456"
                    className="w-full h-11 px-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-right tabular-nums focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                  />
                </label>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      اسم مولى الكارطة
                    </span>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="الاسم كيما في الكارطة"
                      className="w-full h-11 px-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      نومرو الكارطة البنكية
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8900 1234 5678"
                      className="w-full h-11 px-3 bg-[#F8FAFC] dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-right font-mono-num focus:bg-white dark:focus:bg-[#0B1426] focus:outline-none focus:border-[#0D9488]"
                    />
                  </label>
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>عمولة المنصة على الحريف: 0 د.ت</span>
                <span className="font-semibold text-[#0F172A] dark:text-white tabular-nums">
                  المجموع: {Number(amount) > 0 ? amount : 0} د.ت
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 min-h-[44px] px-4 bg-[#0F2547] hover:bg-[#173666] dark:bg-[#0F766E] dark:hover:bg-[#0D9488] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
              >
                أكّد الخلاص أونلاين
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
