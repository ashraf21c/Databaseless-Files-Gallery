/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  AdminConfig,
  Language,
  PdfFolder,
  PdfItem,
  SortField,
  SortOrder
} from './types';
import {
  loadStoredConfig,
  loadStoredFolders,
  loadStoredItems,
  saveStoredConfig,
  saveStoredFolders,
  saveStoredItems
} from './utils/storage';
import { INITIAL_ADMIN_CONFIG, INITIAL_FOLDERS, generateInitialItems } from './utils/sampleData';
import { translations } from './utils/translations';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { PdfGrid } from './components/PdfGrid';
import { InlinePdfViewerModal } from './components/InlinePdfViewerModal';
import { AdminModal } from './components/AdminModal';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  // Language state (RTL=auto: Arabic switches document direction to rtl automatically)
  const [language, setLanguage] = useState<Language>('en');

  // Core Databaseless State
  const [config, setConfig] = useState<AdminConfig>(loadStoredConfig);
  const [folders, setFolders] = useState<PdfFolder[]>(loadStoredFolders);
  const [items, setItems] = useState<PdfItem[]>(loadStoredItems);

  // Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Gallery Filters & View State
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('uploadDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active Inline Viewer Modal
  const [activeViewerItem, setActiveViewerItem] = useState<PdfItem | null>(null);

  // Sync HTML dir and lang for Arabic / Japanese / English (RTL=auto)
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    if (language === 'ar') {
      root.dir = 'rtl';
    } else {
      root.dir = 'ltr';
    }
  }, [language]);

  // Sync dark class on root document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist State to Local Databaseless Storage
  const handleUpdateFolders = (newFolders: PdfFolder[]) => {
    setFolders(newFolders);
    saveStoredFolders(newFolders);
  };

  const handleUpdateItems = (newItems: PdfItem[]) => {
    setItems(newItems);
    saveStoredItems(newItems);
  };

  const handleUpdateConfig = (newConfig: AdminConfig) => {
    setConfig(newConfig);
    saveStoredConfig(newConfig);
  };

  const handleResetCatalog = () => {
    const defaultFolders = INITIAL_FOLDERS;
    const defaultItems = generateInitialItems();
    const defaultConfig = INITIAL_ADMIN_CONFIG;

    setFolders(defaultFolders);
    setItems(defaultItems);
    setConfig(defaultConfig);

    saveStoredFolders(defaultFolders);
    saveStoredItems(defaultItems);
    saveStoredConfig(defaultConfig);
    setSelectedFolderId('all');
    setSelectedTags([]);
  };

  // Visible folders for current user (admin sees all, public sees visibleInFrontend)
  const visibleFolders = useMemo(() => {
    return folders.filter(f => isAdmin || f.visibleInFrontend);
  }, [folders, isAdmin]);

  // Calculate distinct tags across documents in visible folders
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    const visibleFolderIds = new Set(visibleFolders.map(f => f.id));

    items.forEach(item => {
      if (visibleFolderIds.has(item.folderId)) {
        item.tags.forEach(t => tagSet.add(t));
      }
    });
    return Array.from(tagSet).sort();
  }, [items, visibleFolders]);

  // Item counts per folder
  const folderItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.folderId] = (counts[item.folderId] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filtered & Sorted PDF Items
  const displayedItems = useMemo(() => {
    const visibleFolderIds = new Set(visibleFolders.map(f => f.id));

    return items
      .filter(item => {
        // 1. Must belong to a visible folder
        if (!visibleFolderIds.has(item.folderId)) return false;

        // 2. Folder filter
        if (selectedFolderId !== 'all' && item.folderId !== selectedFolderId) {
          return false;
        }

        // 3. Tags filter (if any selected, item must have at least one of them)
        if (selectedTags.length > 0) {
          const hasMatchingTag = selectedTags.some(tag => item.tags.includes(tag));
          if (!hasMatchingTag) return false;
        }

        // 4. Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (item.exif.title || item.name).toLowerCase().includes(q);
          const matchAuthor = (item.exif.author || '').toLowerCase().includes(q);
          const matchSummary = (item.summary || '').toLowerCase().includes(q);
          const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
          const matchFileName = item.originalFileName.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchSummary && !matchTags && !matchFileName) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case 'name':
            cmp = a.name.localeCompare(b.name);
            break;
          case 'size':
            cmp = a.fileSize - b.fileSize;
            break;
          case 'uploadDate':
            cmp = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
            break;
          case 'title':
            cmp = (a.exif.title || a.name).localeCompare(b.exif.title || b.name);
            break;
          case 'author':
            cmp = (a.exif.author || '').localeCompare(b.exif.author || '');
            break;
          case 'pageCount':
            cmp = (a.exif.pageCount || 0) - (b.exif.pageCount || 0);
            break;
          case 'creationDate':
            cmp = (a.exif.creationDate || '').localeCompare(b.exif.creationDate || '');
            break;
          default:
            cmp = a.order - b.order;
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [items, visibleFolders, selectedFolderId, selectedTags, searchQuery, sortField, sortOrder]);

  // Tag filter handlers
  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Download Handler with Strict Permission Check
  const handleDownload = (item: PdfItem) => {
    const folder = folders.find(f => f.id === item.folderId);
    const isAllowed = (folder ? folder.allowDownload : true) && item.allowDownload;

    if (!isAllowed) {
      alert(translations[language].downloadDisabledTip);
      return;
    }

    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.originalFileName || item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open in New Tab Handler
  const handleOpenNewTab = (item: PdfItem) => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  // Viewer Navigation (Next / Previous item)
  const currentViewerIndex = displayedItems.findIndex(i => i.id === activeViewerItem?.id);
  const hasPrev = currentViewerIndex > 0;
  const hasNext = currentViewerIndex >= 0 && currentViewerIndex < displayedItems.length - 1;

  const handleNavigatePrev = () => {
    if (hasPrev) {
      setActiveViewerItem(displayedItems[currentViewerIndex - 1]);
    }
  };

  const handleNavigateNext = () => {
    if (hasNext) {
      setActiveViewerItem(displayedItems[currentViewerIndex + 1]);
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors selection:bg-stone-800 selection:text-white">
      
      {/* 1. Header (Top Bar Contract) */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={() => setIsAdmin(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onScrollToCollections={() => {
          document.getElementById('collections-bar')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToExifRules={() => {
          setIsAdminModalOpen(true);
        }}
        onOpenPhpGuide={() => {
          setIsAdminModalOpen(true);
        }}
      />

      {/* 2. Hero Section */}
      <HeroSection
        language={language}
        totalDocs={displayedItems.length}
        totalFolders={visibleFolders.length}
        onExploreClick={() => {
          document.getElementById('collections-bar')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Main Gallery Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Filter, Search, Tag, and Sorting Controls */}
        <FilterBar
          language={language}
          folders={visibleFolders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
          onClearTags={() => setSelectedTags([])}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOrder={sortOrder}
          onToggleSortOrder={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          folderItemCounts={folderItemCounts}
        />

        {/* PDF Documents Grid or List */}
        <PdfGrid
          items={displayedItems}
          folders={folders}
          language={language}
          exifSettings={config.exifSettings}
          viewMode={viewMode}
          onViewInline={(item) => setActiveViewerItem(item)}
          onOpenNewTab={handleOpenNewTab}
          onDownload={handleDownload}
          onResetFilters={() => {
            setSelectedFolderId('all');
            setSelectedTags([]);
            setSearchQuery('');
          }}
        />

      </main>

      {/* 4. Minimal Editorial Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/40 text-stone-500 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-serif font-medium text-stone-700 dark:text-stone-300">FolioVault</span>
            <span className="mx-2">·</span>
            <span>{t.standaloneNote}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              {t.adminPortal}
            </button>
            <span aria-hidden="true">·</span>
            <span>PHP 8.1+ / Flat File / Single HTML Ready</span>
          </div>
        </div>
      </footer>

      {/* 5. Inline PDF Viewer Modal */}
      {activeViewerItem && (
        <InlinePdfViewerModal
          item={activeViewerItem}
          folder={folders.find(f => f.id === activeViewerItem.folderId)}
          language={language}
          exifSettings={config.exifSettings}
          isAdmin={isAdmin}
          onClose={() => setActiveViewerItem(null)}
          onOpenNewTab={handleOpenNewTab}
          onDownload={handleDownload}
          onNavigatePrev={handleNavigatePrev}
          onNavigateNext={handleNavigateNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}

      {/* 6. Admin Management & Upload Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onAuthenticate={() => setIsAdmin(true)}
        onLogout={() => setIsAdmin(false)}
        language={language}
        folders={folders}
        items={items}
        config={config}
        onUpdateFolders={handleUpdateFolders}
        onUpdateItems={handleUpdateItems}
        onUpdateConfig={handleUpdateConfig}
        onResetCatalog={handleResetCatalog}
      />

    </div>
  );
}
