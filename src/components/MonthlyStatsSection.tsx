import { BarChart3, CheckCircle2, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BookingRequest } from '../types/service';

interface MonthlyStatsSectionProps {
  requests: BookingRequest[];
  isDark?: boolean;
}

interface MonthlyPoint {
  month: string;
  completed: number;
  onTime: number;
}

const BASELINE_MONTHLY_DATA: MonthlyPoint[] = [
  { month: 'جانفي', completed: 148, onTime: 139 },
  { month: 'فيفري', completed: 164, onTime: 155 },
  { month: 'مارس', completed: 192, onTime: 183 },
  { month: 'أفريل', completed: 215, onTime: 204 },
  { month: 'ماي', completed: 238, onTime: 227 },
  { month: 'جوان', completed: 261, onTime: 250 },
  { month: 'جويلية', completed: 279, onTime: 266 },
  { month: 'أوت', completed: 294, onTime: 281 },
  { month: 'سبتمبر', completed: 318, onTime: 305 },
  { month: 'أكتوبر', completed: 342, onTime: 329 },
  { month: 'نوفمبر', completed: 368, onTime: 356 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    dataKey?: string;
    color?: string;
  }>;
  label?: string;
}

function StatsTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const completedItem = payload.find((p) => p.dataKey === 'completed');
  const onTimeItem = payload.find((p) => p.dataKey === 'onTime');

  return (
    <div
      dir="rtl"
      className="bg-[#0F2547] text-white border border-slate-700/80 rounded-xl px-4 py-3 shadow-lg text-xs space-y-1.5"
    >
      <p className="font-bold text-white border-b border-white/10 pb-1.5">
        شهر {label} 2026
      </p>
      {completedItem && (
        <div className="flex items-center justify-between gap-5">
          <span className="text-slate-300">الطلبات اللي كملت:</span>
          <span className="font-bold text-white tabular-nums">
            {completedItem.value} طلب
          </span>
        </div>
      )}
      {onTimeItem && (
        <div className="flex items-center justify-between gap-5">
          <span className="text-slate-300">كملت في وقتها:</span>
          <span className="font-bold text-[#2DD4BF] tabular-nums">
            {onTimeItem.value} طلب
          </span>
        </div>
      )}
    </div>
  );
}

export function MonthlyStatsSection({
  requests,
  isDark = false,
}: MonthlyStatsSectionProps) {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [range, setRange] = useState<'6m' | 'all'>('all');

  const primarySeriesColor = isDark ? '#38BDF8' : '#0F2547';
  const secondarySeriesColor = isDark ? '#2DD4BF' : '#0D9488';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const axisTickColor = isDark ? '#94A3B8' : '#475569';

  const userCompletedCount = useMemo(
    () => requests.filter((r) => r.status === 'كملت الخدمة').length,
    [requests]
  );

  const fullSeries = useMemo(() => {
    return BASELINE_MONTHLY_DATA.map((item, idx) => {
      if (idx === BASELINE_MONTHLY_DATA.length - 1) {
        return {
          ...item,
          completed: item.completed + userCompletedCount,
          onTime: item.onTime + userCompletedCount,
        };
      }
      return item;
    });
  }, [userCompletedCount]);

  const visibleData = useMemo(() => {
    return range === '6m' ? fullSeries.slice(-6) : fullSeries;
  }, [fullSeries, range]);

  const totalCompleted = useMemo(
    () => fullSeries.reduce((sum, d) => sum + d.completed, 0),
    [fullSeries]
  );

  const currentMonth = fullSeries[fullSeries.length - 1];
  const prevMonth = fullSeries[fullSeries.length - 2];
  const monthlyGrowthPct = Math.round(
    ((currentMonth.completed - prevMonth.completed) / prevMonth.completed) * 100
  );
  const monthlyAverage = Math.round(totalCompleted / fullSeries.length);

  return (
    <section
      id="stats"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="card-premium rounded-3xl p-6 sm:p-8 space-y-8">
        {/* Section Header + Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
              أرقام النشاط والثقة في صفاقس
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
              الطلبات اللي كملت كل شهر في المنصة
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              متابعة شهرية لتطور عدد الخدمات اللي كملت في ولاية صفاقس ونسبة
              الالتزام بالمواعيد المتفق عليها.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Time Range Segmented Control */}
            <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-[#0B1426] border border-transparent dark:border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setRange('6m')}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  range === '6m'
                    ? 'bg-white dark:bg-[#16233B] text-[#0F2547] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                آخر 6 شهور
              </button>
              <button
                type="button"
                onClick={() => setRange('all')}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  range === 'all'
                    ? 'bg-white dark:bg-[#16233B] text-[#0F2547] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                العام الكل
              </button>
            </div>

            {/* Chart Type Segmented Control */}
            <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-[#0B1426] border border-transparent dark:border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  chartType === 'area'
                    ? 'bg-[#0F2547] dark:bg-[#0F766E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                منحنى تطوّر
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  chartType === 'bar'
                    ? 'bg-[#0F2547] dark:bg-[#0F766E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                أعمدة بيانية
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1426]/90 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F2547] dark:text-[#38BDF8] shrink-0">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                جملة الطلبات اللي كملت (2026)
              </p>
              <p className="text-xl font-bold text-[#0F172A] dark:text-white tabular-nums mt-0.5">
                {totalCompleted.toLocaleString('en-US')} طلب
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1426]/90 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F766E] dark:text-[#2DD4BF] shrink-0">
              <TrendingUp className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إنجاز هالشهر (نوفمبر)
              </p>
              <p className="text-xl font-bold text-[#0F172A] dark:text-white tabular-nums mt-0.5">
                {currentMonth.completed} طلب{' '}
                <span className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                  (+{monthlyGrowthPct}%)
                </span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1426]/90 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F2547] dark:text-[#38BDF8] shrink-0">
              <BarChart3 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                المعدل الشهري للطلبات
              </p>
              <p className="text-xl font-bold text-[#0F172A] dark:text-white tabular-nums mt-0.5">
                {monthlyAverage} طلب / شهر
              </p>
            </div>
          </div>
        </div>

        {/* Recharts Visualization Container */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-xs bg-[#0F2547] dark:bg-[#38BDF8] inline-block"
                  aria-hidden="true"
                />
                <span>الطلبات اللي كملت الكل</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-xs bg-[#0D9488] dark:bg-[#2DD4BF] inline-block"
                  aria-hidden="true"
                />
                <span>طلبات كملت في وقتها</span>
              </span>
            </div>
            {userCompletedCount > 0 && (
              <span className="text-[#0F766E] dark:text-[#2DD4BF] font-medium tabular-nums">
                بالحساب متاع {userCompletedCount} خدمة كملتها إنت
              </span>
            )}
          </div>

          <div
            dir="ltr"
            className="w-full h-[300px] sm:h-[340px] bg-[#F8FAFC]/70 dark:bg-[#0B1426]/80 border border-slate-200/70 dark:border-slate-800 rounded-2xl pt-5 pb-2 px-2 sm:px-4"
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart
                  data={visibleData}
                  margin={{ top: 10, right: 16, left: -12, bottom: 4 }}
                >
                  <defs>
                    <linearGradient
                      id="navyCompletedFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={primarySeriesColor}
                        stopOpacity={isDark ? 0.28 : 0.22}
                      />
                      <stop
                        offset="95%"
                        stopColor={primarySeriesColor}
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                    <linearGradient
                      id="turquoiseOnTimeFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={secondarySeriesColor}
                        stopOpacity={isDark ? 0.24 : 0.18}
                      />
                      <stop
                        offset="95%"
                        stopColor={secondarySeriesColor}
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridColor}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: axisTickColor, fontSize: 12, fontFamily: 'Cairo' }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: axisTickColor,
                      fontSize: 12,
                      fontFamily: 'IBM Plex Mono',
                    }}
                  />
                  <Tooltip content={<StatsTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke={primarySeriesColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#navyCompletedFill)"
                    activeDot={{
                      r: 5,
                      fill: primarySeriesColor,
                      stroke: isDark ? '#0B1426' : '#FFFFFF',
                      strokeWidth: 2,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="onTime"
                    stroke={secondarySeriesColor}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#turquoiseOnTimeFill)"
                    activeDot={{
                      r: 4,
                      fill: secondarySeriesColor,
                      stroke: isDark ? '#0B1426' : '#FFFFFF',
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={visibleData}
                  margin={{ top: 10, right: 16, left: -12, bottom: 4 }}
                  barGap={6}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridColor}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: axisTickColor, fontSize: 12, fontFamily: 'Cairo' }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: axisTickColor,
                      fontSize: 12,
                      fontFamily: 'IBM Plex Mono',
                    }}
                  />
                  <Tooltip
                    content={<StatsTooltip />}
                    cursor={{
                      fill: isDark
                        ? 'rgba(148, 163, 184, 0.08)'
                        : 'rgba(15, 37, 71, 0.04)',
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    fill={primarySeriesColor}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={26}
                  />
                  <Bar
                    dataKey="onTime"
                    fill={secondarySeriesColor}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={26}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
