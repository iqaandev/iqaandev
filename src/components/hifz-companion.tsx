'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  BookHeart,
  Search,
  ChevronLeft,
  Check,
  X,
  RotateCcw,
  Star,
  Flame,
  Target,
  Trophy,
  TrendingUp,
  ArrowRight,
  Brain,
  Calendar,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { surahs } from '@/data/surahs';
import {
  isMemorized,
  memorizeAyah,
  unmemorizeAyah,
  getMemorizedAyahs,
  calculateStats,
  getDueCards,
  type HifzCard,
} from '@/lib/spaced-repetition';

function toArabicNumeral(num: number): string {
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map((c) => d[parseInt(c)]).join('');
}

type View = 'dashboard' | 'surah-list' | 'surah-detail' | 'review';

export default function HifzCompanion() {
  const [view, setView] = useState<View>('dashboard');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Build hifz state from storage — using lazy init to avoid setState in effect
  const [hifzState, setHifzState] = useState<Record<number, Set<number>>>(() => {
    if (typeof window === 'undefined') return {};
    const state: Record<number, Set<number>> = {};
    surahs.forEach((s) => {
      state[s.id] = getMemorizedAyahs(s.id);
    });
    return state;
  });

  // Rebuild state when refreshKey changes
  const rebuiltHifzState = useMemo(() => {
    const state: Record<number, Set<number>> = {};
    surahs.forEach((s) => {
      state[s.id] = getMemorizedAyahs(s.id);
    });
    return state;
  }, [refreshKey]);

  // Sync state
  useEffect(() => {
    setHifzState(rebuiltHifzState);
  }, [rebuiltHifzState]);

  const stats = useMemo(() => {
    const vc: Record<number, number> = {};
    surahs.forEach((s) => { vc[s.id] = s.versesCount; });
    return calculateStats(vc);
  }, [refreshKey]);

  const dueCards = useMemo(() => getDueCards(), [refreshKey]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    const q = searchQuery.toLowerCase();
    return surahs.filter(
      (s) =>
        s.nameArabic.includes(q) ||
        s.nameSimple.toLowerCase().includes(q) ||
        s.nameEnglish.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleAyah = (surahId: number, ayah: number) => {
    if (isMemorized(surahId, ayah)) {
      unmemorizeAyah(surahId, ayah, ayah);
    } else {
      memorizeAyah(surahId, ayah, ayah);
    }
    setRefreshKey((k) => k + 1);
  };

  const selectedSurahData = surahs.find((s) => s.id === selectedSurah);

  const refresh = () => setRefreshKey((k) => k + 1);

  // ─── Dashboard View ────────────────────────────────────────────────────
  const DashboardView = () => (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Target className="w-5 h-5 text-emerald-500" />}
          value={toArabicNumeral(stats.totalMemorized)}
          label="آية محفوظة"
          color="emerald"
        />
        <StatCard
          icon={<BookHeart className="w-5 h-5 text-violet-500" />}
          value={toArabicNumeral(stats.totalSurahs)}
          label="سورة"
          color="violet"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-amber-500" />}
          value={toArabicNumeral(stats.streak)}
          label="يوم متتالي"
          color="amber"
        />
        <StatCard
          icon={<Brain className="w-5 h-5 text-blue-500" />}
          value={toArabicNumeral(stats.dueToday)}
          label="تحتاج مراجعة"
          color="blue"
        />
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            التقدم العام
          </h3>
          <span className="text-xs text-muted-foreground">
            {stats.totalMemorized} / ٦٢٣٦ آية
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-l from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (stats.totalMemorized / 6236) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {((stats.totalMemorized / 6236) * 100).toFixed(2)}% من القرآن الكريم
        </p>

        {/* Juz Progress */}
        <div className="grid grid-cols-10 gap-1 mt-4">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
            const juzSurahs = surahs.filter((s) => s.juz.includes(juz));
            const totalAyahs = juzSurahs.reduce((sum, s) => sum + s.versesCount, 0);
            const memorizedAyahs = juzSurahs.reduce(
              (sum, s) => sum + (hifzState[s.id]?.size || 0),
              0
            );
            const progress = totalAyahs > 0 ? memorizedAyahs / totalAyahs : 0;
            return (
              <div
                key={juz}
                className="h-6 rounded flex items-center justify-center text-[9px] font-bold transition-colors cursor-default"
                style={{
                  backgroundColor: progress === 1 ? '#059669' : progress > 0 ? '#6ee7b7' : '#e5e7eb',
                  color: progress > 0 ? 'white' : '#9ca3af',
                }}
                title={`الجزء ${juz}: ${Math.round(progress * 100)}%`}
              >
                {toArabicNumeral(juz)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Due for Review */}
      {dueCards.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              تحتاج مراجعة
            </h3>
            <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded-full text-amber-800 dark:text-amber-200 font-medium">
              {toArabicNumeral(dueCards.length)}
            </span>
          </div>
          <div className="space-y-1.5">
            {dueCards.slice(0, 5).map((card) => {
              const surah = surahs.find((s) => s.id === card.surahId);
              if (!surah) return null;
              return (
                <div key={card.id} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 rounded-lg">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                    {toArabicNumeral(card.surahId)}
                  </span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white flex-1">
                    {surah.nameArabic}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    آية {toArabicNumeral(card.ayahFrom)}
                    {card.ayahFrom !== card.ayahTo ? `-${toArabicNumeral(card.ayahTo)}` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setView('surah-list')}
          className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-all text-right"
        >
          <BookHeart className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white">تحديد السور</p>
            <p className="text-[10px] text-muted-foreground">اختر الآيات المحفوظة</p>
          </div>
        </button>
        <button
          onClick={() => setView('review')}
          className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-all text-right"
        >
          <Brain className="w-5 h-5 text-violet-500" />
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white">المراجعة</p>
            <p className="text-[10px] text-muted-foreground">راجع الآيات المستحقة</p>
          </div>
        </button>
      </div>
    </div>
  );

  // ─── Surah List View ───────────────────────────────────────────────────
  const SurahListView = () => (
    <div>
      {/* Back + Search */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن سورة..."
            className="w-full h-9 pr-9 pl-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 text-sm focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-1 gap-1">
        {filteredSurahs.map((surah) => {
          const memorized = hifzState[surah.id]?.size || 0;
          const progress = surah.versesCount > 0 ? memorized / surah.versesCount : 0;

          return (
            <button
              key={surah.id}
              onClick={() => {
                setSelectedSurah(surah.id);
                setView('surah-detail');
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right group"
            >
              {/* Number */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: progress === 1 ? '#059669' : progress > 0 ? '#d1fae5' : '#f3f4f6',
                  color: progress > 0 ? (progress === 1 ? 'white' : '#059669') : '#9ca3af',
                }}
              >
                {toArabicNumeral(surah.id)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{surah.nameArabic}</span>
                  <span className="text-[10px] text-muted-foreground">{surah.nameSimple}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-[120px]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress * 100}%`,
                        backgroundColor: progress === 1 ? '#059669' : '#6ee7b7',
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {toArabicNumeral(memorized)}/{toArabicNumeral(surah.versesCount)}
                  </span>
                </div>
              </div>

              {/* Status */}
              {progress === 1 && (
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
              {progress === 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-muted-foreground flex-shrink-0">
                  {surah.revelationType === 'meccan' ? 'مكية' : 'مدنية'}
                </span>
              )}
              <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );

  // ─── Surah Detail View ─────────────────────────────────────────────────
  const SurahDetailView = () => {
    if (!selectedSurahData) return null;
    const memorized = hifzState[selectedSurahData.id] || new Set<number>();
    const allMemorized = memorized.size === selectedSurahData.versesCount;

    return (
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setView('surah-list')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {selectedSurahData.nameArabic}
              {allMemorized && <Check className="w-5 h-5 text-emerald-500" />}
            </h2>
            <p className="text-xs text-muted-foreground">
              {selectedSurahData.nameSimple} • {toArabicNumeral(selectedSurahData.versesCount)} آية
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                // Memorize all
                for (let i = 1; i <= selectedSurahData.versesCount; i++) {
                  memorizeAyah(selectedSurahData.id, i, i);
                }
                refresh();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
            >
              تحديد الكل
            </button>
            <button
              onClick={() => {
                // Unmemorize all
                for (let i = 1; i <= selectedSurahData.versesCount; i++) {
                  unmemorizeAyah(selectedSurahData.id, i, i);
                }
                refresh();
              }}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[11px] font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              إلغاء الكل
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-muted-foreground">التقدم</span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {toArabicNumeral(memorized.size)} / {toArabicNumeral(selectedSurahData.versesCount)}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${(memorized.size / selectedSurahData.versesCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Ayah Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
          {Array.from({ length: selectedSurahData.versesCount }, (_, i) => i + 1).map((ayah) => {
            const isDone = memorized.has(ayah);
            return (
              <button
                key={ayah}
                onClick={() => toggleAyah(selectedSurahData.id, ayah)}
                className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {toArabicNumeral(ayah)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Review View ───────────────────────────────────────────────────────
  const ReviewView = () => (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">المراجعة</h2>
          <p className="text-xs text-muted-foreground">
            {toArabicNumeral(dueCards.length)} سورة تحتاج مراجعة
          </p>
        </div>
      </div>

      {dueCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ممتاز! لا مراجعات مستحقة</h3>
          <p className="text-sm text-muted-foreground mb-6">حفظك يسير على ما يرام. عد لاحقًا للمراجعة.</p>
          <button
            onClick={() => setView('surah-list')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            تحديد المزيد من الآيات
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {dueCards.map((card) => {
            const surah = surahs.find((s) => s.id === card.surahId);
            if (!surah) return null;
            const nextReviewDate = new Date(card.nextReview);
            const daysUntil = Math.ceil((card.nextReview - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={card.id}
                className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-violet-700 dark:text-violet-300">
                    {toArabicNumeral(card.surahId)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{surah.nameArabic}</p>
                  <p className="text-[10px] text-muted-foreground">
                    آية {toArabicNumeral(card.ayahFrom)}
                    {card.ayahFrom !== card.ayahTo ? ` - ${toArabicNumeral(card.ayahTo)}` : ''} • {surah.nameSimple}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium">
                    {daysUntil <= 0 ? 'اليوم' : daysUntil === 1 ? 'غدًا' : `${toArabicNumeral(daysUntil)} أيام`}
                  </span>
                  <div className="flex gap-1">
                    <span className="text-[9px] text-muted-foreground">
                      تكرار: {toArabicNumeral(card.repetitions)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <BookHeart className="w-3.5 h-3.5" />
            <span>مراجعة الحفظ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">حافظ على حفظك</h1>
        </div>
        <div className="flex gap-1.5">
          {view === 'dashboard' && (
            <>
              <button
                onClick={() => setView('surah-list')}
                className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
                title="تحديد السور"
              >
                <BookHeart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('review')}
                className="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-950/50 transition-colors relative"
                title="المراجعة"
              >
                <Brain className="w-4 h-4" />
                {dueCards.length > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {dueCards.length > 9 ? '٩+' : toArabicNumeral(dueCards.length)}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Views */}
      {view === 'dashboard' && <DashboardView />}
      {view === 'surah-list' && <SurahListView />}
      {view === 'surah-detail' && <SurahDetailView />}
      {view === 'review' && <ReviewView />}

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          بيانات الحفظ مخزنة محليًا في متصفحك — آمنة وخاصة
        </p>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  const bgColors: Record<string, string> = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30',
    violet: 'bg-violet-50 dark:bg-violet-950/30',
    amber: 'bg-amber-50 dark:bg-amber-950/30',
    blue: 'bg-blue-50 dark:bg-blue-950/30',
  };

  return (
    <div className={`${bgColors[color] || bgColors.emerald} rounded-xl p-4 border border-gray-200/40 dark:border-gray-800/30`}>
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
