'use client';

import { useState } from 'react';
import Navbar, { type ActivePage } from '@/components/iqaan-navbar';
import LandingPage from '@/components/landing-page';
import BioLinkEditor from '@/components/bio-link-editor';
import VerseStudio from '@/components/verse-studio';
import HifzCompanion from '@/components/hifz-companion';

export default function Home() {
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage onNavigate={setActivePage} />;
      case 'bio-link':
        return <BioLinkEditor />;
      case 'verse-studio':
        return <VerseStudio />;
      case 'hifz':
        return <HifzCompanion />;
      default:
        return <LandingPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
        isDark={isDark}
        onToggleDark={toggleDark}
      />
      <main>{renderPage()}</main>
    </div>
  );
}
