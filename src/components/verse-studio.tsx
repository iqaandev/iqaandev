'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Palette,
  Download,
  RotateCcw,
  Type,
  Maximize2,
  Check,
  ChevronDown,
  ImageIcon,
  Sparkles,
} from 'lucide-react';
import { surahs } from '@/data/surahs';

// ─── Verse Data (sample verses for demo) ─────────────────────────────────────
const POPULAR_VERSES = [
  { surahId: 1, ayah: 1, text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful.', ref: 'الفاتحة ١:١' },
  { surahId: 2, ayah: 255, text: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ', translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.', ref: 'البقرة ٢:٢٥٥' },
  { surahId: 112, ayah: 1, text: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translation: 'Say, "He is Allah, the One."', ref: 'الإخلاص ١١٢:١' },
  { surahId: 36, ayah: 1, text: 'يسٰ', translation: 'Ya Sin.', ref: 'يس ٣٦:١' },
  { surahId: 67, ayah: 1, text: 'تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ', translation: 'Blessed is He in whose hand is the dominion.', ref: 'الملك ٦٧:١' },
  { surahId: 55, ayah: 13, text: 'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ', translation: 'So which of the favors of your Lord would you deny?', ref: 'الرحمن ٥٥:١٣' },
  { surahId: 94, ayah: 6, text: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease.', ref: 'الشرح ٩٤:٦' },
  { surahId: 3, ayah: 139, text: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', translation: 'Do not lose heart or grieve, for you will have the upper hand.', ref: 'آل عمران ٣:١٣٩' },
];

const BACKGROUNDS = [
  { id: 'emerald-dark', label: 'زمردي داكن', css: 'linear-gradient(135deg, #064e3b, #065f46, #047857)' },
  { id: 'teal-ocean', label: 'بحري', css: 'linear-gradient(135deg, #0d9488, #0891b2, #0284c7)' },
  { id: 'golden', label: 'ذهبي', css: 'linear-gradient(135deg, #92400e, #b45309, #d97706)' },
  { id: 'purple-night', label: 'ليلي بنفسجي', css: 'linear-gradient(135deg, #3b0764, #581c87, #7e22ce)' },
  { id: 'rose-dawn', label: 'فجر وردي', css: 'linear-gradient(135deg, #881337, #be123c, #e11d48)' },
  { id: 'navy', label: 'أزرق داكن', css: 'linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)' },
  { id: 'warm-sand', label: 'رملي', css: 'linear-gradient(135deg, #78350f, #92400e, #a16207)' },
  { id: 'forest', label: 'غابي', css: 'linear-gradient(135deg, #14532d, #166534, #15803d)' },
  { id: 'charcoal', label: 'فحمي', css: 'linear-gradient(135deg, #1c1917, #292524, #44403c)' },
  { id: 'pure-white', label: 'أبيض', css: 'linear-gradient(135deg, #ffffff, #f8fafc, #f1f5f9)' },
  { id: 'cream', label: 'كريمي', css: 'linear-gradient(135deg, #fefce8, #fef9c3, #fef08a)' },
  { id: 'slate', label: 'رمادي', css: 'linear-gradient(135deg, #334155, #475569, #64748b)' },
];

const SIZE_PRESETS = [
  { id: 'instagram-post', label: 'إنستغرام بوست', w: 1080, h: 1080, icon: '📐' },
  { id: 'instagram-story', label: 'إنستغرام ستوري', w: 1080, h: 1920, icon: '📱' },
  { id: 'twitter', label: 'تويتر / X', w: 1200, h: 675, icon: '🐦' },
  { id: 'whatsapp', label: 'واتساب', w: 800, h: 800, icon: '💬' },
  { id: 'a4', label: 'A4 مطبوع', w: 2480, h: 3508, icon: '📄' },
];

const FONT_SIZES = [
  { id: 'small', label: 'صغير', arabic: 36, translation: 14 },
  { id: 'medium', label: 'وسط', arabic: 52, translation: 16 },
  { id: 'large', label: 'كبير', arabic: 68, translation: 18 },
  { id: 'xlarge', label: 'كبير جدًا', arabic: 84, translation: 20 },
];

// ─── Word Wrap Helper ──────────────────────────────────────────────────────────
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

interface VerseConfig {
  selectedVerse: number;
  background: string;
  size: string;
  fontSize: string;
  showTranslation: boolean;
  showReference: boolean;
  textAlign: 'center' | 'right';
  textColor: string;
  opacity: number;
}

export default function VerseStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<VerseConfig>({
    selectedVerse: 0,
    background: BACKGROUNDS[0].css,
    size: 'instagram-post',
    fontSize: 'medium',
    showTranslation: true,
    showReference: true,
    textAlign: 'center',
    textColor: '#ffffff',
    opacity: 100,
  });

  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const verse = POPULAR_VERSES[config.selectedVerse];
  const sizePreset = SIZE_PRESETS.find(s => s.id === config.size) || SIZE_PRESETS[0];
  const fontSizePreset = FONT_SIZES.find(f => f.id === config.fontSize) || FONT_SIZES[1];

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = sizePreset.w;
    const h = sizePreset.h;
    canvas.width = w;
    canvas.height = h;

    // Scale factor for display
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;

    // Draw background
    const gradientColors = config.background
      .match(/#[a-fA-F0-9]{6}/g) || ['#064e3b', '#047857'];
    
    if (gradientColors.length >= 2) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      gradientColors.forEach((color, i) => {
        grad.addColorStop(i / (gradientColors.length - 1), color);
      });
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = gradientColors[0];
    }
    ctx.fillRect(0, 0, w, h);

    // Determine text color based on background brightness
    const isLight = gradientColors.some(c => {
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 150;
    });
    const textColor = isLight ? '#1a1a2e' : '#ffffff';
    const subtextColor = isLight ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.6)';

    // Scale font size based on canvas size
    const scaleFactor = Math.min(w, h) / 1080;
    const arabicSize = Math.round(fontSizePreset.arabic * scaleFactor);
    const translationSize = Math.round(fontSizePreset.translation * scaleFactor);
    const refSize = Math.round(12 * scaleFactor);

    // Draw verse text
    ctx.textAlign = config.textAlign === 'center' ? 'center' : 'right';
    ctx.direction = 'rtl';

    const centerX = w / 2;
    const centerY = h / 2;

    // Arabic verse
    ctx.font = `bold ${arabicSize}px 'Noto Naskh Arabic', 'Amiri', serif`;
    ctx.fillStyle = textColor;
    ctx.globalAlpha = config.opacity / 100;

    // Word wrap Arabic text
    const lines = wrapText(ctx, verse.text, config.textAlign === 'center' ? w * 0.75 : w * 0.8);
    const lineHeight = arabicSize * 1.6;
    const textStartY = config.showTranslation
      ? centerY - (lines.length * lineHeight) / 2 - 20 * scaleFactor
      : centerY - (lines.length * lineHeight) / 2;

    lines.forEach((line, i) => {
      const x = config.textAlign === 'center' ? centerX : w - w * 0.1;
      ctx.fillText(line, x, textStartY + i * lineHeight);
    });

    // Translation
    if (config.showTranslation) {
      ctx.font = `${translationSize}px sans-serif`;
      ctx.fillStyle = subtextColor;
      ctx.globalAlpha = (config.opacity / 100) * 0.8;
      ctx.textAlign = config.textAlign === 'center' ? 'center' : 'right';
      ctx.direction = 'ltr';
      
      const transX = config.textAlign === 'center' ? centerX : w - w * 0.1;
      const transY = textStartY + lines.length * lineHeight + 30 * scaleFactor;
      
      // Wrap translation
      const transLines = wrapText(ctx, verse.translation, config.textAlign === 'center' ? w * 0.75 : w * 0.8);
      transLines.forEach((line, i) => {
        ctx.fillText(line, transX, transY + i * (translationSize * 1.5));
      });
    }

    // Reference
    if (config.showReference) {
      ctx.font = `${refSize}px sans-serif`;
      ctx.fillStyle = subtextColor;
      ctx.globalAlpha = (config.opacity / 100) * 0.5;
      ctx.textAlign = 'center';
      ctx.direction = 'ltr';
      ctx.fillText(verse.ref, centerX, h - 60 * scaleFactor);
    }

    // Decorative border
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2 * scaleFactor;
    const padding = 40 * scaleFactor;
    ctx.strokeRect(padding, padding, w - padding * 2, h - padding * 2);

    // Corner ornaments
    ctx.globalAlpha = 0.2;
    const ornamentSize = 30 * scaleFactor;
    const corners = [
      [padding, padding],
      [w - padding, padding],
      [padding, h - padding],
      [w - padding, h - padding],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, ornamentSize, 0, Math.PI * 2);
      ctx.stroke();
    });

    // IQAAN watermark
    ctx.globalAlpha = 0.3;
    ctx.font = `${10 * scaleFactor}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.direction = 'ltr';
    ctx.fillText('made with IQAAN', centerX, h - 25 * scaleFactor);

    ctx.globalAlpha = 1;
  }, [config, verse, sizePreset, fontSizePreset]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // ─── Export ─────────────────────────────────────────────────────────────
  const handleExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const link = document.createElement('a');
      link.download = `iqaan-verse-${verse.ref.replace(/\s/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>استوديو الآيات</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">صمّم صورة آية قرآنية</h1>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'جاري التصدير...' : 'تحميل PNG'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* ─── Controls Panel ─────────────────────────────────────────── */}
        <div className="w-80 flex-shrink-0 space-y-4">
          {/* Verse Selector */}
          <ControlPanel title="الآية">
            <div className="relative">
              <button
                onClick={() => setShowSurahPicker(!showSurahPicker)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{verse.ref}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {showSurahPicker && (
                <div className="absolute top-full mt-1 right-0 left-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-20 max-h-64 overflow-y-auto">
                  {POPULAR_VERSES.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setConfig({ ...config, selectedVerse: idx });
                        setShowSurahPicker(false);
                      }}
                      className={`w-full text-right px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        config.selectedVerse === idx ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="font-semibold">{v.ref}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{v.text.slice(0, 50)}...</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 px-1" dir="rtl">{verse.text}</p>
          </ControlPanel>

          {/* Background */}
          <ControlPanel title="الخلفية">
            <div className="grid grid-cols-6 gap-1.5">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setConfig({ ...config, background: bg.css })}
                  className={`w-full aspect-square rounded-lg transition-all ${
                    config.background === bg.css ? 'ring-2 ring-emerald-500 ring-offset-2' : 'hover:scale-105'
                  }`}
                  style={{ background: bg.css }}
                  title={bg.label}
                />
              ))}
            </div>
          </ControlPanel>

          {/* Size */}
          <ControlPanel title="الحجم">
            <div className="grid grid-cols-2 gap-1.5">
              {SIZE_PRESETS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setConfig({ ...config, size: s.id })}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                    config.size === s.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </ControlPanel>

          {/* Typography */}
          <ControlPanel title="الخط">
            <div className="grid grid-cols-4 gap-1.5">
              {FONT_SIZES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setConfig({ ...config, fontSize: f.id })}
                  className={`px-2 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                    config.fontSize === f.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </ControlPanel>

          {/* Options */}
          <ControlPanel title="خيارات">
            <div className="space-y-2">
              {[
                { key: 'showTranslation' as const, label: 'إظهار الترجمة' },
                { key: 'showReference' as const, label: 'إظهار المرجع' },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 cursor-pointer">
                  <span className="text-xs text-gray-700 dark:text-gray-300">{opt.label}</span>
                  <div
                    className={`w-8 h-4 rounded-full transition-colors relative ${
                      config[opt.key] ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${
                        config[opt.key] ? 'right-0.5' : 'right-[14px]'
                      }`}
                    />
                    <input
                      type="checkbox"
                      checked={config[opt.key]}
                      onChange={(e) => setConfig({ ...config, [opt.key]: e.target.checked })}
                      className="sr-only"
                    />
                  </div>
                </label>
              ))}

              {/* Alignment */}
              <div className="flex gap-1.5 px-1">
                <button
                  onClick={() => setConfig({ ...config, textAlign: 'center' })}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                    config.textAlign === 'center'
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  توسيط
                </button>
                <button
                  onClick={() => setConfig({ ...config, textAlign: 'right' })}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                    config.textAlign === 'right'
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  محاذاة لليمين
                </button>
              </div>

              {/* Opacity */}
              <div className="px-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-600 dark:text-gray-400">الشفافية</span>
                  <span className="text-[11px] text-muted-foreground font-mono">{config.opacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={config.opacity}
                  onChange={(e) => setConfig({ ...config, opacity: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </ControlPanel>
        </div>

        {/* ─── Canvas Preview ──────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> المعاينة
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {sizePreset.w} × {sizePreset.h}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-4 shadow-sm flex items-center justify-center" style={{ minHeight: 'calc(100vh - 180px)' }}>
              <canvas
                ref={canvasRef}
                className="rounded-lg shadow-2xl max-w-full max-h-[70vh]"
                style={{
                  aspectRatio: `${sizePreset.w} / ${sizePreset.h}`,
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Control Panel ──────────────────────────────────────────────────
function ControlPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-4 shadow-sm">
      <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}
