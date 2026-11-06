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
      const parsed = { ...INITIAL_ADMIN_CONFIG, ...JSON.parse(raw) };
      // Migrate legacy salted hash to standard unsalted SHA-256 for admin123
      if (parsed.passwordHash === '8b7fca13f738b55695ef2aeef33b0cfbc92bc4aa4dd38aa4d693be7bf7bfaafc') {
        parsed.passwordHash = INITIAL_ADMIN_CONFIG.passwordHash;
        parsed.salt = '';
        saveStoredConfig(parsed);
      }
      return parsed;
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
    foliovault_version: isV1 ? '1.0.0' : '2.0.0',
    foliovault_profile: isV1 ? 'v1_pdf_only' : 'v2_multi_format',
    exported_at: new Date().toISOString(),
    settings: {
      version: isV1 ? '1.0.0' : (config.version || '2.0.0'),
      galleryTitle: isV1 ? `${config.galleryTitle} (v1 PDF Gallery)` : config.galleryTitle,
      gallerySubtitle: config.gallerySubtitle,
      defaultLanguage: config.defaultLanguage,
      allowGlobalDownloads: config.allowGlobalDownloads,
      showRssWidget: config.showRssWidget !== false,
      passwordHash: config.passwordHash,
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

  const profileTitle = isV1 ? 'v1.0 (PDF-Only Archive)' : 'v2.0 (Multi-Format Archive)';
  const profileBadge = isV1 ? 'v1.0 PDF Folios' : 'v2.0 Multi-Format';

  return `<!doctype html>
<html lang="${config.defaultLanguage || 'en'}" dir="${config.defaultLanguage === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.galleryTitle} - ${profileTitle}</title>
  <meta name="description" content="${config.gallerySubtitle}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="alternate" type="application/rss+xml" title="${config.galleryTitle} - Recently Added" href="recently_added.rss">
  <style>
    :root {
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-arabic: 'Cairo', sans-serif;
      --font-jp: 'Noto Sans JP', sans-serif;
    }
    body { font-family: var(--font-sans); }
    [dir="rtl"] { font-family: var(--font-arabic); }
    [lang="ja"] { font-family: var(--font-jp); }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  </style>
</head>
<body class="bg-stone-50 text-stone-900 min-h-screen flex flex-col antialiased">

  <!-- Header -->
  <header class="border-b border-stone-200 bg-white/95 backdrop-blur sticky top-0 z-40 px-6 py-4">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-xl font-bold tracking-tight text-stone-900 font-serif">${config.galleryTitle}</h1>
          <span class="text-xs bg-stone-900 text-white font-mono px-2 py-0.5 rounded font-semibold">${profileBadge}</span>
        </div>
        <p class="text-xs text-stone-500 mt-0.5">${config.gallerySubtitle}</p>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap">
        <select id="lang-switcher" onchange="setLanguage(this.value)" class="text-xs bg-stone-100 border border-stone-200 rounded px-2.5 py-1.5 font-medium focus:outline-none">
          <option value="en">English</option>
          <option value="ar">العربية (RTL)</option>
          <option value="ja">日本語</option>
        </select>

        <button onclick="downloadStandaloneRss()" class="text-xs bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm">
          <span>RSS Feed (recently_added.rss)</span>
        </button>

        <button onclick="toggleRssWidget()" id="rss-widget-btn" class="text-xs bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 px-2.5 py-1.5 rounded font-medium transition-colors cursor-pointer">
          Toggle Widget
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl w-full mx-auto px-6 py-8 flex-1 space-y-6">

    <!-- RSS 2.0 Carousel Widget (Latest 10 Additions) -->
    <section id="rss-widget-container" class="p-4 bg-amber-50/70 border border-amber-200/90 rounded-xl space-y-3 shadow-sm ${config.showRssWidget !== false ? '' : 'hidden'}">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-amber-900">Recently Added (Latest 10 Media Additions)</h2>
        </div>
        <span class="text-[11px] font-mono text-amber-800">Media RSS 2.0</span>
      </div>

      <div id="rss-carousel" class="flex gap-4 overflow-x-auto pb-2 scroll-smooth"></div>
    </section>

    <!-- Filters & Search Toolbar -->
    <section class="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-3">
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div class="flex-1 relative">
          <input
            id="search-input"
            type="text"
            placeholder="Search documents, transcripts, authors, topics..."
            oninput="handleSearch(this.value)"
            class="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <select id="folder-filter" onchange="handleFolderFilter(this.value)" class="text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 font-medium focus:outline-none">
            <option value="all">All Collections</option>
          </select>

          ${!isV1 ? `
          <div id="format-filters" class="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs">
            <button onclick="handleFormatFilter('all')" data-format="all" class="format-btn px-2.5 py-1 rounded-md font-medium bg-white text-stone-900 shadow-xs">All</button>
            <button onclick="handleFormatFilter('pdf')" data-format="pdf" class="format-btn px-2.5 py-1 rounded-md font-medium text-stone-600">PDF</button>
            <button onclick="handleFormatFilter('video')" data-format="video" class="format-btn px-2.5 py-1 rounded-md font-medium text-stone-600">Video</button>
            <button onclick="handleFormatFilter('word')" data-format="word" class="format-btn px-2.5 py-1 rounded-md font-medium text-stone-600">Word</button>
            <button onclick="handleFormatFilter('image')" data-format="image" class="format-btn px-2.5 py-1 rounded-md font-medium text-stone-600">Image</button>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
        <span id="results-count">Loading items...</span>
        <span class="font-mono text-[11px]">${profileTitle}</span>
      </div>
    </section>

    <!-- Gallery Grid -->
    <section>
      <div id="gallery-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      <div id="empty-state" class="hidden text-center py-16 bg-white border border-dashed border-stone-300 rounded-xl">
        <p class="text-sm font-medium text-stone-600">No media items match your search or filter.</p>
        <button onclick="resetFilters()" class="mt-2 text-xs text-stone-900 underline font-medium cursor-pointer">Clear all filters</button>
      </div>
    </section>
  </main>

  <!-- Modal Preview Dialog -->
  <div id="viewer-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
    <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
      <div class="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <div>
          <span id="modal-type-badge" class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-900 text-white"></span>
          <h3 id="modal-title" class="text-sm font-semibold text-stone-900 mt-1"></h3>
        </div>
        <button onclick="closeModal()" class="text-stone-400 hover:text-stone-700 text-xl font-bold p-1 cursor-pointer">&times;</button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto space-y-4">
        <div id="modal-media-viewport" class="bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center min-h-48 border border-stone-200"></div>
        <p id="modal-desc" class="text-xs text-stone-600 leading-relaxed"></p>

        <div class="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
          <h4 class="font-semibold text-stone-800">EXIF Archival Metadata</h4>
          <div id="modal-exif-grid" class="grid grid-cols-2 gap-2 text-[11px]"></div>
        </div>

        <div id="modal-actions" class="flex items-center gap-3 pt-2"></div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="border-t border-stone-200 bg-white text-stone-500 py-6 text-xs mt-auto">
    <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>
        <span class="font-serif font-semibold text-stone-800">${config.galleryTitle}</span>
        <span class="mx-2">&middot;</span>
        <span>${profileTitle}</span>
      </div>
      <div class="text-[11px] font-mono">
        Databaseless Standalone Bundle &middot; Standards-Compliant RSS 2.0
      </div>
    </div>
  </footer>

  <script>
    const CATALOG = ${jsonCatalog};
    let currentFilter = 'all';
    let currentFolder = 'all';
    let currentSearch = '';
    let currentLanguage = '${config.defaultLanguage || 'en'}';

    // Populate Folder Filter Dropdown
    const folderSelect = document.getElementById('folder-filter');
    CATALOG.folders.forEach(function(f) {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = f.name;
      folderSelect.appendChild(opt);
    });

    // Populate RSS Carousel
    function renderRssCarousel() {
      const carousel = document.getElementById('rss-carousel');
      carousel.innerHTML = '';
      const latestTen = CATALOG.items.slice().sort(function(a, b) {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }).slice(0, 10);

      latestTen.forEach(function(item) {
        const itemCard = document.createElement('div');
        itemCard.className = "shrink-0 w-64 bg-white border border-amber-200 rounded-lg p-3 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between cursor-pointer";
        itemCard.onclick = function() { openModal(item); };

        const title = (item.exif && item.exif.title) ? item.exif.title : item.name;
        const author = (item.exif && item.exif.author) ? item.exif.author : 'Archival Record';
        const typeBadge = (item.fileType || 'pdf').toUpperCase();

        itemCard.innerHTML =
          '<div class="flex items-start gap-2.5">' +
          '<div class="w-12 h-14 bg-stone-100 rounded overflow-hidden shrink-0 border border-stone-200 flex items-center justify-center">' +
          (item.thumbnailUrl ? '<img src="' + item.thumbnailUrl + '" alt="" class="w-full h-full object-cover">' : '<span class="text-[10px] font-bold text-stone-400">' + typeBadge + '</span>') +
          '</div>' +
          '<div class="min-w-0 flex-1">' +
          '<span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">' + typeBadge + '</span>' +
          '<h3 class="text-xs font-semibold text-stone-900 truncate mt-1">' + title + '</h3>' +
          '<p class="text-[10px] text-stone-500 truncate">' + author + '</p>' +
          '</div>' +
          '</div>' +
          '<div class="mt-2.5 pt-2 border-t border-amber-100 flex items-center justify-between text-[10px] text-stone-500">' +
          '<span>' + (item.fileSize / 1024 / 1024).toFixed(1) + ' MB</span>' +
          '<span class="text-amber-700 font-medium">Inspect &rarr;</span>' +
          '</div>';

        carousel.appendChild(itemCard);
      });
    }

    // Toggle RSS Widget
    function toggleRssWidget() {
      const container = document.getElementById('rss-widget-container');
      container.classList.toggle('hidden');
    }

    // Filter Handlers
    function handleSearch(val) {
      currentSearch = (val || '').toLowerCase().trim();
      renderGallery();
    }

    function handleFolderFilter(val) {
      currentFolder = val;
      renderGallery();
    }

    function handleFormatFilter(val) {
      currentFilter = val;
      document.querySelectorAll('.format-btn').forEach(function(b) {
        if (b.getAttribute('data-format') === val) {
          b.className = "format-btn px-2.5 py-1 rounded-md font-medium bg-white text-stone-900 shadow-xs";
        } else {
          b.className = "format-btn px-2.5 py-1 rounded-md font-medium text-stone-600";
        }
      });
      renderGallery();
    }

    function resetFilters() {
      currentSearch = '';
      currentFolder = 'all';
      currentFilter = 'all';
      document.getElementById('search-input').value = '';
      document.getElementById('folder-filter').value = 'all';
      if (document.querySelectorAll('.format-btn').length > 0) {
        handleFormatFilter('all');
      } else {
        renderGallery();
      }
    }

    // Render Gallery
    function renderGallery() {
      const container = document.getElementById('gallery-container');
      const emptyState = document.getElementById('empty-state');
      container.innerHTML = '';

      const filtered = CATALOG.items.filter(function(item) {
        if (currentFolder !== 'all' && item.folderId !== currentFolder) return false;
        if (currentFilter !== 'all' && (item.fileType || 'pdf') !== currentFilter) return false;
        if (currentSearch) {
          const matchTitle = ((item.exif && item.exif.title) || item.name || '').toLowerCase().includes(currentSearch);
          const matchAuthor = ((item.exif && item.exif.author) || '').toLowerCase().includes(currentSearch);
          const matchDesc = (item.summary || '').toLowerCase().includes(currentSearch);
          const matchTags = (item.tags || []).some(function(t) { return t.toLowerCase().includes(currentSearch); });
          if (!matchTitle && !matchAuthor && !matchDesc && !matchTags) return false;
        }
        return true;
      });

      document.getElementById('results-count').textContent = filtered.length + ' item(s) available';

      if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        return;
      }
      emptyState.classList.add('hidden');

      filtered.forEach(function(doc) {
        const folder = CATALOG.folders.find(function(f) { return f.id === doc.folderId; });
        const isVideo = doc.fileType === 'video';
        const card = document.createElement('article');
        card.className = "bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between";

        let dualPptHtml = '';
        if (isVideo && doc.powerpointFileName) {
          dualPptHtml = '<div class="mt-2.5 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">' +
            '<span class="truncate">Companion Slide Deck: <strong>' + doc.powerpointFileName + '</strong></span>' +
            '<a href="' + (doc.powerpointUrl || '#') + '" download class="shrink-0 px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-semibold hover:bg-amber-700">Get PPTX</a>' +
            '</div>';
        }

        const title = (doc.exif && doc.exif.title) ? doc.exif.title : doc.name;
        const author = (doc.exif && doc.exif.author) ? doc.exif.author : 'Archival Record';
        const typeLabel = (doc.fileType || 'pdf').toUpperCase();

        card.innerHTML =
          '<div class="h-44 bg-stone-100 flex items-center justify-center p-3 border-b border-stone-100 relative group cursor-pointer" onclick="openModalById(\\'' + doc.id + '\\')">' +
          (doc.thumbnailUrl
            ? '<img src="' + doc.thumbnailUrl + '" alt="' + doc.name + '" class="max-h-full max-w-full object-contain drop-shadow-xs">'
            : '<div class="text-stone-400 font-bold text-xl tracking-wider">' + typeLabel + '</div>') +
          '<span class="absolute top-2 end-2 bg-stone-900/90 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-xs">' + typeLabel + '</span>' +
          '</div>' +
          '<div class="p-5 flex-1 flex flex-col justify-between">' +
          '<div>' +
          '<div class="text-[11px] text-stone-500 font-medium mb-1">' + (folder ? folder.name : 'Central Archive') + '</div>' +
          '<h3 class="text-sm font-bold text-stone-900 leading-snug hover:text-stone-600 cursor-pointer mb-2" onclick="openModalById(\\'' + doc.id + '\\')">' + title + '</h3>' +
          '<p class="text-xs text-stone-600 line-clamp-2 mb-2">' + (doc.summary || '') + '</p>' +
          dualPptHtml +
          '</div>' +
          '<div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">' +
          '<div class="text-[11px] text-stone-500 font-mono">' + (doc.fileSize / 1024 / 1024).toFixed(1) + ' MB</div>' +
          '<div class="flex items-center gap-2">' +
          '<button onclick="openModalById(\\'' + doc.id + '\\')" class="px-2.5 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium cursor-pointer transition-colors">Inspect</button>' +
          (doc.url ? '<a href="' + doc.url + '" download class="px-2.5 py-1 text-[11px] bg-stone-900 hover:bg-stone-800 text-white rounded font-medium transition-colors">Download</a>' : '') +
          '</div>' +
          '</div>' +
          '</div>';

        container.appendChild(card);
      });
    }

    function openModalById(id) {
      const item = CATALOG.items.find(function(i) { return i.id === id; });
      if (item) openModal(item);
    }

    // Modal Operations
    function openModal(item) {
      document.getElementById('modal-type-badge').textContent = (item.fileType || 'pdf').toUpperCase();
      document.getElementById('modal-title').textContent = (item.exif && item.exif.title) ? item.exif.title : item.name;
      document.getElementById('modal-desc').textContent = item.summary || 'No description provided for this archival record.';

      const viewport = document.getElementById('modal-media-viewport');
      viewport.innerHTML = '';
      if (item.fileType === 'video' && item.url) {
        viewport.innerHTML = '<video controls class="w-full max-h-72 rounded bg-black"><source src="' + item.url + '" type="video/mp4">Your browser does not support video playback.</video>';
      } else if (item.thumbnailUrl) {
        viewport.innerHTML = '<img src="' + item.thumbnailUrl + '" alt="" class="max-h-72 object-contain p-2">';
      } else {
        viewport.innerHTML = '<div class="p-8 text-center text-stone-400 font-medium">Archival Document Record (' + (item.fileType || 'pdf').toUpperCase() + ')</div>';
      }

      const exifGrid = document.getElementById('modal-exif-grid');
      exifGrid.innerHTML = '';
      const exif = item.exif || {};
      const fields = [
        ['Author / Presenter', exif.author || 'Archival Record'],
        ['Subject / Topic', exif.subject || 'Scholarly Collection'],
        ['Keywords', (exif.keywords || []).join(', ') || 'N/A'],
        ['File Size', (item.fileSize / 1024 / 1024).toFixed(2) + ' MB'],
        ['Format', (item.fileType || 'pdf').toUpperCase()],
        ['Creation Date', exif.creationDate || item.uploadDate]
      ];
      if (exif.videoDuration) fields.push(['Duration', exif.videoDuration]);
      if (exif.pageCount) fields.push(['Page Count', exif.pageCount + ' pages']);

      fields.forEach(function(pair) {
        const row = document.createElement('div');
        row.innerHTML = '<span class="text-stone-400 block">' + pair[0] + ':</span><span class="font-medium text-stone-800">' + pair[1] + '</span>';
        exifGrid.appendChild(row);
      });

      const actions = document.getElementById('modal-actions');
      actions.innerHTML = '';
      if (item.url) {
        actions.innerHTML += '<a href="' + item.url + '" download class="px-4 py-2 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors">Download ' + (item.fileType || 'file').toUpperCase() + '</a>';
      }
      if (item.fileType === 'video' && item.powerpointFileName && item.powerpointUrl) {
        actions.innerHTML += '<a href="' + item.powerpointUrl + '" download class="px-4 py-2 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700 transition-colors">Download Companion Slide Deck (.pptx)</a>';
      }

      document.getElementById('viewer-modal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('viewer-modal').classList.add('hidden');
    }

    // Language switcher
    function setLanguage(lang) {
      currentLanguage = lang;
      document.documentElement.lang = lang;
      document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    }

    // RSS Feed Generator
    function downloadStandaloneRss() {
      const latest = CATALOG.items.slice().sort(function(a, b) {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }).slice(0, 10);

      let itemsXml = '';
      latest.forEach(function(item) {
        const title = (item.exif && item.exif.title) ? item.exif.title : item.name;
        const author = (item.exif && item.exif.author) ? item.exif.author : 'Archival Record';
        const thumb = item.thumbnailUrl ? '<media:thumbnail url="' + item.thumbnailUrl + '" />' : '';
        const companion = (item.fileType === 'video' && item.powerpointFileName)
          ? '<media:peer url="' + (item.powerpointUrl || '') + '" type="application/vnd.ms-powerpoint" role="companion" title="' + item.powerpointFileName + '" />'
          : '';

        itemsXml += '<item>' +
          '<title>' + escapeXml(title) + '</title>' +
          '<link>' + escapeXml(item.url || '#') + '</link>' +
          '<pubDate>' + new Date(item.uploadDate).toUTCString() + '</pubDate>' +
          '<dc:creator>' + escapeXml(author) + '</dc:creator>' +
          '<enclosure url="' + escapeXml(item.url || '#') + '" length="' + item.fileSize + '" type="application/octet-stream" />' +
          '<media:content url="' + escapeXml(item.url || '#') + '" fileSize="' + item.fileSize + '" medium="' + (item.fileType === 'video' ? 'video' : 'document') + '" />' +
          thumb + companion +
          '</item>';
      });

      const rss = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">' +
        '<channel>' +
        '<title>' + escapeXml(CATALOG.config.galleryTitle) + ' - Recently Added</title>' +
        '<description>' + escapeXml(CATALOG.config.gallerySubtitle) + '</description>' +
        '<atom:link href="recently_added.rss" rel="self" type="application/rss+xml" />' +
        itemsXml +
        '</channel></rss>';

      const blob = new Blob([rss], { type: 'application/rss+xml;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'recently_added.rss';
      a.click();
      URL.revokeObjectURL(a.href);
    }

    function escapeXml(unsafe) {
      return (unsafe || '').replace(/[<>&'"]/g, function(c) {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
        }
      });
    }

    // Initialize Standalone Bundle
    renderRssCarousel();
    renderGallery();
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
