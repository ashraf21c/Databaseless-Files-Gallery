/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, ShieldCheck, FileText, Globe } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { HERO_IMAGE_URL } from '../utils/sampleData';

interface HeroSectionProps {
  language: Language;
  totalDocs: number;
  totalFolders: number;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  totalDocs,
  totalFolders,
  onExploreClick,
}) => {
  const t = translations[language];

  return (
    <section className="relative overflow-hidden border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/40">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-medium">
              <span>VOL. XXVI</span>
              <span className="mx-2">·</span>
              <span>CENTRAL ARCHIVE</span>
              <span className="mx-2">·</span>
              <span>DATABASELESS SPECIFICATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-50 leading-[1.15] text-balance">
              {t.brandTitle} — {t.brandTagline}
            </h1>

            <p className="text-base text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
              Curated central gallery for PDF documents, folios, architectural monographs, and exhibition catalogs. Built entirely without databases: utilizing portable flat schemas, cryptographic SHA-256 admin governance, and full EXIF metadata retention.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer"
              >
                {t.allAlbums} ({totalFolders})
              </button>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                <span>{totalDocs} {t.itemsCount}</span>
                <span className="mx-2">·</span>
                <span>{totalFolders} {t.foldersCount}</span>
              </div>
            </div>
          </div>

          {/* Focal Curatorial Image Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm bg-stone-200 dark:bg-stone-800 aspect-16/10">
              <img
                src={HERO_IMAGE_URL}
                alt="Curatorial archive research table"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                <p className="text-xs text-stone-200 font-serif italic">
                  Fig. 1 — Archival examination folio with preserved vector plates and metadata records.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Operational Utility Ribbon */}
        <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-stone-500 shrink-0" />
            <div>
              <span className="font-semibold block text-stone-800 dark:text-stone-200">Databaseless Core</span>
              <span className="text-[11px] text-stone-500">YAML / Flat-file storage</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0" />
            <div>
              <span className="font-semibold block text-stone-800 dark:text-stone-200">Encrypted Pass</span>
              <span className="text-[11px] text-stone-500">Salted SHA-256 Web Crypto</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-stone-500 shrink-0" />
            <div>
              <span className="font-semibold block text-stone-800 dark:text-stone-200">EXIF Governance</span>
              <span className="text-[11px] text-stone-500">Selective front-end reveals</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-stone-500 shrink-0" />
            <div>
              <span className="font-semibold block text-stone-800 dark:text-stone-200">RTL & Multilingual</span>
              <span className="text-[11px] text-stone-500">Arabic, Japanese, English</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
