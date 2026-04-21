'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Code2,
  Copy,
  Check,
  Link2,
  Clock,
  Compass,
  BookOpen,
  User,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { calculatePrayerTimes, getPrayerList, type PrayerTimes } from '@/lib/prayer-times';
import { calculateQibla, requestGeolocation, type QiblaResult } from '@/lib/qibla';

interface BioLink {
  links: { title: string; url: string; icon: string }[];
  showPrayerTimes: boolean;
  showQibla: boolean;
  showDailyVerse: boolean;
  theme: string;
  name: string;
  bio: string;
  emoji: string;
}

const THEMES = [
  { id: 'emerald', label: 'زمردي', primary: '#059669', bg: 'from-emerald-500 to-teal-600' },
  { id: 'blue', label: 'أزرق', primary: '#2563eb', bg: 'from-blue-500 to-indigo-600' },
  { id: 'purple', label: 'بنفسجي', primary: '#7c3aed', bg: 'from-violet-500 to-purple-600' },
  { id: 'amber', label: 'عنبري', primary: '#d97706', bg: 'from-amber-500 to-orange-600' },
  { id: 'rose', label: 'وردي', primary: '#e11d48', bg: 'from-rose-500 to-pink-600' },
  { id: 'slate', label: 'رمادي', primary: '#475569', bg: 'from-slate-500 to-gray-700' },
];

const LINK_ICONS = ['🔗', '📱', '💬', '🎵', '📺', '🛒', '📧', '🌍', '📸', '🎓', '💼', '❤️'];
const EMOJIS = ['👤', '🧑‍💼', '👩‍🏫', '🧕', '👨‍💼', '🕌', '📖', '🤲', '🌙', '⭐'];

const DAILY_VERSES = [
  { text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', ref: 'الفاتحة ١:١' },
  { text: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', ref: 'الشرح ٦:٦' },
  { text: 'وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُ', ref: 'الطلاق ٣:٣' },
  { text: 'فَاذْكُرُونِيٓ أَذْكُرْكُمْ', ref: 'البقرة ٢:١٥٢' },
  { text: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', ref: 'الضحى ٥:٥' },
];

interface BioLinkPreviewProps {
  bioLink: BioLink;
  activeTheme: (typeof THEMES)[0];
  prayers: ReturnType<typeof getPrayerList>;
  prayerTimes: PrayerTimes | null;
  qibla: QiblaResult | null;
}

function BioLinkPreview({ bioLink, activeTheme, prayers, qibla }: BioLinkPreviewProps) {
  const dailyVerse = DAILY_VERSES[new Date().getDate() % DAILY_VERSES.length];
  return (
    <div className="min-h-full bg-gray-100 dark:bg-gray-950 flex items-start justify-center py-6 px-4">
      <div className="w-full max-w-sm">
        {/* Phone Frame */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className={`bg-gradient-to-l ${activeTheme.bg} px-6 pt-8 pb-6 text-center text-white`}>
            <div className="text-5xl mb-3">{bioLink.emoji}</div>
            <h2 className="text-xl font-bold">{bioLink.name}</h2>
            <p className="text-sm opacity-80 mt-1">{bioLink.bio}</p>
          </div>
          {/* Prayer Times Widget */}
          {bioLink.showPrayerTimes && prayers.length > 0 && (
            <div className="px-4 -mt-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> أوقات الصلاة
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {prayers.map((p) => (
                    <div
                      key={p.name}
                      className={`text-center px-2 py-1.5 rounded-lg text-[10px] ${
                        p.isActive
                          ? 'text-white font-bold'
                          : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                      }`}
                      style={p.isActive ? { backgroundColor: activeTheme.primary } : undefined}
                    >
                      <p className="font-medium">{p.name}</p>
                      <p className="font-mono text-[9px]">{p.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="px-4 py-3 space-y-2">
            {/* Qibla Widget */}
            {bioLink.showQibla && qibla && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center gap-1">
                  <Compass className="w-3 h-3" /> اتجاه القبلة
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: activeTheme.primary + '20' }}>
                    🕋
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: activeTheme.primary }}>{qibla.degrees}°</p>
                    <p className="text-[10px] text-muted-foreground">{qibla.direction}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Daily Verse Widget */}
            {bioLink.showDailyVerse && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> آية اليوم
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed" dir="rtl">
                  {dailyVerse.text}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">{dailyVerse.ref}</p>
              </div>
            )}
            {/* Links */}
            {bioLink.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{link.title}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </a>
            ))}
          </div>
          {/* Footer */}
          <div className="text-center pb-4">
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> صنع بـ IQAAN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BioLinkEditor() {
  const [bioLink, setBioLink] = useState<BioLink>({
    links: [
      { title: 'تويتر', url: 'https://twitter.com', icon: '💬' },
      { title: 'إنستغرام', url: 'https://instagram.com', icon: '📸' },
    ],
    showPrayerTimes: true,
    showQibla: true,
    showDailyVerse: true,
    theme: 'emerald',
    name: 'أحمد محمد',
    bio: 'مسلم • مبرمج • محب للقرآن',
    emoji: '👤',
  });

  const [view, setView] = useState<'edit' | 'preview'>('split');
  const [copied, setCopied] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [qibla, setQibla] = useState<QiblaResult | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [iconPickerFor, setIconPickerFor] = useState<number | null>(null);

  useEffect(() => {
    // Get user location for prayer times and qibla
    requestGeolocation()
      .then((pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setPrayerTimes(calculatePrayerTimes(latitude, longitude));
        setQibla(calculateQibla(latitude, longitude));
      })
      .catch(() => {
        // Fallback: Cairo
        const lat = 30.0444, lng = 31.2357;
        setLocation({ lat, lng });
        setPrayerTimes(calculatePrayerTimes(lat, lng));
        setQibla(calculateQibla(lat, lng));
      });
  }, []);

  const activeTheme = THEMES.find(t => t.id === bioLink.theme) || THEMES[0];
  const dailyVerse = DAILY_VERSES[new Date().getDate() % DAILY_VERSES.length];
  const prayers = prayerTimes ? getPrayerList(prayerTimes) : [];

  const addLink = () => {
    setBioLink({
      ...bioLink,
      links: [...bioLink.links, { title: 'رابط جديد', url: 'https://', icon: '🔗' }],
    });
  };

  const removeLink = (idx: number) => {
    setBioLink({ ...bioLink, links: bioLink.links.filter((_, i) => i !== idx) });
  };

  const updateLink = (idx: number, field: keyof BioLink['links'][0], value: string) => {
    const links = [...bioLink.links];
    links[idx] = { ...links[idx], [field]: value };
    setBioLink({ ...bioLink, links });
  };

  const copyCode = () => {
    const code = `<!-- IQAAN Bio Link -->\n<a href="https://iqaan.com/username">iqaan.com/username</a>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link2 className="w-3.5 h-3.5" />
            <span>بايو لينك إسلامي</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">محرر البايو لينك</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'تم النسخ!' : 'نسخ الرابط'}
          </button>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setView('split')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                view === 'split' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('edit')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                view === 'edit' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ─── Editor Panel ──────────────────────────────────────────────── */}
        <div className={`${view === 'preview' ? 'hidden' : ''} ${view === 'split' ? 'w-1/2 min-w-0' : 'w-full'}`}>
          <div className="space-y-5">
            {/* Profile Section */}
            <Section title="الملف الشخصي">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <button
                    onClick={() => setEmojiPicker(!emojiPicker)}
                    className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {bioLink.emoji}
                  </button>
                  {emojiPicker && (
                    <div className="absolute top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 grid grid-cols-5 gap-1 z-10">
                      {EMOJIS.map((e) => (
                        <button
                          key={e}
                          onClick={() => {
                            setBioLink({ ...bioLink, emoji: e });
                            setEmojiPicker(false);
                          }}
                          className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-lg flex items-center justify-center"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    value={bioLink.name}
                    onChange={(e) => setBioLink({ ...bioLink, name: e.target.value })}
                    placeholder="الاسم"
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 text-sm focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                  />
                  <input
                    value={bioLink.bio}
                    onChange={(e) => setBioLink({ ...bioLink, bio: e.target.value })}
                    placeholder="نبذة عنك"
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 text-sm focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                  />
                </div>
              </div>
            </Section>

            {/* Theme */}
            <Section title="الثيم">
              <div className="grid grid-cols-6 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setBioLink({ ...bioLink, theme: theme.id })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
                      bioLink.theme === theme.id
                        ? 'bg-gray-100 dark:bg-gray-800 ring-2 ring-emerald-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.bg}`} />
                    <span className="text-[9px] text-muted-foreground">{theme.label}</span>
                  </button>
                ))}
              </div>
            </Section>

            {/* Widgets */}
            <Section title="الحاجيات">
              <div className="space-y-2">
                {[
                  { key: 'showPrayerTimes' as const, label: 'أوقات الصلاة', desc: 'يعرض تلقائيًا حسب موقعك', icon: <Clock className="w-4 h-4" /> },
                  { key: 'showQibla' as const, label: 'اتجاه القبلة', desc: 'بوصلة رقمية بالدرجات', icon: <Compass className="w-4 h-4" /> },
                  { key: 'showDailyVerse' as const, label: 'آية اليوم', desc: 'آية قرآنية تتغير يوميًا', icon: <BookOpen className="w-4 h-4" /> },
                ].map((widget) => (
                  <label
                    key={widget.key}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-muted-foreground">{widget.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{widget.label}</p>
                      <p className="text-[10px] text-muted-foreground">{widget.desc}</p>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        bioLink[widget.key] ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          bioLink[widget.key] ? 'right-0.5' : 'right-[18px]'
                        }`}
                      />
                      <input
                        type="checkbox"
                        checked={bioLink[widget.key]}
                        onChange={(e) => setBioLink({ ...bioLink, [widget.key]: e.target.checked })}
                        className="sr-only"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </Section>

            {/* Links */}
            <Section title="الروابط">
              <div className="space-y-2">
                {bioLink.links.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-grab" />
                    <div className="relative">
                      <button
                        onClick={() => setIconPickerFor(iconPickerFor === idx ? null : idx)}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-sm shadow-sm border border-gray-200 dark:border-gray-600"
                      >
                        {link.icon}
                      </button>
                      {iconPickerFor === idx && (
                        <div className="absolute top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1.5 grid grid-cols-6 gap-0.5 z-10">
                          {LINK_ICONS.map((icon) => (
                            <button
                              key={icon}
                              onClick={() => {
                                updateLink(idx, 'icon', icon);
                                setIconPickerFor(null);
                              }}
                              className="w-7 h-7 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-base flex items-center justify-center"
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      value={link.title}
                      onChange={(e) => updateLink(idx, 'title', e.target.value)}
                      placeholder="العنوان"
                      className="w-20 px-2 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs focus:ring-1 focus:ring-emerald-500/40 focus:outline-none"
                    />
                    <input
                      value={link.url}
                      onChange={(e) => updateLink(idx, 'url', e.target.value)}
                      placeholder="الرابط"
                      className="flex-1 min-w-0 px-2 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs focus:ring-1 focus:ring-emerald-500/40 focus:outline-none font-mono"
                      dir="ltr"
                    />
                    <button
                      onClick={() => removeLink(idx)}
                      className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-xs font-medium text-muted-foreground hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة رابط
                </button>
              </div>
            </Section>
          </div>
        </div>

        {/* ─── Preview Panel ─────────────────────────────────────────────── */}
        <div className={`${view === 'edit' ? 'hidden' : ''} ${view === 'split' ? 'w-1/2 min-w-0' : 'w-full'}`}>
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Eye className="w-3 h-3" /> معاينة مباشرة
              </p>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                مباشر
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm" style={{ height: 'calc(100vh - 140px)' }}>
              <BioLinkPreview bioLink={bioLink} activeTheme={activeTheme} prayers={prayers} prayerTimes={prayerTimes} qibla={qibla} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Section ────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-4 shadow-sm">
      <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 text-emerald-500" />
        {title}
      </h3>
      {children}
    </div>
  );
}
