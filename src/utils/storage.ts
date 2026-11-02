/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { dump, load } from 'js-yaml';
import { AdminConfig, MediaItem, PdfFolder } from '../types';
import {
  INITIAL_ADMIN_CONFIG,
  INITIAL_FOLDERS,
  generateInitialItems
} from './sampleData';

const STORAGE_KEY_FOLDERS = 'foliovault_folders_v2';
const STORAGE_KEY_ITEMS = 'foliovault_items_v2';
const STORAGE_KEY_CONFIG = 'foliovault_config_v2';

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

export function loadStoredItems(): MediaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(item => {
          if (!item.url) {
            const dummyBlob = new Blob([`FolioVault Media Content: ${item.name}`], { type: 'text/plain' });
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

export function saveStoredItems(items: MediaItem[]): void {
  try {
    const sanitized = items.map(item => ({
      ...item,
      url: item.url.startsWith('blob:') ? '' : item.url,
      powerpointUrl: item.powerpointUrl?.startsWith('blob:') ? '' : item.powerpointUrl,
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

export function exportGalleryToYaml(folders: PdfFolder[], items: MediaItem[], config: AdminConfig, versionProfile: 'v1' | 'v2' = 'v2'): string {
  const isV1 = versionProfile === 'v1';
  const filteredItems = isV1 ? items.filter(i => i.fileType === 'pdf') : items;

  const exportPayload = {
    foliovault_version: isV1 ? '1.0.0' : '2.1.0',
    foliovault_profile: isV1 ? 'v1_pdf_only' : 'v2_multi_format',
    exported_at: new Date().toISOString(),
    settings: {
      version: isV1 ? '1.0.0' : (config.version || '2.1.0'),
      galleryTitle: isV1 ? `${config.galleryTitle} (v1 PDF Gallery)` : config.galleryTitle,
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
    media_items: filteredItems.map(i => ({
      id: i.id,
      name: i.name,
      originalFileName: i.originalFileName,
      fileType: i.fileType || 'pdf',
      folderId: i.folderId,
      tags: i.tags,
      uploadDate: i.uploadDate,
      fileSize: i.fileSize,
      allowDownload: i.allowDownload,
      order: i.order,
      summary: i.summary,
      exif: i.exif,
      ...(isV1 ? {} : {
        powerpointFileName: i.powerpointFileName,
        powerpointFileSize: i.powerpointFileSize,
        allowPowerpointDownload: i.allowPowerpointDownload,
      })
    }))
  };

  return dump(exportPayload, { indent: 2, lineWidth: -1 });
}

export function importGalleryFromYaml(yamlContent: string): {
  folders?: PdfFolder[];
  items?: Partial<MediaItem>[];
  settings?: Partial<AdminConfig>;
} {
  const parsed = load(yamlContent) as any;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid YAML format');
  }

  return {
    folders: parsed.folders,
    items: parsed.media_items || parsed.documents,
    settings: parsed.settings,
  };
}

export function generateSingleHtmlBundle(folders: PdfFolder[], items: MediaItem[], config: AdminConfig, versionProfile: 'v1' | 'v2' = 'v2'): string {
  const isV1 = versionProfile === 'v1';
  const filteredItems = isV1 ? items.filter(i => i.fileType === 'pdf') : items;

  const jsonCatalog = JSON.stringify({
    config,
    versionProfile,
    folders,
    items: filteredItems.map(i => ({
      ...i,
      url: i.url.startsWith('blob:') ? '' : i.url,
      powerpointUrl: i.powerpointUrl?.startsWith('blob:') ? '' : i.powerpointUrl
    }))
  });

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.galleryTitle} (${isV1 ? 'v1.0 PDF Gallery' : 'v2.1 Multi-Format'})</title>
  <meta name="description" content="${config.gallerySubtitle}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Optional additional site stylesheet import -->
  <!-- <link rel="stylesheet" href="/site-theme.css"> -->
  <link rel="alternate" type="application/rss+xml" title="${config.galleryTitle} - Recently Added" href="recently_added.rss">
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
      <h1 class="text-xl font-bold tracking-tight text-stone-900 font-serif">${config.galleryTitle} <span class="text-xs font-mono font-normal text-stone-500">v2.1</span></h1>
      <p class="text-xs text-stone-500">${config.gallerySubtitle}</p>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="downloadStandaloneRss()" class="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded font-medium hover:bg-amber-100 flex items-center gap-1.5">
        <span>RSS Feed (recently_added.rss)</span>
      </button>
      <span class="text-xs bg-stone-100 text-stone-700 px-2.5 py-1.5 rounded font-mono">Multi-Format Bundle</span>
    </div>
  </header>
  <main class="max-w-7xl mx-auto px-6 py-8">
    <div id="gallery-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
  </main>
  <script>
    const CATALOG = ${jsonCatalog};
    const container = document.getElementById('gallery-container');
    
    function downloadStandaloneRss() {
      const latest = CATALOG.items.slice().sort(function(a, b) {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }).slice(0, 10);
      
      let itemsXml = '';
      latest.forEach(function(item) {
        const title = (item.exif && item.exif.title) ? item.exif.title : item.name;
        const thumb = item.thumbnailUrl ? '<media:thumbnail url="' + item.thumbnailUrl + '" />' : '';
        itemsXml += '<item><title>' + title + '</title><link>' + (item.url || '#') + '</link><pubDate>' + new Date(item.uploadDate).toUTCString() + '</pubDate><enclosure url="' + (item.url || '#') + '" length="' + item.fileSize + '" type="application/octet-stream" /><media:content url="' + (item.url || '#') + '" fileSize="' + item.fileSize + '" medium="' + (item.fileType === 'video' ? 'video' : 'document') + '" />' + thumb + '</item>';
      });
      
      const rss = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>' + ${JSON.stringify(config.galleryTitle)} + ' - Recently Added</title><description>' + ${JSON.stringify(config.gallerySubtitle)} + '</description><atom:link href="recently_added.rss" rel="self" type="application/rss+xml" />' + itemsXml + '</channel></rss>';
      
      const blob = new Blob([rss], { type: 'application/rss+xml;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'recently_added.rss';
      a.click();
    }

    CATALOG.items.forEach(function(doc) {
      const folder = CATALOG.folders.find(function(f) { return f.id === doc.folderId; });
      const isVideo = doc.fileType === 'video';
      const card = document.createElement('article');
      card.className = "bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col";
      
      let extraActions = '';
      if (isVideo && doc.powerpointFileName) {
        extraActions = '<div class="mt-2 text-[11px] text-stone-500">Includes original slide deck: <strong>' + doc.powerpointFileName + '</strong></div>';
      }

      card.innerHTML = '<div class="h-48 bg-stone-100 flex items-center justify-center p-4 border-b border-stone-100 relative">' +
        '<img src="' + (doc.thumbnailUrl || '') + '" alt="' + doc.name + '" class="max-h-full max-w-full object-contain shadow-sm" onerror="this.style.display=\\'none\\'">' +
        '<span class="absolute top-2 end-2 bg-stone-900 text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded">' + doc.fileType.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="p-5 flex-1 flex flex-col justify-between">' +
        '<div>' +
        '<div class="text-xs text-stone-500 mb-1 font-medium">' + (folder ? folder.name : 'Archive') + '</div>' +
        '<h2 class="text-base font-semibold text-stone-900 mb-2 leading-snug">' + ((doc.exif && doc.exif.title) ? doc.exif.title : doc.name) + '</h2>' +
        '<p class="text-xs text-stone-600 line-clamp-2 mb-3">' + (doc.summary || '') + '</p>' +
        extraActions +
        '</div>' +
        '<div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">' +
        '<span class="text-stone-500 font-mono">' + (doc.fileSize / 1024 / 1024).toFixed(1) + ' MB</span>' +
        '<span class="text-stone-700 font-medium">' + ((doc.exif && doc.exif.author) ? doc.exif.author : 'Archival Record') + '</span>' +
        '</div>' +
        '</div>';
      container.appendChild(card);
    });
  </script>
</body>
</html>`;
}

/**
 * Standard PHP 8.1+ / 8.2+ / 8.3+ directory scanner code for users deploying on LAMP/Nginx servers without SQL.
 * Now enhanced with:
 * - Extensions: pdf, mp4, webm, mov, docx, doc, odt, pptx, ppt, odp, jpg, jpeg, png, webp, gif
 * - Media RSS 2.0 Feed Generator: serves "recently_added.rss" for the 10 latest additions with media & thumbnails!
 * - Unbounded video duration (decided by PHP max upload limits: upload_max_filesize, post_max_size)
 * - Automatic pairing of .pptx, .ppt, or .odp slide decks with video files!
 */
export const PHP_SCANNER_GUIDE = `<?php
/**
 * FolioVault v2.1 Databaseless Directory Scanner & Media RSS Engine for PHP
 * Compatible with: PHP 8.1, PHP 8.2, PHP 8.3+
 * Zero Database. Flat file directory scanner with dual download & Media RSS support.
 *
 * SERVER CONFIGURATION (php.ini or .htaccess or .user.ini)
 * Videos have no duration limits; upload size is determined by PHP settings:
 *   upload_max_filesize = 2048M   ; 2GB or higher as needed
 *   post_max_size = 2048M
 *   memory_limit = 512M
 *   max_execution_time = 600
 *   max_input_time = 600
 */

$documentsDir = __DIR__ . '/documents';
if (!is_dir($documentsDir)) {
    mkdir($documentsDir, 0755, true);
}

$albums = [];
$allMediaFlat = [];
$folders = array_diff(scandir($documentsDir), ['.', '..']);

foreach ($folders as $folder) {
    $folderPath = $documentsDir . '/' . $folder;
    if (is_dir($folderPath)) {
        // Match PDF, MP4, WebM, MOV, DOCX, DOC, ODT, PPTX, PPT, ODP, JPG, PNG, WebP, GIF
        $pattern = $folderPath . '/*.{pdf,mp4,webm,mov,docx,doc,odt,pptx,ppt,odp,jpg,jpeg,png,webp,gif}';
        $files = glob($pattern, GLOB_BRACE);
        $media = [];

        foreach ($files as $file) {
            $baseName = basename($file);
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

            $type = match($ext) {
                'mp4', 'webm', 'mov' => 'video',
                'pptx', 'ppt', 'odp' => 'presentation',
                'docx', 'doc', 'odt' => 'word',
                'jpg', 'jpeg', 'png', 'webp', 'gif' => 'image',
                default => 'pdf',
            };

            $item = [
                'name' => $baseName,
                'fileType' => $type,
                'extension' => $ext,
                'size' => filesize($file),
                'modified' => date('c', filemtime($file)),
                'folder' => $folder,
                'url' => 'documents/' . rawurlencode($folder) . '/' . rawurlencode($baseName)
            ];

            // For video files: auto-detect paired PowerPoint or ODP slide deck (.pptx, .ppt, .odp)!
            if ($type === 'video') {
                $baseWithoutExt = pathinfo($file, PATHINFO_FILENAME);
                $deckExtensions = ['pptx', 'ppt', 'odp'];
                foreach ($deckExtensions as $deckExt) {
                    $deckCandidate = $folderPath . '/' . $baseWithoutExt . '.' . $deckExt;
                    if (file_exists($deckCandidate)) {
                        $item['powerpointUrl'] = 'documents/' . rawurlencode($folder) . '/' . rawurlencode(basename($deckCandidate));
                        $item['powerpointFileName'] = basename($deckCandidate);
                        $item['powerpointFileSize'] = filesize($deckCandidate);
                        break;
                    }
                }
            }

            $media[] = $item;
            $allMediaFlat[] = $item;
        }

        $albums[] = [
            'folder' => $folder,
            'count' => count($media),
            'items' => $media
        ];
    }
}

// FEATURE: Serve recently_added.rss (Media RSS 2.0 with thumbnails & 10 latest additions)
$requestUri = basename($_SERVER['REQUEST_URI'] ?? '');
if (isset($_GET['rss']) || $requestUri === 'recently_added.rss') {
    header('Content-Type: application/rss+xml; charset=utf-8');
    header('Access-Control-Allow-Origin: *');

    usort($allMediaFlat, fn($a, $b) => strcmp($b['modified'], $a['modified']));
    $latestTen = array_slice($allMediaFlat, 0, 10);
    $host = 'http://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">' . "\n";
    echo '  <channel>' . "\n";
    echo '    <title>FolioVault - Recently Added</title>' . "\n";
    echo '    <link>' . $host . '</link>' . "\n";
    echo '    <description>Latest 10 additions to the repository with Media RSS</description>' . "\n";
    echo '    <lastBuildDate>' . date(DATE_RSS) . '</lastBuildDate>' . "\n";
    echo '    <atom:link href="' . $host . '/recently_added.rss" rel="self" type="application/rss+xml" />' . "\n";

    foreach ($latestTen as $item) {
        $pubDate = date(DATE_RSS, strtotime($item['modified']));
        $mime = match($item['fileType']) {
            'video' => 'video/mp4',
            'image' => 'image/jpeg',
            'presentation' => 'application/vnd.ms-powerpoint',
            'word' => 'application/msword',
            default => 'application/pdf',
        };
        $medium = match($item['fileType']) {
            'video' => 'video',
            'image' => 'image',
            default => 'document',
        };
        $itemLink = $host . '/' . $item['url'];

        echo "    <item>\n";
        echo '      <title>' . htmlspecialchars($item['name']) . "</title>\n";
        echo '      <link>' . htmlspecialchars($itemLink) . "</link>\n";
        echo '      <guid isPermaLink="false">' . md5($item['url']) . "</guid>\n";
        echo '      <pubDate>' . $pubDate . "</pubDate>\n";
        echo '      <category>' . htmlspecialchars($item['folder']) . "</category>\n";
        echo '      <enclosure url="' . htmlspecialchars($itemLink) . '" length="' . $item['size'] . '" type="' . $mime . "\" />\n";
        echo '      <media:content url="' . htmlspecialchars($itemLink) . '" fileSize="' . $item['size'] . '" type="' . $mime . '" medium="' . $medium . "\" />\n";
        if (!empty($item['powerpointFileName'])) {
            echo '      <media:peer url="' . htmlspecialchars($host . '/' . $item['powerpointUrl']) . '" type="application/vnd.ms-powerpoint" role="companion" />' . "\n";
        }
        echo "    </item>\n";
    }

    echo "  </channel>\n";
    echo "</rss>\n";
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
echo json_encode(['status' => 'success', 'albums' => $albums], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
`;
