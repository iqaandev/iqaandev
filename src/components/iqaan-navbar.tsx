'use client';

import { useState, useEffect } from 'react';
import {
  Link2,
  Palette,
  BookHeart,
  Menu,
  X,
  Moon,
  Sun,
  Zap,
  Sparkles,
} from 'lucide-react';

export type ActivePage = 'landing' | 'bio-link' | 'verse-studio' | 'hifz';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Navbar({ activePage, onNavigate, isDark, onToggleDark }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navItems: { key: ActivePage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'bio-link', label: 'بايو لينك', icon: <Link2 className="w-4 h-4" /> },
    { key: 'verse-studio', label: 'استوديو الآيات', icon: <Palette className="w-4 h-4" /> },
    { key: 'hifz', label: 'مراجعة الحفظ', icon: <BookHeart className="w-4 h-4" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-sm border-b border-gray-200/60 dark:border-gray-800/60'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/40 dark:border-gray-800/40'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 flex-shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-none tracking-tight text-gray-900 dark:text-white">
              IQ<span className="text-emerald-600 dark:text-emerald-400">A</span>AN
            </span>
            <span className="text-[9px] text-muted-foreground font-medium tracking-wider">TOOLS FOR MUSLIMS</span>
          </div>
        </button>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/60 rounded-xl p-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activePage === item.key
                  ? 'bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            aria-label="تبديل المظهر"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-emerald-600/20"
          >
            <Zap className="w-3.5 h-3.5" />
            احجز الآن
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-900 px-4 py-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activePage === item.key
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full mr-auto">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
