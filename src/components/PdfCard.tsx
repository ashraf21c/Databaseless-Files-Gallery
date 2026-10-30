/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, ExternalLink, Download, Lock, Calendar, BookOpen, Layers } from 'lucide-react';
import { ExifDisplaySettings, Language, PdfFolder, PdfItem } from '../types';
import { translations } from '../utils/translations';

interface PdfCardProps {
  item: PdfItem;
  folder?: PdfFolder;
  language: Language;
  exifSettings: ExifDisplaySettings;
  onViewInline: (item: PdfItem) => void;
  onOpenNewTab: (item: PdfItem) => void;
  onDownload: (item: PdfItem) => void;
}

export const PdfCard: React.FC<PdfCardProps> = ({
  item,
  folder,
  language,
  exifSettings,
  onViewInline,
  onOpenNewTab,
  onDownload,
}) => {
  const t = translations[language];

  // Download permission logic:
  // Allowed if folder allows it AND item allows it
  const isDownloadAllowed = (folder ? folder.allowDownload : true) && item.allowDownload;

  const fileSizeMb = (item.fileSize / (1024 * 1024)).toFixed(2);
  const folderName = folder?.nameTranslations?.[language] || folder?.name || 'Archive';

  return (
    <article className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden flex flex-col transition-all hover:border-stone-300 dark:hover:border-stone-700 shadow-2xs hover:shadow-sm">
      
      {/* Thumbnail Container */}
      <div 
        onClick={() => onViewInline(item)}
        className="relative h-56 bg-stone-100 dark:bg-stone-950/60 overflow-hidden cursor-pointer flex items-center justify-center p-4 border-b border-stone-100 dark:border-stone-800/80"
      >
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.exif.title || item.name}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain rounded-xs shadow-xs group-hover:scale-[1.02] transition-transform duration-300"
            onError={(e) => {
              // Hide broken image gracefully
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
            <BookOpen className="w-8 h-8 mb-2 stroke-[1.5]" />
            <span className="text-xs font-serif">PDF Document</span>
          </div>
        )}

        {/* Hover Quick Overlay */}
        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewInline(item);
            }}
            className="px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded shadow-md flex items-center gap-1.5 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.viewInline}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenNewTab(item);
            }}
            className="p-1.5 bg-white/90 text-stone-900 rounded shadow-md hover:bg-white transition-colors cursor-pointer"
            title={t.openNewTab}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Download Restriction Indicator if disabled */}
        {!isDownloadAllowed && (
          <div className="absolute top-2.5 end-2.5 bg-stone-900/80 text-stone-200 text-[10px] px-2 py-0.5 rounded-sm flex items-center gap-1 backdrop-blur-xs">
            <Lock className="w-2.5 h-2.5 text-stone-300" />
            <span>{t.downloadDisabled}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed Metadata: Folder & Page count */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[200px]">
              {folderName}
            </span>
            {exifSettings.showPageCount && item.exif.pageCount && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{item.exif.pageCount} {t.pages}</span>
              </>
            )}
            {exifSettings.showFileSize && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{fileSizeMb} MB</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2
            onClick={() => onViewInline(item)}
            className="text-base font-serif font-medium text-stone-900 dark:text-stone-100 leading-snug hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer"
          >
            {exifSettings.showTitle && item.exif.title ? item.exif.title : item.name}
          </h2>

          {/* Author metadata (if enabled in EXIF governance) */}
          {exifSettings.showAuthor && item.exif.author && (
            <div className="text-xs text-stone-600 dark:text-stone-300 mt-1">
              <span>{item.exif.author}</span>
            </div>
          )}

          {/* Summary / Abstract */}
          {item.summary && (
            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-2 leading-relaxed">
              {item.summary}
            </p>
          )}

          {/* EXIF Selective Attributes (Subject, Date, Dimensions) */}
          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
            {exifSettings.showCreationDate && item.exif.creationDate && (
              <div className="flex items-center justify-between">
                <span>{t.fieldCreationDate}:</span>
                <span className="font-mono tabular-nums text-stone-700 dark:text-stone-300">{item.exif.creationDate}</span>
              </div>
            )}
            {exifSettings.showDimensions && item.exif.dimensions && (
              <div className="flex items-center justify-between">
                <span>{t.fieldDimensions}:</span>
                <span className="text-stone-700 dark:text-stone-300">{item.exif.dimensions}</span>
              </div>
            )}
            {exifSettings.showPdfVersion && item.exif.pdfVersion && (
              <div className="flex items-center justify-between">
                <span>{t.fieldPdfVersion}:</span>
                <span className="font-mono text-stone-700 dark:text-stone-300">{item.exif.pdfVersion}</span>
              </div>
            )}
          </div>

          {/* Tags (clean unboxed representation with #) */}
          {exifSettings.showKeywords && item.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-stone-400 dark:text-stone-500">
              {item.tags.map(tag => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Card Action Footer */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewInline(item)}
              className="text-xs font-medium text-stone-800 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.viewInline}</span>
            </button>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <button
              onClick={() => onOpenNewTab(item)}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
              title={t.openNewTab}
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Download Button or Disabled indicator */}
          {isDownloadAllowed ? (
            <button
              onClick={() => onDownload(item)}
              className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer"
              title={t.downloadPdf}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span
              className="text-[11px] text-stone-400 dark:text-stone-500 flex items-center gap-1 cursor-not-allowed select-none"
              title={t.downloadDisabledTip}
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">{t.downloadDisabled}</span>
            </span>
          )}
        </div>

      </div>

    </article>
  );
};
