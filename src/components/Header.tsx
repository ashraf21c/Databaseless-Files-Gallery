/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, Unlock, Globe, Moon, Sun, Layers, Rss } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onScrollToCollections: () => void;
  onScrollToExifRules: () => void;
  onOpenPhpGuide: () => void;
  onDownloadRss?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isAdmin,
  onOpenAdmin,
  onLogoutAdmin,
  darkMode,
  onToggleDarkMode,
  onScrollToCollections,
  onScrollToExifRules,
  onOpenPhpGuide,
  onDownloadRss,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label={`${t.brandTitle} — ${t.brandTagline}`}
            className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-serif whitespace-nowrap hover:text-stone-700 dark:hover:text-stone-300 transition-colors focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
          >
            {t.brandTitle}
          </a>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav aria-label={t.mainNavigation} className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={onScrollToCollections}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
          >
            {t.allAlbums}
          </button>
          <button
            onClick={onScrollToExifRules}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
          >
            {t.tabExif}
          </button>
          <button
            onClick={onOpenPhpGuide}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
          >
            {t.phpGuideTitle}
          </button>
          {onDownloadRss && (
            <button
              onClick={onDownloadRss}
              className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-mono text-xs text-amber-700 dark:text-amber-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded"
              title={t.downloadRssFeed}
              aria-label={t.downloadRssFeed}
            >
              <Rss className="w-3 h-3 text-amber-600 dark:text-amber-500" aria-hidden="true" />
              <span>{t.rssFeedName}</span>
            </button>
          )}
          <span className="text-xs text-stone-400 dark:text-stone-600 select-none" aria-hidden="true">·</span>
          <span className="text-xs text-stone-500 dark:text-stone-400 whitespace-nowrap">
            {t.standaloneNote}
          </span>
        </nav>

        {/* Zone 3: Language selector + Theme + Admin portal CTA */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Language Switcher */}
          <div role="group" aria-label={t.selectLanguage} className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-md p-1 border border-stone-200 dark:border-stone-700">
            <Globe className="w-3.5 h-3.5 text-stone-500 mx-1.5 shrink-0" aria-hidden="true" />
            <button
              onClick={() => onLanguageChange('en')}
              aria-pressed={language === 'en'}
              aria-label="English"
              className={`px-2 py-1 text-xs font-medium rounded transition-colors focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none ${
                language === 'en'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="English (LTR)"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('ar')}
              aria-pressed={language === 'ar'}
              aria-label="العربية"
              className={`px-2 py-1 text-xs font-medium rounded transition-colors focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none ${
                language === 'ar'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="العربية (RTL)"
            >
              عربي
            </button>
            <button
              onClick={() => onLanguageChange('ja')}
              aria-pressed={language === 'ja'}
              aria-label="日本語"
              className={`px-2 py-1 text-xs font-medium rounded transition-colors focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none ${
                language === 'ja'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="日本語"
            >
              日本語
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
            aria-label={darkMode ? t.themeToggleLight : t.themeToggleDark}
            title={darkMode ? t.themeToggleLight : t.themeToggleDark}
          >
            {darkMode ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
          </button>

          {/* Admin Button */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAdmin}
                aria-label={t.adminDashboardTitle}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-md shadow-xs transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
              >
                <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.adminDashboardTitle}</span>
              </button>
              <button
                onClick={onLogoutAdmin}
                className="p-2 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
                title={t.adminLogout}
                aria-label={t.adminLogout}
              >
                {t.adminLogout}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              aria-label={t.adminPortal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors whitespace-nowrap border border-stone-200 dark:border-stone-700 focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.adminPortal}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
