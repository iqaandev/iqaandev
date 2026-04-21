'use client';

import { Link2, Palette, BookHeart, ArrowLeft, Check, Star, Zap } from 'lucide-react';
import type { ActivePage } from './iqaan-navbar';

interface LandingPageProps {
  onNavigate: (page: ActivePage) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const products = [
    {
      key: 'bio-link' as ActivePage,
      icon: <Link2 className="w-7 h-7" />,
      title: 'بايو لينك إسلامي',
      subtitle: 'Linktree للمسلمين',
      description: 'أنشئ صفحة بايو احترافية مع أوقات الصلاة، اتجاه القبلة، آية اليوم، والمزيد — بالكامل مجانًا.',
      gradient: 'from-emerald-500 to-teal-500',
      features: ['أوقات الصلاة تلقائية', 'بوصلة القبلة', 'آية اليوم', 'تخصيص الألوان والثيمات', 'دعم الدومين المخصص'],
      cta: 'ابدأ مجانًا',
    },
    {
      key: 'verse-studio' as ActivePage,
      icon: <Palette className="w-7 h-7" />,
      title: 'استوديو الآيات',
      subtitle: 'صمم صور آيات قرآنية',
      description: 'اختر آية، خصص الخط والخلفية، ثم حمّلها بصيغ متعددة — مثالية للسوشيال ميديا والمنشورات.',
      gradient: 'from-amber-500 to-orange-500',
      features: ['مئات الآيات جاهزة', 'تصاميم احترافية', 'أحجام متعددة (إنستغرام، تويتر)', 'تصدير PNG عالي الجودة', 'بدون علامة مائية'],
      cta: 'صمّم الآن',
    },
    {
      key: 'hifz' as ActivePage,
      icon: <BookHeart className="w-7 h-7" />,
      title: 'مراجعة الحفظ',
      subtitle: 'نظام تكرار مباعد ذكي',
      description: 'تتبع حفظك للقرآن بخوارزمية SM-2، راجع الآيات المستحقة، واصل سلسلة المراجعة اليومية.',
      gradient: 'from-violet-500 to-purple-500',
      features: ['خوارزمية SM-2 علمية', 'تتبع التقدم بالتفصيل', 'سلسلة المراجعة اليومية', 'وضع المراجعة السريعة', 'احفظ بياناتك محليًا'],
      cta: 'ابدأ المراجعة',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-gray-950" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-200/30 to-transparent dark:from-emerald-900/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50">
            <Zap className="w-3 h-3" />
            <span>منصة أدوات مجانية للمسلمين</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            كل ما يحتاجه المسلم
            <br />
            <span className="bg-gradient-to-l from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              في مكان واحد
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            أدوات مجانية 100% تعمل مباشرة في المتصفح — بايو لينك إسلامي، تصميم آيات قرآنية، ومراجعة حفظ ذكية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('bio-link')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
            >
              <Star className="w-4 h-4" />
              ابدأ مجانًا
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              اكتشف الأدوات
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {[
              { value: '١٠٠%', label: 'مجاني' },
              { value: '٠', label: 'تسجيل مطلوب' },
              { value: '٣', label: 'أدوات قوية' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
            ثلاث أدوات، منصة واحدة
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            اختر الأداة المناسبة لك — كلها تعمل مباشرة في المتصفح بدون تسجيل
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.key}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate(product.key)}
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-l ${product.gradient}`} />

              <div className="p-6">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                  {product.icon}
                </div>

                {/* Title */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-2.5 rounded-xl bg-gradient-to-l ${product.gradient} text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm`}
                >
                  {product.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-l from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">كل شيء مجاني — الآن وإلى الأبد</h2>
          <p className="text-emerald-100 text-sm max-w-lg mx-auto mb-6">
            نؤمن بأن الأدوات الإسلامية يجب أن تكون متاحة للجميع. لا إعلانات مزعجة، لا اشتراكات مخفية — فقط أدوات نظيفة تساعدك في عبادتك.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-emerald-100">
            {['بدون تسجيل', 'بدون إعلانات', 'بدون تتبع'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 dark:border-gray-800/60 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-white" />
            </div>
            <span>IQAAN — أدوات مجانية للمسلمين</span>
          </div>
          <span>صنع بحب للمسلمين في كل مكان</span>
        </div>
      </footer>
    </div>
  );
}
