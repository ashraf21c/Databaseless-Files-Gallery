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
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Copy,
  Check,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ExifDisplaySettings, Language, PdfFolder, PdfItem } from '../types';
import { translations } from '../utils/translations';

interface InlinePdfViewerModalProps {
  item: PdfItem | null;
  folder?: PdfFolder;
  language: Language;
  exifSettings: ExifDisplaySettings;
  isAdmin: boolean;
  onClose: () => void;
  onOpenNewTab: (item: PdfItem) => void;
  onDownload: (item: PdfItem) => void;
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

  // Reset zoom on item change
  useEffect(() => {
    setZoom(100);
    setRotation(0);
  }, [item?.id]);

  if (!item) return null;

  const isDownloadAllowed = (folder ? folder.allowDownload : true) && item.allowDownload;
  const folderName = folder?.nameTranslations?.[language] || folder?.name || 'Archive';

  const handleCopyRawExif = () => {
    navigator.clipboard.writeText(JSON.stringify(item.exif, null, 2));
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      
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
                className="p-1.5 text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded transition-colors cursor-pointer"
                title={t.previousDoc}
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={onNavigateNext}
                disabled={!hasNext}
                className="p-1.5 text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded transition-colors cursor-pointer"
                title={t.nextDoc}
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>

            <div className="min-w-0 ms-1">
              <div className="text-xs font-serif font-medium text-stone-200 truncate max-w-md sm:max-w-xl">
                {item.exif.title || item.name}
              </div>
              <div className="text-[11px] text-stone-500 truncate flex items-center gap-2">
                <span>{folderName}</span>
                <span>·</span>
                <span>{item.originalFileName}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Zoom & Rotate controls */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-900 border border-stone-800 rounded px-1.5 py-1">
              <button
                onClick={() => setZoom(z => Math.max(50, z - 15))}
                className="p-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                title={t.zoomOut}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 tabular-nums text-stone-300">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(200, z + 15))}
                className="p-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                title={t.zoomIn}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3 bg-stone-700 mx-1" />
              <button
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="p-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                title={t.rotate}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Metadata Inspector */}
            <button
              onClick={() => setShowMetadataPanel(!showMetadataPanel)}
              className={`p-2 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                showMetadataPanel
                  ? 'bg-stone-800 text-stone-100'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
              title={t.exifInspector}
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline text-xs">EXIF</span>
            </button>

            {/* Open in New Window/Tab */}
            <button
              onClick={() => onOpenNewTab(item)}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-900 rounded transition-colors cursor-pointer"
              title={t.openNewTab}
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Download Button (or Disabled Indicator) */}
            {isDownloadAllowed ? (
              <button
                onClick={() => onDownload(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-white text-stone-900 rounded transition-colors cursor-pointer"
                title={t.downloadPdf}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.downloadPdf}</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-400 bg-stone-900 border border-stone-800 rounded select-none"
                title={t.downloadDisabledTip}
              >
                <Lock className="w-3.5 h-3.5 text-amber-500/80" />
                <span className="text-[11px] hidden sm:inline">{t.downloadDisabled}</span>
              </div>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer ml-1"
              aria-label={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 2. Modal Body: PDF Embedded Canvas / Object + Metadata Drawer */}
        <div className="flex-1 flex overflow-hidden bg-stone-950">
          
          {/* Main PDF Frame */}
          <div className="flex-1 relative overflow-auto flex items-center justify-center p-2 sm:p-4 bg-stone-950">
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {/* Inline PDF object embedding */}
              <object
                data={`${item.url}#toolbar=0&navpanes=0&scrollbar=1`}
                type="application/pdf"
                className="w-full h-full rounded border border-stone-800 shadow-lg bg-stone-900"
              >
                {/* Fallback if browser PDF plugin is unavailable */}
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
                    Your browser is rendering the document preview. You can also view it directly in a dedicated window.
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
          </div>

          {/* Collapsible Metadata / EXIF Inspector Drawer */}
          {showMetadataPanel && (
            <aside className="w-80 sm:w-96 bg-stone-900 border-s border-stone-800 p-5 overflow-y-auto space-y-6 shrink-0 animate-in slide-in-from-right duration-200">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                    {t.exifInspector}
                  </span>
                </div>
                <button
                  onClick={() => setShowMetadataPanel(false)}
                  className="text-stone-500 hover:text-stone-300"
                >
                  <X className="w-3.5 h-3.5" />
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

                  {exifSettings.showCreationDate && item.exif.creationDate && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldCreationDate}</dt>
                      <dd className="font-mono tabular-nums text-stone-300">{item.exif.creationDate}</dd>
                    </div>
                  )}

                  {exifSettings.showPageCount && item.exif.pageCount && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldPageCount}</dt>
                      <dd className="font-mono tabular-nums text-stone-300">{item.exif.pageCount} {t.pages}</dd>
                    </div>
                  )}

                  {exifSettings.showFileSize && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldFileSize}</dt>
                      <dd className="font-mono tabular-nums text-stone-300">
                        {(item.fileSize / (1024 * 1024)).toFixed(2)} MB ({item.fileSize.toLocaleString()} bytes)
                      </dd>
                    </div>
                  )}

                  {exifSettings.showDimensions && item.exif.dimensions && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldDimensions}</dt>
                      <dd className="text-stone-300">{item.exif.dimensions}</dd>
                    </div>
                  )}

                  {exifSettings.showPdfVersion && item.exif.pdfVersion && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[11px] text-stone-400">{t.fieldPdfVersion}</dt>
                      <dd className="font-mono text-stone-300">{item.exif.pdfVersion}</dd>
                    </div>
                  )}

                  {exifSettings.showProducer && item.exif.producer && (
                    <div className="pt-2">
                      <dt className="text-[11px] text-stone-400">{t.fieldProducer}</dt>
                      <dd className="text-stone-300 text-[11px] break-all">{item.exif.producer}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Admin Back End View: Shows ALL EXIF Fields, even those hidden from public! */}
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
                      <span>{copiedRaw ? t.copied : 'Copy'}</span>
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
