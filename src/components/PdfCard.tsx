/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Eye,
  ExternalLink,
  Download,
  Lock,
  BookOpen,
  Video,
  FileSpreadsheet,
  Image as ImageIcon,
  Presentation,
  Play
} from 'lucide-react';
import { ExifDisplaySettings, Language, MediaItem, PdfFolder } from '../types';
import { translations } from '../utils/translations';

interface PdfCardProps {
  item: MediaItem;
  folder?: PdfFolder;
  language: Language;
  exifSettings: ExifDisplaySettings;
  onViewInline: (item: MediaItem) => void;
  onOpenNewTab: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  onDownloadPowerpoint?: (item: MediaItem) => void;
}

export const PdfCard: React.FC<PdfCardProps> = ({
  item,
  folder,
  language,
  exifSettings,
  onViewInline,
  onOpenNewTab,
  onDownload,
  onDownloadPowerpoint,
}) => {
  const t = translations[language];

  const isDownloadAllowed = (folder ? folder.allowDownload : true) && item.allowDownload;
  const isPptDownloadAllowed = isDownloadAllowed && (item.allowPowerpointDownload !== false);

  const fileSizeMb = (item.fileSize / (1024 * 1024)).toFixed(2);
  const folderName = folder?.nameTranslations?.[language] || folder?.name || 'Archive';

  const isVideo = item.fileType === 'video';
  const isPresentation = item.fileType === 'presentation';
  const isWord = item.fileType === 'word';
  const isImage = item.fileType === 'image';

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
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
            {isVideo ? (
              <Video className="w-8 h-8 mb-2 stroke-[1.5]" />
            ) : isPresentation ? (
              <Presentation className="w-8 h-8 mb-2 stroke-[1.5] text-amber-500" />
            ) : isWord ? (
              <FileSpreadsheet className="w-8 h-8 mb-2 stroke-[1.5]" />
            ) : isImage ? (
              <ImageIcon className="w-8 h-8 mb-2 stroke-[1.5]" />
            ) : (
              <BookOpen className="w-8 h-8 mb-2 stroke-[1.5]" />
            )}
            <span className="text-xs font-serif uppercase tracking-wider">{item.fileType}</span>
          </div>
        )}

        {/* Media Type Indicator */}
        <div className="absolute top-2.5 start-2.5 bg-stone-900/80 text-stone-100 text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm flex items-center gap-1 backdrop-blur-xs">
          {isVideo && <Play className="w-2.5 h-2.5 fill-current" />}
          {isPresentation && <Presentation className="w-2.5 h-2.5 text-amber-400" />}
          {isWord && <FileSpreadsheet className="w-2.5 h-2.5 text-blue-400" />}
          {isImage && <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />}
          {!isVideo && !isPresentation && !isWord && !isImage && <BookOpen className="w-2.5 h-2.5 text-amber-400" />}
          <span>{item.fileType}</span>
        </div>

        {/* Hover Quick Overlay */}
        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewInline(item);
            }}
            aria-label={`${t.viewInline}: ${item.exif.title || item.name}`}
            className="px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded shadow-md flex items-center gap-1.5 hover:bg-stone-100 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:outline-none"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.viewInline}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenNewTab(item);
            }}
            className="p-1.5 bg-white/90 text-stone-900 rounded shadow-md hover:bg-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:outline-none"
            title={t.openNewTab}
            aria-label={`${t.openNewTab}: ${item.exif.title || item.name}`}
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Download Restriction Indicator if disabled */}
        {!isDownloadAllowed && (
          <div className="absolute top-2.5 end-2.5 bg-stone-900/80 text-stone-200 text-[10px] px-2 py-0.5 rounded-sm flex items-center gap-1 backdrop-blur-xs">
            <Lock className="w-2.5 h-2.5 text-stone-300" aria-label={t.downloadDisabled} />
            <span>{t.downloadDisabled}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed Metadata: Folder & Format specifics */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[180px]">
              {folderName}
            </span>
            
            {/* Video duration or Word count or PDF page count */}
            {isVideo && item.exif.videoDuration && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-stone-700 dark:text-stone-300">{item.exif.videoDuration}</span>
              </>
            )}

            {isWord && item.exif.wordCount && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{item.exif.wordCount.toLocaleString()} {t.words}</span>
              </>
            )}

            {!isVideo && !isWord && exifSettings.showPageCount && item.exif.pageCount && (
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
          <h2 className="text-base font-serif font-medium text-stone-900 dark:text-stone-100 leading-snug">
            <button
              onClick={() => onViewInline(item)}
              className="text-start hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
            >
              {exifSettings.showTitle && item.exif.title ? item.exif.title : item.name}
            </button>
          </h2>

          {/* Author / Presenter */}
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

          {/* Specific highlight for Video dual download presentation link */}
          {isVideo && item.powerpointFileName && (
            <div className="mt-3 p-2 bg-stone-50 dark:bg-stone-800/60 rounded border border-stone-200 dark:border-stone-700/80 text-[11px] text-stone-600 dark:text-stone-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <Presentation className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.powerpointFileName}</span>
              </div>
              {isPptDownloadAllowed && onDownloadPowerpoint && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadPowerpoint(item);
                  }}
                  className="ms-2 px-1.5 py-0.5 text-[10px] bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded text-stone-700 dark:text-stone-200 hover:bg-stone-100 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  title={t.downloadPowerpoint}
                  aria-label={`${t.downloadPowerpoint}: ${item.powerpointFileName}`}
                >
                  PPTX ↓
                </button>
              )}
            </div>
          )}

          {/* EXIF Selective Attributes */}
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
            {isVideo && item.exif.videoCodec && (
              <div className="flex items-center justify-between">
                <span>Codec:</span>
                <span className="font-mono text-stone-700 dark:text-stone-300 text-[10px]">{item.exif.videoCodec}</span>
              </div>
            )}
          </div>

          {/* Tags (clean unboxed representation) */}
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
              aria-label={`${t.viewInline}: ${item.exif.title || item.name}`}
              className="text-xs font-medium text-stone-800 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.viewInline}</span>
            </button>
            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">|</span>
            <button
              onClick={() => onOpenNewTab(item)}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
              title={t.openNewTab}
              aria-label={`${t.openNewTab}: ${item.exif.title || item.name}`}
            >
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>

          {/* Download Buttons: Video offers direct Video Download + PowerPoint Download */}
          <div className="flex items-center gap-1">
            {isDownloadAllowed ? (
              <>
                <button
                  onClick={() => onDownload(item)}
                  aria-label={`${isVideo ? t.downloadVideo : isWord ? t.downloadWord : isImage ? t.downloadImage : t.downloadPdf}: ${item.originalFileName}`}
                  className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                  title={isVideo ? t.downloadVideo : t.downloadFile}
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="text-[11px] hidden lg:inline">
                    {isVideo ? 'MP4' : isWord ? 'DOCX' : isImage ? 'IMG' : 'PDF'}
                  </span>
                </button>

                {/* Second download button for Video's original PowerPoint file! */}
                {isVideo && item.powerpointUrl && isPptDownloadAllowed && onDownloadPowerpoint && (
                  <button
                    onClick={() => onDownloadPowerpoint(item)}
                    aria-label={`${t.downloadPowerpoint}: ${item.powerpointFileName}`}
                    className="p-1.5 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                    title={t.downloadPowerpoint}
                  >
                    <Presentation className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="text-[11px] font-semibold hidden lg:inline">PPTX</span>
                  </button>
                )}
              </>
            ) : (
              <span
                className="text-[11px] text-stone-400 dark:text-stone-500 flex items-center gap-1 cursor-not-allowed select-none"
                title={t.downloadDisabledTip}
                aria-label={t.downloadDisabledTip}
              >
                <Lock className="w-3 h-3" aria-hidden="true" />
                <span className="hidden sm:inline">{t.downloadDisabled}</span>
              </span>
            )}
          </div>
        </div>

      </div>

    </article>
  );
};
