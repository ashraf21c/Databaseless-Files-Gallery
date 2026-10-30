/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, ArrowUpDown, LayoutGrid, List, Lock, Folder, Tag } from 'lucide-react';
import { Language, PdfFolder, SortField, SortOrder } from '../types';
import { translations } from '../utils/translations';

interface FilterBarProps {
  language: Language;
  folders: PdfFolder[];
  selectedFolderId: string | 'all';
  onSelectFolder: (folderId: string | 'all') => void;
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  folderItemCounts: Record<string, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  language,
  folders,
  selectedFolderId,
  onSelectFolder,
  availableTags,
  selectedTags,
  onToggleTag,
  onClearTags,
  searchQuery,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onToggleSortOrder,
  viewMode,
  onViewModeChange,
  folderItemCounts,
}) => {
  const t = translations[language];

  const totalVisibleDocs = Object.values(folderItemCounts).reduce((a, b) => a + b, 0);

  return (
    <div id="collections-bar" className="space-y-5">
      
      {/* 1. Folder / Album Tabs (Segmented bar) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5" />
            {t.filterByFolder}
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500 tabular-nums">
            {folders.length} {t.foldersCount}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700/80">
          <button
            onClick={() => onSelectFolder('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedFolderId === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <span>{t.allAlbums}</span>
            <span className="text-[11px] opacity-70 tabular-nums">({totalVisibleDocs})</span>
          </button>

          {folders.map(folder => {
            const count = folderItemCounts[folder.id] || 0;
            const displayName =
              folder.nameTranslations?.[language] || folder.name;

            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedFolderId === folder.id
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <span>{displayName}</span>
                <span className="text-[11px] opacity-70 tabular-nums">({count})</span>
                {!folder.allowDownload && (
                  <span title={t.downloadDisabled} className="inline-flex">
                    <Lock className="w-2.5 h-2.5 text-stone-400" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tag Filter Bar */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 font-medium">
            <Tag className="w-3 h-3" />
            {t.filterByTag}:
          </span>

          {selectedTags.length > 0 && (
            <button
              onClick={onClearTags}
              className="text-xs text-stone-900 dark:text-stone-100 underline hover:opacity-80 transition-opacity cursor-pointer mr-1"
            >
              {t.allTags} (Reset)
            </button>
          )}

          {availableTags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100 font-medium'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Search and Sort Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full ps-9 pe-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500 transition-colors"
          />
        </div>

        {/* Sort Controls & View Mode */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-2 py-1.5 text-xs text-stone-700 dark:text-stone-300">
            <span className="text-stone-400 text-[11px] whitespace-nowrap">{t.sortBy}:</span>
            <select
              value={sortField}
              onChange={(e) => onSortFieldChange(e.target.value as SortField)}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="name" className="dark:bg-stone-800">{t.sortName}</option>
              <option value="size" className="dark:bg-stone-800">{t.sortSize}</option>
              <option value="uploadDate" className="dark:bg-stone-800">{t.sortDate}</option>
              <option value="title" className="dark:bg-stone-800">{t.sortTitle}</option>
              <option value="author" className="dark:bg-stone-800">{t.sortAuthor}</option>
              <option value="pageCount" className="dark:bg-stone-800">{t.sortPageCount}</option>
              <option value="creationDate" className="dark:bg-stone-800">{t.sortCreationDate}</option>
            </select>
          </div>

          {/* Asc / Desc Toggle */}
          <button
            onClick={onToggleSortOrder}
            className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={`${t.sortBy} (${sortOrder === 'asc' ? t.sortAsc : t.sortDesc})`}
            aria-label="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* View mode (Grid / List) */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-md p-0.5 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
