/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminConfig, FileType, MediaItem, PdfFolder } from '../types';

/**
 * Escapes characters for XML string literals.
 */
function escapeXml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Determines MIME type and Media RSS medium from file type and extension.
 */
function getMimeAndMedium(fileType: FileType, fileName: string): { mimeType: string; medium: 'document' | 'video' | 'image' } {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  switch (fileType) {
    case 'video':
      if (ext === 'webm') return { mimeType: 'video/webm', medium: 'video' };
      if (ext === 'mov') return { mimeType: 'video/quicktime', medium: 'video' };
      return { mimeType: 'video/mp4', medium: 'video' };

    case 'image':
      if (ext === 'png') return { mimeType: 'image/png', medium: 'image' };
      if (ext === 'webp') return { mimeType: 'image/webp', medium: 'image' };
      if (ext === 'gif') return { mimeType: 'image/gif', medium: 'image' };
      return { mimeType: 'image/jpeg', medium: 'image' };

    case 'word':
      if (ext === 'doc') return { mimeType: 'application/msword', medium: 'document' };
      if (ext === 'odt') return { mimeType: 'application/vnd.oasis.opendocument.text', medium: 'document' };
      return { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', medium: 'document' };

    case 'presentation':
      if (ext === 'ppt') return { mimeType: 'application/vnd.ms-powerpoint', medium: 'document' };
      if (ext === 'odp') return { mimeType: 'application/vnd.oasis.opendocument.presentation', medium: 'document' };
      return { mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', medium: 'document' };

    case 'pdf':
    default:
      return { mimeType: 'application/pdf', medium: 'document' };
  }
}

/**
 * Generates the RSS 2.0 with Media RSS XML feed string for the latest 10 additions.
 * Output is named "recently_added.rss".
 */
export function generateRssFeed(
  items: MediaItem[],
  folders: PdfFolder[],
  config: AdminConfig,
  maxItems = 10
): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://foliovault.archive';
  const feedUrl = `${baseUrl}/recently_added.rss`;

  // Filter visible items in visible folders and sort by upload date descending
  const visibleFolderMap = new Map(folders.filter(f => f.visibleInFrontend !== false).map(f => [f.id, f]));

  const sortedItems = [...items]
    .filter(item => visibleFolderMap.has(item.folderId))
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, maxItems);

  const buildDate = new Date().toUTCString();

  const itemsXml = sortedItems.map(item => {
    const folder = visibleFolderMap.get(item.folderId);
    const folderName = folder ? folder.name : 'Central Archive';
    const { mimeType, medium } = getMimeAndMedium(item.fileType, item.originalFileName || item.name);
    
    // PubDate in RFC 822 / 2822 format
    const itemDate = new Date(item.uploadDate);
    const pubDate = isNaN(itemDate.getTime()) ? buildDate : itemDate.toUTCString();

    const title = item.exif?.title || item.name;
    const author = item.exif?.author || 'FolioVault Contributor';
    const descriptionText = item.summary || item.exif?.subject || `${item.fileType.toUpperCase()} file archived in ${folderName}`;
    const fileSizeMb = (item.fileSize / 1024 / 1024).toFixed(2);

    // Deep link or asset URL
    const itemUrl = item.url.startsWith('http') || item.url.startsWith('blob:')
      ? item.url
      : `${baseUrl}/${item.url}`;

    // Thumbnail URL (fallback if SVG data URI or relative)
    const thumbUrl = item.thumbnailUrl
      ? (item.thumbnailUrl.startsWith('data:') || item.thumbnailUrl.startsWith('http') ? item.thumbnailUrl : `${baseUrl}${item.thumbnailUrl}`)
      : '';

    // HTML preview for CDATA description
    let companionHtml = '';
    if (item.fileType === 'video' && item.powerpointFileName) {
      companionHtml = `<p style="margin-top: 8px; padding: 6px; background: #fef3c7; border-left: 3px solid #d97706; font-size: 11px;">
        <strong>Includes Companion Slide Deck:</strong> ${escapeXml(item.powerpointFileName)}
      </p>`;
    }

    const cdataContent = `
      <div style="font-family: sans-serif; line-height: 1.5; color: #292524;">
        ${thumbUrl ? `<p><img src="${escapeXml(thumbUrl)}" alt="${escapeXml(title)}" style="max-width: 480px; max-height: 320px; object-fit: contain; border-radius: 6px; border: 1px solid #e7e5e4;" /></p>` : ''}
        <h3 style="margin-top: 8px; margin-bottom: 4px; font-size: 16px;">${escapeXml(title)}</h3>
        <p style="margin: 0; color: #78716c; font-size: 12px;">
          <strong>Format:</strong> ${item.fileType.toUpperCase()} &middot; 
          <strong>Size:</strong> ${fileSizeMb} MB &middot; 
          <strong>Album:</strong> ${escapeXml(folderName)}
        </p>
        <p style="margin: 4px 0 0 0; color: #57534e; font-size: 12px;"><strong>Creator:</strong> ${escapeXml(author)}</p>
        ${item.exif?.videoDuration ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #57534e;"><strong>Duration:</strong> ${escapeXml(item.exif.videoDuration)}</p>` : ''}
        ${item.exif?.pageCount ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #57534e;"><strong>Pages:</strong> ${item.exif.pageCount}</p>` : ''}
        ${item.exif?.wordCount ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #57534e;"><strong>Words:</strong> ${item.exif.wordCount.toLocaleString()}</p>` : ''}
        <p style="margin-top: 10px; font-size: 13px; color: #44403c;">${escapeXml(descriptionText)}</p>
        ${companionHtml}
      </div>
    `.trim();

    // Media RSS tags
    const mediaContent = `<media:content url="${escapeXml(itemUrl)}" fileSize="${item.fileSize}" type="${escapeXml(mimeType)}" medium="${medium}">
        <media:title type="plain">${escapeXml(title)}</media:title>
        <media:description type="plain">${escapeXml(descriptionText)}</media:description>
        ${item.exif?.videoDuration ? `<media:duration>${escapeXml(item.exif.videoDuration)}</media:duration>` : ''}
        <media:credit role="author">${escapeXml(author)}</media:credit>
        <media:category>${escapeXml(folderName)}</media:category>
      </media:content>`;

    const mediaThumbnail = thumbUrl
      ? `<media:thumbnail url="${escapeXml(thumbUrl)}" width="480" height="320" />`
      : '';

    // Companion slide deck tag if video
    let companionDeckTag = '';
    if (item.fileType === 'video' && item.powerpointFileName) {
      const pptUrl = item.powerpointUrl || `${baseUrl}/companion/${encodeURIComponent(item.powerpointFileName)}`;
      companionDeckTag = `
      <media:peer url="${escapeXml(pptUrl)}" type="application/vnd.ms-powerpoint" role="companion" title="${escapeXml(item.powerpointFileName)}" />`;
    }

    // Categories (tags + folder)
    const categoryTags = [folderName, ...item.tags]
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(tag => `      <category>${escapeXml(tag)}</category>`)
      .join('\n');

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(itemUrl)}</link>
      <guid isPermaLink="false">${escapeXml(item.id)}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(author)}</dc:creator>
${categoryTags}
      <description><![CDATA[${cdataContent}]]></description>
      <enclosure url="${escapeXml(itemUrl)}" length="${item.fileSize}" type="${escapeXml(mimeType)}" />
      ${mediaContent}
      ${mediaThumbnail}${companionDeckTag}
    </item>`;
  }).join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(config.galleryTitle)} - Recently Added</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(config.gallerySubtitle)}</description>
    <language>${escapeXml(config.defaultLanguage || 'en')}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <generator>FolioVault Databaseless Media Engine</generator>
    <image>
      <url>${escapeXml(baseUrl)}/favicon.ico</url>
      <title>${escapeXml(config.galleryTitle)}</title>
      <link>${escapeXml(baseUrl)}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;
}

/**
 * Triggers a direct download of the XML feed strictly named "recently_added.rss".
 */
export function downloadRssFeed(items: MediaItem[], folders: PdfFolder[], config: AdminConfig): void {
  const xmlContent = generateRssFeed(items, folders, config);
  const blob = new Blob([xmlContent], { type: 'application/rss+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'recently_added.rss';
  link.setAttribute('style', 'display: none;');
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 3000);
}

/**
 * Generates an active Blob URL for "recently_added.rss" so it can be previewed or opened directly.
 */
export function getRssFeedBlobUrl(items: MediaItem[], folders: PdfFolder[], config: AdminConfig): string {
  const xmlContent = generateRssFeed(items, folders, config);
  const blob = new Blob([xmlContent], { type: 'application/rss+xml;charset=utf-8' });
  return URL.createObjectURL(blob);
}
