/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo } from 'react';
import {
  Rss,
  Download,
  Code,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Copy,
  FileText,
  Video,
  Presentation,
  FileSpreadsheet,
  Image as ImageIcon,
  EyeOff,
  Sparkles,
  Clock
} from 'lucide-react';
import { AdminConfig, FileType, Language, MediaItem, PdfFolder } from '../types';
import { translations } from '../utils/translations';
import { downloadRssFeed, generateRssFeed, getRssFeedBlobUrl } from '../utils/rss';

interface RecentlyAddedWidgetProps {
  items: MediaItem[];
  folders: PdfFolder[];
  language: Language;
  config: AdminConfig;
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onViewInline: (item: MediaItem) => void;
  onOpenNewTab: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  onDownloadPowerpoint: (item: MediaItem) => void;
}

export const RecentlyAddedWidget: React.FC<RecentlyAddedWidgetProps> = ({
  items,
  folders,
  language,
  config,
  isEnabled,
  onToggleEnabled,
  onViewInline,
  onOpenNewTab,
  onDownload,
  onDownloadPowerpoint,
}) => {
  const t = translations[language];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // XML Modal state
  const [isXmlModalOpen, setIsXmlModalOpen] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

  // Map folders for quick name lookup
  const folderMap = useMemo(() => {
    return new Map(folders.map(f => [f.id, f]));
  }, [folders]);

  // Compute the 10 latest additions from visible folders
  const latestTenItems = useMemo(() => {
    const visibleFolderIds = new Set(
      folders.filter(f => f.visibleInFrontend !== false).map(f => f.id)
    );

    return [...items]
      .filter(item => visibleFolderIds.has(item.folderId))
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 10);
  }, [items, folders]);

  // Generated XML string for preview modal
  const rssXmlString = useMemo(() => {
    if (!isXmlModalOpen) return '';
    return generateRssFeed(items, folders, config, 10);
  }, [items, folders, config, isXmlModalOpen]);

  // Keyboard Escape listener for XML modal
  React.useEffect(() => {
    if (!isXmlModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsXmlModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isXmlModalOpen]);

  // Scroll controls for the horizontal scroller
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const isRtl = language === 'ar';
    const scrollAmount = 340;
    
    // In RTL, left/right scroll direction is inverted in DOM
    const delta = direction === 'left' 
      ? (isRtl ? scrollAmount : -scrollAmount)
      : (isRtl ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handleCopyXml = async () => {
    try {
      await navigator.clipboard.writeText(rssXmlString);
      setCopiedXml(true);
      setTimeout(() => setCopiedXml(false), 2200);
    } catch (e) {
      console.error('Failed to copy XML', e);
    }
  };

  const getFormatIcon = (fileType: FileType) => {
    switch (fileType) {
      case 'video':
        return <Video className="w-3 h-3 text-stone-500" />;
      case 'presentation':
        return <Presentation className="w-3 h-3 text-stone-500" />;
      case 'word':
        return <FileSpreadsheet className="w-3 h-3 text-stone-500" />;
      case 'image':
        return <ImageIcon className="w-3 h-3 text-stone-500" />;
      case 'pdf':
      default:
        return <FileText className="w-3 h-3 text-stone-500" />;
    }
  };

  // IF DISABLED: Render minimal subtle reactivation strip
  if (!isEnabled) {
    return (
      <aside aria-label={t.rssWidgetTitle} className="w-full">
        <div className="flex items-center justify-between p-3 bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 rounded-lg text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <Rss className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
            <span className="font-serif font-medium text-stone-800 dark:text-stone-200">
              {t.rssWidgetTitle}
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-stone-400">
              ({t.rssFeedName})
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-[11px]">{t.rssWidgetDisabledNotice}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadRssFeed(items, folders, config)}
              className="text-[11px] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
              title={t.downloadRssFeed}
            >
              <Download className="w-3 h-3" />
              <span className="hidden md:inline">{t.rssFeedName}</span>
            </button>
            <button
              onClick={() => onToggleEnabled(true)}
              className="text-[11px] font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-3 py-1 rounded transition-opacity hover:opacity-90 cursor-pointer"
            >
              {t.enableRssWidget}
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // IF ENABLED: Full Editorial Media RSS Widget
  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={t.rssWidgetTitle}
      aria-labelledby="rss-widget-heading"
      className="w-full space-y-3"
    >
      {/* Widget Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200 dark:border-stone-800">
        
        {/* Left: Brand Identity, Feed Name & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-white dark:bg-amber-600 rounded-md shadow-xs flex items-center justify-center shrink-0">
            <Rss className="w-4 h-4" aria-hidden="true" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h3 id="rss-widget-heading" className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100">
                {t.rssWidgetTitle}
              </h3>
              <span className="font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded">
                {t.rssFeedName}
              </span>
              <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
                ({latestTenItems.length} {t.latestAdditions})
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {t.rssWidgetSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions (Download XML, View XML, Scroll Controls, Disable Widget) */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          
          {/* Direct Download of recently_added.rss */}
          <button
            onClick={() => downloadRssFeed(items, folders, config)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
            title={t.downloadRssFeed}
            aria-label={t.downloadRssFeed}
          >
            <Download className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" aria-hidden="true" />
            <span className="hidden lg:inline">{t.downloadRssFeed}</span>
            <span className="lg:hidden">{t.rssFeedName}</span>
          </button>

          {/* View Raw XML Modal Trigger */}
          <button
            onClick={() => setIsXmlModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
            title={t.viewRssFeed}
            aria-label={t.viewRssFeed}
          >
            <Code className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" aria-hidden="true" />
            <span className="hidden sm:inline">{t.viewRssFeed}</span>
          </button>

          {/* Scroller Controls */}
          <div role="group" aria-label="Carousel navigation" className="hidden sm:flex items-center gap-1 border border-stone-200 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-800/80 p-0.5">
            <button
              onClick={() => handleScroll('left')}
              aria-controls="rss-carousel-list"
              className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-600 dark:text-stone-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
              aria-label="Scroll carousel backward"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-controls="rss-carousel-list"
              className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-600 dark:text-stone-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
              aria-label="Scroll carousel forward"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Disable / Dismiss Widget */}
          <button
            onClick={() => onToggleEnabled(false)}
            className="flex items-center gap-1 p-1.5 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer rounded hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
            title={t.disableRssWidget}
            aria-label={t.disableRssWidget}
          >
            <EyeOff className="w-4 h-4" aria-hidden="true" />
            <span className="text-[11px] hidden xl:inline">{t.disableRssWidget}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container for 10 Latest Items */}
      <div
        id="rss-carousel-list"
        ref={scrollContainerRef}
        role="region"
        aria-label={t.latestAdditions}
        tabIndex={0}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg scrollbar-thin"
        style={{ scrollbarWidth: 'thin' }}
      >
        {latestTenItems.map((item, idx) => {
          const folder = folderMap.get(item.folderId);
          const isVideo = item.fileType === 'video';
          const isWord = item.fileType === 'word';
          const isImage = item.fileType === 'image';
          const title = item.exif?.title || item.name;
          const author = item.exif?.author || 'FolioVault Archive';
          const isDownloadAllowed = (folder ? folder.allowDownload : true) && item.allowDownload;
          const hasCompanionDeck = isVideo && Boolean(item.powerpointFileName);

          return (
            <article
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${latestTenItems.length}: ${title}`}
              className="snap-start shrink-0 w-72 sm:w-80 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => onViewInline(item)}
                className="h-36 bg-stone-100 dark:bg-stone-800/80 relative flex items-center justify-center p-3 cursor-pointer overflow-hidden border-b border-stone-100 dark:border-stone-800/60"
              >
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={title}
                    className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-300 drop-shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-stone-400">
                    {getFormatIcon(item.fileType)}
                    <span className="text-[10px] uppercase font-mono">{item.fileType}</span>
                  </div>
                )}

                {/* Clean unboxed format mark in corner */}
                <div className="absolute top-2.5 start-2.5 flex items-center gap-1.5 bg-stone-900/80 dark:bg-stone-100/90 text-white dark:text-stone-900 text-[10px] font-mono uppercase px-2 py-0.5 rounded shadow-xs backdrop-blur-xs">
                  {getFormatIcon(item.fileType)}
                  <span>{item.fileType}</span>
                </div>

                {/* Index in Latest 10 */}
                <div className="absolute top-2.5 end-2.5 font-mono text-[10px] text-stone-500 bg-white/90 dark:bg-stone-900/90 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                  #{idx + 1}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {/* Clean unboxed metadata line */}
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5 truncate">
                    <span className="truncate">{folder ? folder.name : 'Central Archive'}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px]">
                      {new Date(item.uploadDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'ja' ? 'ja-JP' : 'en-US')}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-serif font-medium text-sm text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug">
                    <button
                      onClick={() => onViewInline(item)}
                      className="text-start hover:text-amber-700 dark:hover:text-amber-400 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded cursor-pointer"
                      title={title}
                    >
                      {title}
                    </button>
                  </h4>

                  {/* Clean Author & Details */}
                  <div className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-1.5 truncate">
                    <span className="truncate">{author}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px]">{(item.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                    {item.exif?.videoDuration && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-[10px]">{item.exif.videoDuration}</span>
                      </>
                    )}
                  </div>

                  {/* Companion Slide Deck Indicator if video */}
                  {hasCompanionDeck && (
                    <div className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 p-1.5 rounded truncate">
                      <span className="font-medium">{t.powerpointDeck}:</span> {item.powerpointFileName}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewInline(item)}
                      aria-label={`${t.viewInline}: ${title}`}
                      className="px-2.5 py-1 text-[11px] font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-colors cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                      title={t.viewInline}
                    >
                      <Eye className="w-3 h-3" aria-hidden="true" />
                      <span>{t.viewInline}</span>
                    </button>

                    <button
                      onClick={() => onOpenNewTab(item)}
                      className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
                      title={t.openNewTab}
                      aria-label={`${t.openNewTab}: ${title}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Companion PowerPoint Deck download if video */}
                    {hasCompanionDeck && (
                      <button
                        onClick={() => onDownloadPowerpoint(item)}
                        aria-label={`${t.downloadPowerpoint}: ${item.powerpointFileName}`}
                        className="px-2 py-1 text-[10px] font-medium bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 rounded border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                        title={t.downloadPowerpoint}
                      >
                        <Presentation className="w-2.5 h-2.5" aria-hidden="true" />
                        <span>PPTX</span>
                      </button>
                    )}

                    {/* Main File Download */}
                    {isDownloadAllowed && (
                      <button
                        onClick={() => onDownload(item)}
                        aria-label={`${isVideo ? t.downloadVideo : isWord ? t.downloadWord : isImage ? t.downloadImage : t.downloadPdf}: ${item.originalFileName}`}
                        className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none rounded"
                        title={isVideo ? t.downloadVideo : isWord ? t.downloadWord : isImage ? t.downloadImage : t.downloadPdf}
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* RAW RSS XML PREVIEW MODAL */}
      {isXmlModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="xml-feed-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50/80 dark:bg-stone-900/80">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-amber-500 text-white rounded">
                  <Rss className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 id="xml-feed-title" className="font-serif font-semibold text-sm">
                    {t.viewRssFeed} &middot; <span className="font-mono text-xs">{t.rssFeedName}</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    RSS 2.0 + Yahoo! Media RSS Specification (latest 10 additions)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsXmlModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                aria-label={t.closeDialog}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Code Viewer */}
            <div
              tabIndex={0}
              aria-label="RSS 2.0 XML Code"
              className="flex-1 p-5 overflow-y-auto bg-stone-950 text-stone-200 font-mono text-[11px] leading-relaxed selection:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <pre className="whitespace-pre-wrap break-all">
                {rssXmlString}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between text-xs">
              <div className="text-stone-500">
                Specification: RSS 2.0, Media RSS (mrss), Atom 1.0, Dublin Core
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyXml}
                  className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                >
                  {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span>{copiedXml ? t.rssCopied : t.copyRssXml}</span>
                </button>

                <button
                  onClick={() => downloadRssFeed(items, folders, config)}
                  className="px-3.5 py-1.5 bg-stone-900 dark:bg-stone-100 hover:opacity-90 text-white dark:text-stone-900 rounded font-medium flex items-center gap-1.5 transition-opacity cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-600 dark:focus-visible:ring-stone-300 focus-visible:outline-none"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.downloadRssFeed}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
