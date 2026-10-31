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
  FileQuestion,
  BookOpen,
  Video,
  FileSpreadsheet,
  Image as ImageIcon,
  Presentation
} from 'lucide-react';
import { ExifDisplaySettings, Language, MediaItem, PdfFolder } from '../types';
import { translations } from '../utils/translations';
import { PdfCard } from './PdfCard';

interface PdfGridProps {
  items: MediaItem[];
  folders: PdfFolder[];
  language: Language;
  exifSettings: ExifDisplaySettings;
  viewMode: 'grid' | 'list';
  onViewInline: (item: MediaItem) => void;
  onOpenNewTab: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  onDownloadPowerpoint: (item: MediaItem) => void;
  onResetFilters?: () => void;
}

export const PdfGrid: React.FC<PdfGridProps> = ({
  items,
  folders,
  language,
  exifSettings,
  viewMode,
  onViewInline,
  onOpenNewTab,
  onDownload,
  onDownloadPowerpoint,
  onResetFilters,
}) => {
  const t = translations[language];

  const folderMap = React.useMemo(() => {
    const map = new Map<string, PdfFolder>();
    folders.forEach(f => map.set(f.id, f));
    return map;
  }, [folders]);

  if (items.length === 0) {
    return (
      <div role="status" className="py-20 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-lg p-8">
        <FileQuestion className="w-10 h-10 text-stone-400 mx-auto mb-3 stroke-[1.2]" aria-hidden="true" />
        <h3 className="text-base font-serif font-medium text-stone-800 dark:text-stone-200 mb-1">
          {t.noPdfsFound}
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
          {t.noPdfsFoundSub}
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
          >
            {t.allAlbums} / {t.formatAll}
          </button>
        )}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden bg-white dark:bg-stone-900 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <caption className="sr-only">{t.catalogTableCaption}</caption>
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th scope="col" className="px-4 py-3 text-start">{t.sortTitle}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.sortFileType}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.folderName}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.sortAuthor}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.sortSize}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.fieldCreationDate}</th>
                <th scope="col" className="px-4 py-3 text-end">{t.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {items.map(item => {
                const folder = folderMap.get(item.folderId);
                const isDownloadAllowed = (folder ? folder.allowDownload : true) && item.allowDownload;
                const isPptDownloadAllowed = isDownloadAllowed && (item.allowPowerpointDownload !== false);
                const fileSizeMb = (item.fileSize / (1024 * 1024)).toFixed(2);
                const folderName = folder?.nameTranslations?.[language] || folder?.name || 'Archive';
                const itemTitle = exifSettings.showTitle && item.exif.title ? item.exif.title : item.name;

                const isVideo = item.fileType === 'video';
                const isPresentation = item.fileType === 'presentation';
                const isWord = item.fileType === 'word';
                const isImage = item.fileType === 'image';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    {/* Document Title & Icon */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onViewInline(item)}
                          aria-label={`${t.viewInline}: ${itemTitle}`}
                          className="w-8 h-10 bg-stone-100 dark:bg-stone-800 rounded-xs flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border border-stone-200 dark:border-stone-700 focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                        >
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt={itemTitle} className="w-full h-full object-cover" />
                          ) : isVideo ? (
                            <Video className="w-4 h-4 text-amber-500" aria-hidden="true" />
                          ) : isPresentation ? (
                            <Presentation className="w-4 h-4 text-orange-500" aria-hidden="true" />
                          ) : isWord ? (
                            <FileSpreadsheet className="w-4 h-4 text-blue-500" aria-hidden="true" />
                          ) : isImage ? (
                            <ImageIcon className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-stone-400" aria-hidden="true" />
                          )}
                        </button>
                        <div>
                          <div>
                            <button
                              onClick={() => onViewInline(item)}
                              aria-label={`${t.viewInline}: ${itemTitle}`}
                              className="font-medium text-stone-900 dark:text-stone-100 hover:underline cursor-pointer text-start focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
                            >
                              {itemTitle}
                            </button>
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono truncate max-w-xs">
                            {item.originalFileName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Media Type */}
                    <td className="px-4 py-3.5 text-stone-600 dark:text-stone-300">
                      <span className="font-mono uppercase text-[11px] font-semibold text-stone-500">
                        {item.fileType}
                      </span>
                    </td>

                    {/* Folder */}
                    <td className="px-4 py-3.5 text-stone-600 dark:text-stone-300">
                      <span>{folderName}</span>
                    </td>

                    {/* Author / Presenter */}
                    <td className="px-4 py-3.5 text-stone-600 dark:text-stone-300">
                      {exifSettings.showAuthor && item.exif.author ? item.exif.author : '—'}
                    </td>

                    {/* Size */}
                    <td className="px-4 py-3.5 text-stone-500 tabular-nums">
                      {fileSizeMb} MB
                      {isVideo && item.exif.videoDuration && (
                        <span className="text-[11px] block font-mono text-stone-400">
                          {item.exif.videoDuration}
                        </span>
                      )}
                      {!isVideo && exifSettings.showPageCount && item.exif.pageCount && (
                        <span className="text-[11px] block text-stone-400">
                          {item.exif.pageCount} {t.pages}
                        </span>
                      )}
                    </td>

                    {/* Creation Date */}
                    <td className="px-4 py-3.5 text-stone-500 font-mono tabular-nums">
                      {exifSettings.showCreationDate && item.exif.creationDate ? item.exif.creationDate : '—'}
                    </td>

                    {/* Actions with Dual Download for Video */}
                    <td className="px-4 py-3.5 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewInline(item)}
                          className="p-1.5 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                          title={t.viewInline}
                          aria-label={`${t.viewInline}: ${itemTitle}`}
                        >
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => onOpenNewTab(item)}
                          className="p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                          title={t.openNewTab}
                          aria-label={`${t.openNewTab}: ${itemTitle}`}
                        >
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </button>

                        {/* Download Video / File */}
                        {isDownloadAllowed ? (
                          <>
                            <button
                              onClick={() => onDownload(item)}
                              className="p-1.5 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                              title={isVideo ? t.downloadVideo : t.downloadFile}
                              aria-label={`${isVideo ? t.downloadVideo : isWord ? t.downloadWord : isImage ? t.downloadImage : t.downloadPdf}: ${item.originalFileName}`}
                            >
                              <Download className="w-4 h-4" aria-hidden="true" />
                            </button>

                            {/* Accompanying PowerPoint slide deck download */}
                            {isVideo && item.powerpointUrl && isPptDownloadAllowed && (
                              <button
                                onClick={() => onDownloadPowerpoint(item)}
                                className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                                title={t.downloadPowerpoint}
                                aria-label={`${t.downloadPowerpoint}: ${item.powerpointFileName}`}
                              >
                                <Presentation className="w-4 h-4" aria-hidden="true" />
                              </button>
                            )}
                          </>
                        ) : (
                          <span
                            className="p-1.5 text-stone-400 cursor-not-allowed"
                            title={t.downloadDisabledTip}
                            aria-label={t.downloadDisabledTip}
                          >
                            <Lock className="w-4 h-4" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <PdfCard
          key={item.id}
          item={item}
          folder={folderMap.get(item.folderId)}
          language={language}
          exifSettings={exifSettings}
          onViewInline={onViewInline}
          onOpenNewTab={onOpenNewTab}
          onDownload={onDownload}
          onDownloadPowerpoint={onDownloadPowerpoint}
        />
      ))}
    </div>
  );
};
