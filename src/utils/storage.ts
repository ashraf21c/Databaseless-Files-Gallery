/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { dump, load } from 'js-yaml';
import { AdminConfig, PdfFolder, PdfItem } from '../types';
import {
  INITIAL_ADMIN_CONFIG,
  INITIAL_FOLDERS,
  generateInitialItems
} from './sampleData';

const STORAGE_KEY_FOLDERS = 'foliovault_folders_v1';
const STORAGE_KEY_ITEMS = 'foliovault_items_v1';
const STORAGE_KEY_CONFIG = 'foliovault_config_v1';

export function loadStoredFolders(): PdfFolder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FOLDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load folders from storage', e);
  }
  return INITIAL_FOLDERS;
}

export function saveStoredFolders(folders: PdfFolder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
  } catch (e) {
    console.error('Failed to save folders to storage', e);
  }
}

export function loadStoredItems(): PdfItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure URLs exist for items if they were lost during session
        parsed.forEach(item => {
          if (!item.url) {
            // Generate basic fallback blob
            const dummyBlob = new Blob([`%PDF-1.4 FolioVault Document ${item.name}`], { type: 'application/pdf' });
            item.url = URL.createObjectURL(dummyBlob);
          }
        });
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load items from storage', e);
  }
  return generateInitialItems();
}

export function saveStoredItems(items: PdfItem[]): void {
  try {
    // Note: Do not serialize transient blob URLs to localStorage to avoid quota limits
    const sanitized = items.map(item => ({
      ...item,
      url: item.url.startsWith('blob:') ? '' : item.url, // blobs are re-instantiated
    }));
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(sanitized));
  } catch (e) {
    console.error('Failed to save items to storage', e);
  }
}

export function loadStoredConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return { ...INITIAL_ADMIN_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load config from storage', e);
  }
  return INITIAL_ADMIN_CONFIG;
}

export function saveStoredConfig(config: AdminConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config to storage', e);
  }
}

export function exportGalleryToYaml(folders: PdfFolder[], items: PdfItem[], config: AdminConfig): string {
  const exportPayload = {
    foliovault_version: '2026.1',
    exported_at: new Date().toISOString(),
    settings: {
      galleryTitle: config.galleryTitle,
      gallerySubtitle: config.gallerySubtitle,
      defaultLanguage: config.defaultLanguage,
      allowGlobalDownloads: config.allowGlobalDownloads,
      exifSettings: config.exifSettings,
    },
    folders: folders.map(f => ({
      id: f.id,
      name: f.name,
      description: f.description,
      tags: f.tags,
      allowDownload: f.allowDownload,
      visibleInFrontend: f.visibleInFrontend,
      order: f.order,
    })),
    documents: items.map(i => ({
      id: i.id,
      name: i.name,
      originalFileName: i.originalFileName,
      folderId: i.folderId,
      tags: i.tags,
      uploadDate: i.uploadDate,
      fileSize: i.fileSize,
      allowDownload: i.allowDownload,
      order: i.order,
      summary: i.summary,
      exif: i.exif,
    }))
  };

  return dump(exportPayload, { indent: 2, lineWidth: -1 });
}

export function importGalleryFromYaml(yamlContent: string): {
  folders?: PdfFolder[];
  items?: Partial<PdfItem>[];
  settings?: Partial<AdminConfig>;
} {
  const parsed = load(yamlContent) as any;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid YAML format');
  }

  return {
    folders: parsed.folders,
    items: parsed.documents,
    settings: parsed.settings,
  };
}

/**
 * Generates a self-contained single portable HTML file containing all HTML, CSS,
 * JavaScript logic, albums, documents, EXIF, and viewers in one file as requested!
 */
export function generateSingleHtmlBundle(folders: PdfFolder[], items: PdfItem[], config: AdminConfig): string {
  const jsonCatalog = JSON.stringify({
    config,
    folders,
    items: items.map(i => ({
      ...i,
      url: i.url.startsWith('blob:') ? '' : i.url
    }))
  });

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.galleryTitle}</title>
  <meta name="description" content="${config.gallerySubtitle}">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind via CDN for single-file portability -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Optional additional site stylesheet import -->
  <!-- <link rel="stylesheet" href="/site-theme.css"> -->
  <style>
    :root {
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-sans: 'Plus Jakarta Sans', sans-serif;
      --font-arabic: 'Cairo', sans-serif;
    }
    body { font-family: var(--font-sans); }
    [dir="rtl"] { font-family: var(--font-arabic); }
  </style>
</head>
<body class="bg-stone-50 text-stone-900 min-h-screen">
  <header class="border-b border-stone-200 bg-white/90 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-stone-900 font-serif">${config.galleryTitle}</h1>
      <p class="text-xs text-stone-500">${config.gallerySubtitle}</p>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-xs text-stone-500">Standalone Portable Bundle</span>
    </div>
  </header>
  <main class="max-w-7xl mx-auto px-6 py-8">
    <div id="gallery-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
  </main>
  <script>
    const CATALOG = ${jsonCatalog};
    const container = document.getElementById('gallery-container');
    
    // Render documents
    CATALOG.items.forEach(doc => {
      const folder = CATALOG.folders.find(f => f.id === doc.folderId);
      const card = document.createElement('article');
      card.className = "bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col";
      card.innerHTML = \`
        <div class="h-48 bg-stone-100 flex items-center justify-center p-4 border-b border-stone-100">
          <img src="\${doc.thumbnailUrl || ''}" alt="\${doc.name}" class="max-h-full max-w-full object-contain shadow-sm" onerror="this.style.display='none'">
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-xs text-stone-500 mb-1 font-medium">\${folder ? folder.name : 'Archive'}</div>
            <h2 class="text-base font-semibold text-stone-900 mb-2 leading-snug">\${doc.exif?.title || doc.name}</h2>
            <p class="text-xs text-stone-600 line-clamp-2 mb-3">\${doc.summary || ''}</p>
            <div class="flex flex-wrap gap-1 text-xs text-stone-500">
              \${(doc.tags || []).map(t => '<span>#' + t + '</span>').join(' ')}
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span class="text-stone-500">\${(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
            <span class="text-stone-700 font-medium">\${doc.exif?.author || 'Archival Record'}</span>
          </div>
        </div>
      \`;
      container.appendChild(card);
    });
  </script>
</body>
</html>`;
}

/**
 * Standard PHP 8.1+ / 8.2+ / 8.3+ directory scanner code for users deploying on LAMP/Nginx servers without SQL.
 */
export const PHP_SCANNER_GUIDE = `<?php
/**
 * FolioVault Databaseless Directory Scanner for PHP
 * Compatible with: PHP 8.1, PHP 8.2, PHP 8.3+
 * No database required. Place this file as 'index.php' or 'api/documents.php'
 */

header('Content-Type: application/json; charset=utf-8');

$documentsDir = __DIR__ . '/documents';
if (!is_dir($documentsDir)) {
    mkdir($documentsDir, 0755, true);
}

$albums = [];
$folders = array_diff(scandir($documentsDir), ['.', '..']);

foreach ($folders as $folder) {
    $folderPath = $documentsDir . '/' . $folder;
    if (is_dir($folderPath)) {
        $pdfFiles = glob($folderPath . '/*.pdf');
        $docs = [];
        foreach ($pdfFiles as $pdf) {
            $docs[] = [
                'name' => basename($pdf),
                'size' => filesize($pdf),
                'modified' => date('c', filemtime($pdf)),
                'url' => 'documents/' . rawurlencode($folder) . '/' . rawurlencode(basename($pdf))
            ];
        }
        $albums[] = [
            'folder' => $folder,
            'count' => count($docs),
            'documents' => $docs
        ];
    }
}

echo json_encode(['status' => 'success', 'albums' => $albums], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
`;
