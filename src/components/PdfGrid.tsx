/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, ExternalLink, Download, Lock, FileQuestion, BookOpen } from 'lucide-react';
import { ExifDisplaySettings, Language, PdfFolder, PdfItem } from '../types';
import { translations } from '../utils/translations';
import { PdfCard } from './PdfCard';

interface PdfGridProps {
  items: PdfItem[];
  folders: PdfFolder[];
  language: Language;
  exifSettings: ExifDisplaySettings;
  viewMode: 'grid' | 'list';
  onViewInline: (item: PdfItem) => void;
  onOpenNewTab: (item: PdfItem) => void;
  onDownload: (item: PdfItem) => void;
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
      <div className="py-20 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-lg p-8">
        <FileQuestion className="w-10 h-10 text-stone-400 mx-auto mb-3 stroke-[1.2]" />
        <h3 className="text-base font-serif font-medium text-stone-800 dark:text-stone-200 mb-1">
          {t.noPdfsFound}
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
          {t.noPdfsFoundSub}
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer"
          >
            {t.allAlbums} / {t.allTags}
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
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th scope="col" className="px-4 py-3 text-start">{t.sortTitle}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.folderName}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.sortAuthor}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.sortSize}</th>
                <th scope="col" className="px-4 py-3 text-start">{t.fieldCreationDate}</th>
                <th scope="col" className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {items.map(item => {
                const folder = folderMap.get(item.folderId);
                const isDownloadAllowed = (folder ? folder.allowDownload : true) && item.allowDownload;
                const fileSizeMb = (item.fileSize / (1024 * 1024)).toFixed(2);
                const folderName = folder?.nameTranslations?.[language] || folder?.name || 'Archive';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    {/* Document Title & Icon */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => onViewInline(item)}
                          className="w-8 h-10 bg-stone-100 dark:bg-stone-800 rounded-xs flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border border-stone-200 dark:border-stone-700"
                        >
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-stone-400" />
                          )}
                        </div>
                        <div>
                          <div
                            onClick={() => onViewInline(item)}
                            className="font-medium text-stone-900 dark:text-stone-100 hover:underline cursor-pointer"
                          >
                            {exifSettings.showTitle && item.exif.title ? item.exif.title : item.name}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono truncate max-w-xs">
                            {item.originalFileName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Folder */}
                    <td className="px-4 py-3.5 text-stone-600 dark:text-stone-300">
                      <span>{folderName}</span>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3.5 text-stone-600 dark:text-stone-300">
                      {exifSettings.showAuthor && item.exif.author ? item.exif.author : '—'}
                    </td>

                    {/* Size */}
                    <td className="px-4 py-3.5 text-stone-500 tabular-nums">
                      {fileSizeMb} MB
                      {exifSettings.showPageCount && item.exif.pageCount && (
                        <span className="text-[11px] block text-stone-400">
                          {item.exif.pageCount} {t.pages}
                        </span>
                      )}
                    </td>

                    {/* Creation Date */}
                    <td className="px-4 py-3.5 text-stone-500 font-mono tabular-nums">
                      {exifSettings.showCreationDate && item.exif.creationDate ? item.exif.creationDate : '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewInline(item)}
                          className="p-1.5 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer"
                          title={t.viewInline}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenNewTab(item)}
                          className="p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer"
                          title={t.openNewTab}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        {isDownloadAllowed ? (
                          <button
                            onClick={() => onDownload(item)}
                            className="p-1.5 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors cursor-pointer"
                            title={t.downloadPdf}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        ) : (
                          <span
                            className="p-1.5 text-stone-400 cursor-not-allowed"
                            title={t.downloadDisabledTip}
                          >
                            <Lock className="w-4 h-4" />
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
        />
      ))}
    </div>
  );
};
