/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ar' | 'ja';

export type SortField = 'name' | 'size' | 'uploadDate' | 'title' | 'author' | 'pageCount' | 'creationDate';
export type SortOrder = 'asc' | 'desc';

export interface PdfExifMetadata {
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
  dimensions?: string; // e.g. "A4 (210 × 297 mm)"
  colorSpace?: string;
  trapped?: string;
  rawExif?: Record<string, string | number | undefined>;
}

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
}

export interface PdfItem {
  id: string;
  name: string;
  originalFileName: string;
  folderId: string;
  tags: string[];
  uploadDate: string; // ISO string
  fileSize: number; // bytes
  allowDownload: boolean; // file-specific override
  url: string; // blob URL, data URL or remote path
  thumbnailUrl?: string; // preview image
  exif: PdfExifMetadata;
  order: number;
  summary?: string;
  language?: string;
}

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
  passwordHash: string; // SHA-256 hash
  salt: string;
  galleryTitle: string;
  gallerySubtitle: string;
  defaultLanguage: Language;
  allowGlobalDownloads: boolean;
  exifSettings: ExifDisplaySettings;
  customCssEnabled: boolean;
}
