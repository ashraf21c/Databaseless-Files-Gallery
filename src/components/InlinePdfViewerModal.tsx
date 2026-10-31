/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  X,
  ExternalLink,
  Download,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Video,
  Presentation,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';
import { ExifDisplaySettings, Language, MediaItem, PdfFolder } from '../types';
import { translations } from '../utils/translations';

interface InlinePdfViewerModalProps {
  item: MediaItem | null;
  folder?: PdfFolder;
  language: Language;
  exifSettings: ExifDisplaySettings;
  isAdmin: boolean;
  onClose: () => void;
  onOpenNewTab: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  onDownloadPowerpoint?: (item: MediaItem) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const InlinePdfViewerModal: React.FC<InlinePdfViewerModalProps> = ({
  item,
  folder,
  language,
  exifSettings,
  isAdmin,
  onClose,
  onOpenNewTab,
  onDownload,
  onDownloadPowerpoint,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
}) => {
  const t = translations[language];
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [showMetadataPanel, setShowMetadataPanel] = useState<boolean>(false);
  const [copiedRaw, setCopiedRaw] = useState<boolean>(false);

  // Keyboard navigation & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev && onNavigatePrev) onNavigatePrev();
      if (e.key === 'ArrowRight' && hasNext && onNavigateNext) onNavigateNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, hasPrev, hasNext, onNavigatePrev, onNavigateNext]);

  useEffect(() => {
    setZoom(100);
    setRotation(0);
  }, [item?.id]);

  if (!item) return null;

  const isDownloadAllowed = (folder ? folder.allowDownload : true) && item.allowDownload;
  const isPptDownloadAllowed = isDownloadAllowed && (item.allowPowerpointDownload !== false);
  const folderName = folder?.nameTranslations?.[language] || folder?.name || 'Archive';

  const isVideo = item.fileType === 'video';
  const isWord = item.fileType === 'word';
  const isPresentation = item.fileType === 'presentation';
  const isImage = item.fileType === 'image';
  const isPdf = item.fileType === 'pdf';

  const handleCopyRawExif = () => {
    navigator.clipboard.writeText(JSON.stringify(item.exif, null, 2));
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inline-viewer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      
      {/* Modal Dialog Card */}
      <div className="relative w-full h-[94vh] max-w-6xl bg-stone-900 border border-stone-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* 1. Modal Header Toolbar */}
        <div className="h-14 px-4 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between gap-4 shrink-0">
          
          {/* Document Title & Prev/Next */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-0.5">
              <button
                onClick={onNavigatePrev}
                disabled={!hasPrev}
                className="p-1.5 text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                title={t.previousDoc}
                aria-label={t.previousDoc}
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
              </button>
              <button
                onClick={onNavigateNext}
                disabled={!hasNext}
                className="p-1.5 text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                title={t.nextDoc}
                aria-label={t.nextDoc}
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>

            <div className="min-w-0 ms-1">
              <h2 id="inline-viewer-title" className="text-xs font-serif font-medium text-stone-200 truncate max-w-xs sm:max-w-md md:max-w-lg">
                {item.exif.title || item.name}
              </h2>
              <div className="text-[11px] text-stone-500 truncate flex items-center gap-2">
                <span className="uppercase font-mono text-[10px] text-amber-500/90">{item.fileType}</span>
                <span>·</span>
                <span>{folderName}</span>
                <span>·</span>
                <span>{item.originalFileName}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Zoom & Rotate (for PDF and Images) */}
            {(isPdf || isImage) && (
              <div className="hidden sm:flex items-center gap-1 bg-stone-900 border border-stone-800 rounded px-1.5 py-1">
                <button
                  onClick={() => setZoom(z => Math.max(50, z - 15))}
                  className="p-1 text-stone-400 hover:text-stone-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded"
                  title={t.zoomOut}
                  aria-label={t.zoomOut}
                >
                  <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <span className="text-[11px] font-mono px-1 tabular-nums text-stone-300" aria-live="polite">{zoom}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(200, z + 15))}
                  className="p-1 text-stone-400 hover:text-stone-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded"
                  title={t.zoomIn}
                  aria-label={t.zoomIn}
                >
                  <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <div className="w-[1px] h-3 bg-stone-700 mx-1" aria-hidden="true" />
                <button
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="p-1 text-stone-400 hover:text-stone-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded"
                  title={t.rotate}
                  aria-label={t.rotate}
                >
                  <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Toggle Metadata Inspector */}
            <button
              onClick={() => setShowMetadataPanel(!showMetadataPanel)}
              className={`p-2 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                showMetadataPanel
                  ? 'bg-stone-800 text-stone-100'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
              title={t.exifInspector}
              aria-label={t.exifInspector}
              aria-expanded={showMetadataPanel}
            >
              <Info className="w-4 h-4" aria-hidden="true" />
              <span className="hidden md:inline text-xs">EXIF</span>
            </button>

            {/* Open in New Window/Tab */}
            <button
              onClick={() => onOpenNewTab(item)}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-900 rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              title={t.openNewTab}
              aria-label={t.openNewTab}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Downloads Toolbar */}
            {isDownloadAllowed ? (
              <div className="flex items-center gap-1">
                
                {/* 1. Main File Download (Video, Word, Image, PDF) */}
                <button
                  onClick={() => onDownload(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-white text-stone-900 rounded transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  title={isVideo ? t.downloadVideo : t.downloadFile}
                  aria-label={isVideo ? t.downloadVideo : isWord ? t.downloadWord : isImage ? t.downloadImage : t.downloadPdf}
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">
                    {isVideo ? t.downloadVideo : isWord ? t.downloadWord : isImage ? t.downloadImage : t.downloadPdf}
                  </span>
                </button>

                {/* 2. SPECIFIC REQUIREMENT: Video Dual Download Link (Original PowerPoint file) */}
                {isVideo && item.powerpointUrl && isPptDownloadAllowed && onDownloadPowerpoint && (
                  <button
                    onClick={() => onDownloadPowerpoint(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                    title={t.downloadPowerpoint}
                    aria-label={`${t.downloadPowerpoint}: ${item.powerpointFileName}`}
                  >
                    <Presentation className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.downloadPowerpoint}</span>
                  </button>
                )}

              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-400 bg-stone-900 border border-stone-800 rounded select-none"
                title={t.downloadDisabledTip}
                aria-label={t.downloadDisabledTip}
              >
                <Lock className="w-3.5 h-3.5 text-amber-500/80" aria-hidden="true" />
                <span className="text-[11px] hidden sm:inline">{t.downloadDisabled}</span>
              </div>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer ml-1 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              aria-label={t.closeDialog}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

        </div>

        {/* 2. Modal Body: Multi-Format Viewer (Video / Word / Image / PDF) */}
        <div className="flex-1 flex overflow-hidden bg-stone-950">
          
          <div className="flex-1 relative overflow-auto flex items-center justify-center p-2 sm:p-4 bg-stone-950">
            
            {/* A. VIDEO VIEWER */}
            {isVideo && (
              <div className="w-full max-w-4xl flex flex-col items-center justify-center p-4">
                <div className="w-full aspect-16/9 bg-black rounded-lg overflow-hidden border border-stone-800 shadow-2xl relative">
                  <video
                    src={item.url}
                    controls
                    playsInline
                    aria-label={item.exif.title || item.name}
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support HTML5 video playback.
                  </video>
                </div>

                {/* Video Info Ribbon & Dual Download Callout */}
                {item.powerpointFileName && (
                  <div className="w-full mt-4 p-4 bg-stone-900/90 border border-amber-900/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 text-amber-400 rounded-md">
                        <Presentation className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-200">
                          {t.powerpointDeck}: <span className="font-mono text-amber-400">{item.powerpointFileName}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {t.videoDualDownloadNotice}
                        </div>
                      </div>
                    </div>

                    {isPptDownloadAllowed && onDownloadPowerpoint && (
                      <button
                        onClick={() => onDownloadPowerpoint(item)}
                        aria-label={`${t.downloadPowerpoint}: ${item.powerpointFileName}`}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded text-xs flex items-center gap-1.5 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.downloadPowerpoint}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* B. WORD DOCUMENT VIEWER */}
            {isWord && (
              <div className="w-full max-w-3xl h-full overflow-y-auto bg-stone-900 border border-stone-800 rounded-lg p-6 sm:p-10 text-stone-200 space-y-6 shadow-xl">
                <div className="border-b border-stone-800 pb-4">
                  <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-1">
                    MICROSOFT WORD ARCHIVAL MANUSCRIPT (.DOCX)
                  </div>
                  <h1 className="text-2xl font-serif font-semibold text-stone-100">
                    {item.exif.title || item.name}
                  </h1>
                  <div className="text-xs text-stone-400 mt-2 flex items-center gap-3">
                    <span>Author: {item.exif.author || 'Anonymous'}</span>
                    <span>·</span>
                    <span>{item.exif.wordCount?.toLocaleString() || 8400} words</span>
                    <span>·</span>
                    <span>Revision: {item.exif.revisionNumber || 'v1.0'}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-stone-300 text-sm leading-relaxed space-y-4 whitespace-pre-wrap font-serif">
                  {item.wordPreviewText || item.summary}
                </div>

                <div className="pt-6 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span>Document formatted for curatorial peer review and long-term storage.</span>
                  {isDownloadAllowed && (
                    <button
                      onClick={() => onDownload(item)}
                      className="px-4 py-2 bg-stone-100 text-stone-900 rounded font-semibold hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadWord}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* C. PRESENTATION SLIDE DECK VIEWER (PPTX, PPT, ODP) */}
            {isPresentation && (
              <div className="w-full max-w-3xl h-full overflow-y-auto bg-stone-900 border border-stone-800 rounded-lg p-6 sm:p-10 text-stone-200 space-y-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="border-b border-stone-800 pb-4">
                    <div className="text-xs uppercase tracking-widest text-amber-500 font-mono mb-1">
                      {item.exif.presentationFormat || 'PRESENTATION SLIDE DECK (PPTX / PPT / ODP)'}
                    </div>
                    <h1 className="text-2xl font-serif font-semibold text-stone-100">
                      {item.exif.title || item.name}
                    </h1>
                    <div className="text-xs text-stone-400 mt-2 flex items-center gap-3">
                      <span>Presenter: {item.exif.author || 'Keynote Speaker'}</span>
                      <span>·</span>
                      <span>{item.exif.slideCount || 48} Slides</span>
                      <span>·</span>
                      <span>16:9 Widescreen</span>
                    </div>
                  </div>

                  <div className="py-6 space-y-3">
                    <div className="p-4 bg-stone-950 rounded border border-stone-800 text-xs text-stone-300 leading-relaxed font-serif">
                      {item.summary}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Slide presentation deck verified. Ready for presentation in PowerPoint, LibreOffice Impress, or Keynote.
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span>Accompanying vector assets and slide annotations preserved.</span>
                  {isDownloadAllowed && (
                    <button
                      onClick={() => onDownload(item)}
                      className="px-4 py-2 bg-amber-500 text-stone-950 font-semibold rounded hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadPresentation} ({item.originalFileName.split('.').pop()?.toUpperCase()})</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* C. IMAGE VIEWER */}
            {isImage && (
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-200 overflow-auto"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="max-h-[85vh] max-w-[90vw] object-contain rounded border border-stone-800 shadow-2xl"
                />
              </div>
            )}

            {/* D. PDF EMBEDDED VIEWER */}
            {isPdf && (
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <object
                  data={`${item.url}#toolbar=0&navpanes=0&scrollbar=1`}
                  type="application/pdf"
                  className="w-full h-full rounded border border-stone-800 shadow-lg bg-stone-900"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-stone-900 rounded border border-stone-800">
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="max-h-64 object-contain mb-4 rounded border border-stone-800"
                      />
                    )}
                    <h4 className="text-base font-serif font-medium text-stone-200 mb-2">
                      {item.exif.title || item.name}
                    </h4>
                    <p className="text-xs text-stone-400 max-w-md mb-4">
                      Browser preview rendered. Use direct window or download controls.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onOpenNewTab(item)}
                        className="px-4 py-2 bg-stone-100 text-stone-900 text-xs font-semibold rounded hover:bg-white transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t.openNewTab}</span>
                      </button>
                      {isDownloadAllowed && (
                        <button
                          onClick={() => onDownload(item)}
                          className="px-4 py-2 bg-stone-800 text-stone-200 text-xs font-medium rounded hover:bg-stone-700 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{t.downloadPdf}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </object>
              </div>
            )}

          </div>

          {/* Collapsible Metadata / EXIF Inspector Drawer */}
          {showMetadataPanel && (
            <aside
              role="complementary"
              aria-label={t.exifInspector}
              className="w-80 sm:w-96 bg-stone-900 border-s border-stone-800 p-5 overflow-y-auto space-y-6 shrink-0 animate-in slide-in-from-right duration-200"
            >
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-400" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                    {t.exifInspector}
                  </span>
                </div>
                <button
                  onClick={() => setShowMetadataPanel(false)}
                  className="text-stone-500 hover:text-stone-300 p-1 rounded focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  aria-label={t.closeDialog}
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Public Front-End EXIF (governed by Admin rules) */}
              <div className="space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">
                  {t.extractedMetadata}
                </div>

                <dl className="text-xs space-y-2.5 divide-y divide-stone-800/60">
                  {exifSettings.showTitle && item.exif.title && (
                    <div className="pt-2">
                      <dt className="text-[11px] text-stone-400">{t.fieldTitle}</dt>
                      <dd className="font-serif font-medium text-stone-200 mt-0.5">{item.exif.title}</dd>
                    </div>
                  )}

                  {exifSettings.showAuthor && item.exif.author && (
                    <div className="pt-2">
                      <dt className="text-[11px] text-stone-400">{t.fieldAuthor}</dt>
                      <dd className="text-stone-200 mt-0.5">{item.exif.author}</dd>
                    </div>
                  )}

                  {exifSettings.showSubject && item.exif.subject && (
                    <div className="pt-2">
                      <dt className="text-[11px] text-stone-400">{t.fieldSubject}</dt>
                      <dd className="text-stone-300 mt-0.5">{item.exif.subject}</dd>
                    </div>
                  )}

                  {isVideo && item.exif.videoDuration && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldVideoDuration}</dt>
                      <dd className="font-mono tabular-nums text-amber-400">{item.exif.videoDuration}</dd>
                    </div>
                  )}

                  {isVideo && item.exif.videoCodec && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">Codec & Profile</dt>
                      <dd className="font-mono text-stone-300 text-[11px]">{item.exif.videoCodec}</dd>
                    </div>
                  )}

                  {isWord && item.exif.wordCount && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldWordCount}</dt>
                      <dd className="font-mono tabular-nums text-stone-200">{item.exif.wordCount.toLocaleString()} {t.words}</dd>
                    </div>
                  )}

                  {isImage && item.exif.cameraModel && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldProducer}</dt>
                      <dd className="text-stone-200">{item.exif.cameraModel}</dd>
                    </div>
                  )}

                  {exifSettings.showCreationDate && item.exif.creationDate && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldCreationDate}</dt>
                      <dd className="font-mono tabular-nums text-stone-300">{item.exif.creationDate}</dd>
                    </div>
                  )}

                  {exifSettings.showFileSize && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldFileSize}</dt>
                      <dd className="font-mono tabular-nums text-stone-300">
                        {(item.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </dd>
                    </div>
                  )}

                  {exifSettings.showDimensions && item.exif.dimensions && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldDimensions}</dt>
                      <dd className="text-stone-300">{item.exif.dimensions}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Admin Back End View: Shows ALL Raw Metadata */}
              {isAdmin && (
                <div className="pt-4 border-t border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t.rawExifData}
                    </span>
                    <button
                      onClick={handleCopyRawExif}
                      className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                      title={t.copyMetadata}
                    >
                      {copiedRaw ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRaw ? t.copied : t.copyMetadata}</span>
                    </button>
                  </div>

                  <pre className="p-3 bg-stone-950 rounded border border-stone-800 text-[10px] font-mono text-stone-300 overflow-x-auto max-h-48 whitespace-pre-wrap">
                    {JSON.stringify(item.exif, null, 2)}
                  </pre>
                </div>
              )}

            </aside>
          )}

        </div>

      </div>

    </div>
  );
};
