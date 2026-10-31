/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ar' | 'ja';

export type FileType = 'pdf' | 'video' | 'image' | 'word' | 'presentation';

export type SortField = 'name' | 'size' | 'uploadDate' | 'title' | 'author' | 'pageCount' | 'creationDate' | 'fileType';
export type SortOrder = 'asc' | 'desc';

export interface ExifMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator?: string;
  producer?: string;
  creationDate?: string; // ISO date string
  modDate?: string;
  pageCount?: number;
  pdfVersion?: string;
  fileSize: number; // in bytes
  dimensions?: string; // e.g. "1920 × 1080" or "A4 (210 × 297 mm)"
  colorSpace?: string;
  trapped?: string;
  // Video specific metadata (no duration cap; server PHP settings control file size)
  videoDuration?: string; // arbitrary duration e.g. "01:45:20" or "18:42"
  videoResolution?: string; // e.g. "1080p Full HD (1920x1080)"
  videoCodec?: string; // e.g. "H.264 / AAC", "VP9 / Opus"
  videoFps?: number; // e.g. 60
  // Word & Document specific metadata (docx, doc, odt)
  wordCount?: number;
  paragraphCount?: number;
  revisionNumber?: string;
  documentStandard?: string; // e.g. "OpenDocument v1.3", "Word 97-2004", "OpenXML"
  // Presentation specific metadata (pptx, ppt, odp)
  slideCount?: number;
  presentationFormat?: string; // e.g. "ODP / OpenDocument", "PowerPoint 97-2004", "PPTX 16:9"
  // Image specific metadata (jpg, png, webp, gif)
  cameraModel?: string;
  lensModel?: string;
  iso?: number;
  focalLength?: string;
  isAnimatedGif?: boolean;
  rawExif?: Record<string, string | number | undefined>;
}

// Backwards compatibility alias
export type PdfExifMetadata = ExifMetadata;

export interface ExifDisplaySettings {
  showTitle: boolean;
  showAuthor: boolean;
  showSubject: boolean;
  showKeywords: boolean;
  showCreationDate: boolean;
  showPageCount: boolean;
  showProducer: boolean;
  showFileSize: boolean;
  showPdfVersion: boolean;
  showDimensions: boolean;
  showVideoDuration: boolean;
  showWordCount: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  originalFileName: string;
  fileType: FileType;
  folderId: string;
  tags: string[];
  uploadDate: string; // ISO string
  fileSize: number; // bytes
  allowDownload: boolean; // file-specific override
  url: string; // blob URL, data URL or remote path
  thumbnailUrl?: string; // preview image or animated GIF URL
  exif: ExifMetadata;
  order: number;
  summary?: string;
  language?: string;
  
  // Specific to Video files: dual download link capabilities (Uploaded video + Original PowerPoint/ODP presentation)
  powerpointUrl?: string; // URL / blob to original presentation slide deck (.pptx, .ppt, .odp)
  powerpointFileName?: string; // e.g. "Keynote_Presentation_Slides.pptx" or ".odp" or ".ppt"
  powerpointFileSize?: number; // bytes
  allowPowerpointDownload?: boolean; // toggle for presentation slide deck download
  
  // Word / Document preview text (docx, doc, odt)
  wordPreviewText?: string;
}

// Backwards compatibility alias
export type PdfItem = MediaItem;

export interface PdfFolder {
  id: string;
  name: string;
  nameTranslations?: {
    en: string;
    ar: string;
    ja: string;
  };
  description?: string;
  tags: string[];
  allowDownload: boolean; // folder-wide toggle
  visibleInFrontend: boolean; // show / hide album
  order: number;
  coverImage?: string;
}

export interface AdminConfig {
  version: string;
  passwordHash: string; // SHA-256 hash
  salt: string;
  galleryTitle: string;
  gallerySubtitle: string;
  defaultLanguage: Language;
  allowGlobalDownloads: boolean;
  exifSettings: ExifDisplaySettings;
  customCssEnabled: boolean;
  showRssWidget?: boolean;
}
