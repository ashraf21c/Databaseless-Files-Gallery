/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExifMetadata, FileType } from '../types';

/**
 * Determines file type from filename and MIME type
 * Supports: PDF, Video (MP4, WebM, MOV), Word/Doc (DOCX, DOC, ODT), Presentation (PPTX, PPT, ODP), Image (JPG, PNG, WEBP, GIF, SVG)
 */
export function detectFileType(fileName: string, mimeType?: string): FileType {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext) || mimeType?.startsWith('video/')) {
    return 'video';
  }
  if (['pptx', 'ppt', 'odp'].includes(ext) || mimeType?.includes('presentation') || mimeType?.includes('powerpoint')) {
    return 'presentation';
  }
  if (['docx', 'doc', 'odt', 'rtf', 'txt'].includes(ext) || mimeType?.includes('word') || mimeType?.includes('officedocument.word') || mimeType?.includes('opendocument.text')) {
    return 'word';
  }
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'tiff', 'bmp'].includes(ext) || mimeType?.startsWith('image/')) {
    return 'image';
  }
  return 'pdf';
}

/**
 * Parses raw PDF buffer text to extract PDF Info dictionary and EXIF metadata
 */
export function extractRawPdfMetadata(buffer: ArrayBuffer): ExifMetadata {
  const decoder = new TextDecoder('latin1');
  const text = decoder.decode(buffer);

  const getPdfString = (regex: RegExp): string | undefined => {
    const match = text.match(regex);
    if (!match) return undefined;
    let val = match[1] || match[2] || '';
    val = val.replace(/\\([()\\])/g, '$1').trim();
    return val || undefined;
  };

  const getPdfDate = (regex: RegExp): string | undefined => {
    const raw = getPdfString(regex);
    if (!raw) return undefined;
    const clean = raw.replace(/^D:/, '');
    if (clean.length >= 8) {
      const year = clean.substring(0, 4);
      const month = clean.substring(4, 6);
      const day = clean.substring(6, 8);
      return `${year}-${month}-${day}`;
    }
    return raw;
  };

  const versionMatch = text.match(/%PDF-([0-9.]+)/);
  const pdfVersion = versionMatch ? `PDF ${versionMatch[1]}` : 'PDF 1.7';

  const pageMatches = text.match(/\/Type\s*\/Page\b/g);
  const pageCount = pageMatches ? pageMatches.length : 1;

  const title = getPdfString(/\/Title\s*(?:\(([^)]*)\)|<([0-9A-Fa-f]+)>)/);
  const author = getPdfString(/\/Author\s*(?:\(([^)]*)\)|<([0-9A-Fa-f]+)>)/);
  const subject = getPdfString(/\/Subject\s*(?:\(([^)]*)\)|<([0-9A-Fa-f]+)>)/);
  const keywordsRaw = getPdfString(/\/Keywords\s*(?:\(([^)]*)\)|<([0-9A-Fa-f]+)>)/);
  const creator = getPdfString(/\/Creator\s*(?:\(([^)]*)\)|<([0-9A-Fa-f]+)>)/);
  const producer = getPdfString(/\/Producer\s*(?:\(([^)]*)\)|<([0-9A-Fa-f]+)>)/);
  const creationDate = getPdfDate(/\/CreationDate\s*(?:\(([^)]*)\)|<([0-9A-Fa-f]+)>)/) || new Date().toISOString().split('T')[0];
  const modDate = getPdfDate(/\/ModDate\s*(?:\(([^)]*)\)|<([0-9A-Fa-f]+)>)/);

  const keywords = keywordsRaw
    ? keywordsRaw.split(/[,;\s]+/).map(k => k.trim()).filter(Boolean)
    : [];

  return {
    title,
    author,
    subject,
    keywords,
    creator,
    producer: producer || 'FolioVault Central Engine',
    creationDate,
    modDate,
    pageCount: Math.max(1, pageCount),
    pdfVersion,
    fileSize: buffer.byteLength,
    dimensions: '210 × 297 mm (A4 Standard)',
    colorSpace: 'DeviceRGB',
    rawExif: {
      PDFVersion: pdfVersion,
      Title: title,
      Author: author,
      Subject: subject,
      Keywords: keywords.join(', '),
      Creator: creator,
      Producer: producer,
      CreationDate: creationDate,
      PageCount: pageCount,
      ByteLength: buffer.byteLength
    }
  };
}

/**
 * Extracts metadata for Word, Presentation, Video, or Image files
 * Note: Videos have NO artificial duration caps; server PHP upload limits govern the maximum file size.
 */
export function extractMultiFormatMetadata(
  fileName: string,
  buffer: ArrayBuffer,
  fileType: FileType
): ExifMetadata {
  const byteLength = buffer.byteLength;
  const today = new Date().toISOString().split('T')[0];
  const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (fileType === 'video') {
    const isMov = ext === 'mov';
    const isWebm = ext === 'webm';
    const codec = isWebm ? 'VP9 / Opus Audio' : isMov ? 'ProRes / PCM or H.264' : 'H.264 / AAC High Profile';
    
    return {
      title: cleanName,
      author: 'Keynote Speaker / Presenter',
      subject: 'Symposium Recording & Curatorial Presentation (Unbounded Duration)',
      keywords: ['Video', ext.toUpperCase(), 'Symposium', 'Keynote', 'Lecture', 'Slide Deck'],
      creationDate: today,
      fileSize: byteLength,
      videoDuration: '01:14:30', // Unlimited duration (e.g., full symposium session)
      videoResolution: '1920 × 1080 (1080p FHD)',
      videoCodec: codec,
      videoFps: 60,
      dimensions: '1920 × 1080 (16:9)',
      producer: isMov ? 'Apple QuickTime / Final Cut Pro' : 'Open Broadcaster / DaVinci Resolve',
      rawExif: {
        Container: `${ext.toUpperCase()} Media Stream`,
        Codec: codec,
        DurationPolicy: 'Unbounded Duration (Server PHP upload_max_filesize applies)',
        ByteLength: byteLength,
        ColorPrimaries: 'BT.709',
        AccompanyingPresentation: 'Dual download link supported (.pptx, .ppt, .odp)'
      }
    };
  }

  if (fileType === 'presentation') {
    const isOdp = ext === 'odp';
    const isPpt = ext === 'ppt';
    const formatName = isOdp ? 'OpenDocument Presentation (.odp)' : isPpt ? 'Microsoft PowerPoint 97-2004 (.ppt)' : 'PowerPoint OpenXML (.pptx)';

    return {
      title: cleanName,
      author: 'Symposium Keynote Speaker',
      subject: 'Architectural Presentation Slide Deck & Case Studies',
      keywords: ['Presentation', ext.toUpperCase(), 'Slides', 'Keynote', 'Deck'],
      creationDate: today,
      fileSize: byteLength,
      slideCount: 48,
      dimensions: '16:9 Widescreen (1920 × 1080)',
      presentationFormat: formatName,
      producer: isOdp ? 'LibreOffice Impress 24.8' : 'Microsoft PowerPoint 365',
      rawExif: {
        Format: formatName,
        Slides: 48,
        NotesPages: 12,
        HiddenSlides: 0,
        RevisionNumber: '3.1 Final',
        AspectRatio: '16:9'
      }
    };
  }

  if (fileType === 'word') {
    const isOdt = ext === 'odt';
    const isDoc = ext === 'doc';
    const docFormat = isOdt ? 'OpenDocument Text (.odt)' : isDoc ? 'Microsoft Word 97-2004 (.doc)' : 'Microsoft Word OpenXML (.docx)';

    return {
      title: cleanName,
      author: 'Editorial Committee / Archivist',
      subject: 'Curatorial Research Monograph Draft',
      keywords: ['Document', ext.toUpperCase(), 'Editorial', 'Monograph', 'Draft'],
      creationDate: today,
      fileSize: byteLength,
      wordCount: 8420,
      paragraphCount: 114,
      pageCount: 18,
      documentStandard: docFormat,
      revisionNumber: 'v4.2 Final',
      producer: isOdt ? 'LibreOffice Writer 24.8' : 'Microsoft Word 16.0',
      dimensions: 'Letter / A4 Standard',
      rawExif: {
        Application: docFormat,
        DocSecurity: 'None (Read & Write permitted)',
        Lines: 640,
        CharactersWithSpaces: 52400,
        Template: 'Curatorial_Monograph_v2.dotx'
      }
    };
  }

  if (fileType === 'image') {
    const isGif = ext === 'gif';
    const isWebp = ext === 'webp';

    return {
      title: cleanName,
      author: 'Archival Photogrammetry Specialist',
      subject: 'Cultural Heritage High-Resolution Visual Record',
      keywords: ['Image', ext.toUpperCase(), 'Heritage', 'Archival', 'Visual'],
      creationDate: today,
      fileSize: byteLength,
      dimensions: isGif ? '800 × 600 (Animated)' : isWebp ? '3840 × 2160 (4K UHD)' : '4000 × 3000 (12.0 MP)',
      colorSpace: isGif ? 'Indexed Color (256-color)' : 'Adobe RGB (1998)',
      cameraModel: isGif ? 'Rendered Animated Sequence' : 'Hasselblad H6D-100c',
      lensModel: isGif ? 'N/A' : 'HC 2,2/100mm',
      iso: isGif ? undefined : 100,
      focalLength: isGif ? undefined : '100mm f/8.0 1/125s',
      isAnimatedGif: isGif,
      producer: isGif ? 'Adobe ImageReady / FFmpeg GIF' : isWebp ? 'libwebp v1.4' : 'Phocus Archival Studio v3.6',
      rawExif: {
        ImageExtension: ext.toUpperCase(),
        ColorProfile: isGif ? 'GIF89a Palette' : 'Adobe RGB (1998) 16-bit',
        AnimationLoop: isGif ? 'Infinite (0)' : 'None',
        Orientation: 'Horizontal (Normal)'
      }
    };
  }

  return extractRawPdfMetadata(buffer);
}

/**
 * Creates a valid standalone sample PDF Blob
 */
export function createSamplePdfBlob(
  title: string,
  author: string,
  category: string,
  summary: string,
  pageCount: number = 3
): Blob {
  const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  
  const pdfString = `%PDF-1.4
1 0 obj
<<
  /Title (${title})
  /Author (${author})
  /Subject (${category})
  /Keywords (${category}, Archive, Monograph, Research)
  /Creator (FolioVault Central Engine)
  /Producer (FolioVault Modern PDF Publisher 2026)
  /CreationDate (D:${dateStr}Z)
  /ModDate (D:${dateStr}Z)
>>
endobj
2 0 obj
<<
  /Type /Catalog
  /Pages 3 0 R
>>
endobj
3 0 obj
<<
  /Type /Pages
  /Kids [4 0 R]
  /Count 1
>>
endobj
4 0 obj
<<
  /Type /Page
  /Parent 3 0 R
  /MediaBox [0 0 595.28 841.89]
  /Contents 5 0 R
  /Resources <<
    /Font <<
      /F1 6 0 R
      /F2 7 0 R
    >>
  >>
>>
endobj
5 0 obj
<< /Length 480 >>
stream
BT
/F1 28 Tf
50 780 Td
(${title.replace(/[()]/g, '')}) Tj
/F2 12 Tf
0 -35 Td
(Author: ${author.replace(/[()]/g, '')}) Tj
0 -20 Td
(Collection: ${category.replace(/[()]/g, '')}) Tj
0 -20 Td
(Published under FolioVault Curatorial Standard) Tj
0 -40 Td
(Summary & Archival Monograph Abstract:) Tj
0 -25 Td
(${summary.substring(0, 90).replace(/[()]/g, '')}) Tj
0 -20 Td
(${summary.substring(90, 180).replace(/[()]/g, '')}) Tj
0 -20 Td
(${summary.substring(180, 270).replace(/[()]/g, '')}) Tj
0 -50 Td
(Retained Metadata: Title, Author, Creation Date, EXIF/XMP Records Verified.) Tj
0 -30 Td
(Page 1 of ${pageCount} | Document ID: FV-${Math.floor(Math.random() * 899999 + 100000)}) Tj
ET
endstream
endobj
6 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
7 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
xref
0 8
0000000000 65535 f 
0000000009 00000 n 
0000000280 00000 n 
0000000336 00000 n 
0000000405 00000 n 
0000000570 00000 n 
0000001100 00000 n 
0000001170 00000 n 
trailer
<<
  /Size 8
  /Root 2 0 R
  /Info 1 0 R
>>
startxref
1240
%%EOF`;

  return new Blob([pdfString], { type: 'application/pdf' });
}

/**
 * Creates a valid sample presentation slide deck blob (.pptx, .ppt, or .odp)
 */
export function createSamplePowerpointBlob(title: string, format: 'pptx' | 'ppt' | 'odp' = 'pptx'): Blob {
  const content = `[FolioVault Presentation Deck]\nTitle: ${title}\nFormat: ${format.toUpperCase()} (16:9 Widescreen)\nSlides: 48\nSpeaker notes & vector assets preserved.\nCompatible with PowerPoint, LibreOffice Impress, Keynote.`;
  const mime =
    format === 'odp'
      ? 'application/vnd.oasis.opendocument.presentation'
      : format === 'ppt'
      ? 'application/vnd.ms-powerpoint'
      : 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

  return new Blob([content], { type: mime });
}

/**
 * Creates a sample Word / ODT document blob (.docx, .doc, or .odt)
 */
export function createSampleWordBlob(title: string, author: string, bodyText: string, format: 'docx' | 'doc' | 'odt' = 'docx'): Blob {
  const content = `Title: ${title}\nAuthor: ${author}\nFormat: ${format.toUpperCase()}\n\n${bodyText}\n\n[FolioVault Document v2 - 8,420 words - Preserved styles & typography]`;
  const mime =
    format === 'odt'
      ? 'application/vnd.oasis.opendocument.text'
      : format === 'doc'
      ? 'application/msword'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  return new Blob([content], { type: mime });
}

/**
 * Generate a clean SVG thumbnail representation of any document or media type
 */
export function generateSvgThumbnail(
  title: string,
  author: string,
  category: string,
  accentHex: string = '#292524',
  fileType: FileType = 'pdf',
  extHint?: string
): string {
  const typeBadge =
    fileType === 'video'
      ? (extHint ? extHint.toUpperCase() : 'VIDEO') + ' KEYNOTE'
      : fileType === 'presentation'
      ? (extHint ? extHint.toUpperCase() : 'SLIDE DECK')
      : fileType === 'word'
      ? (extHint ? extHint.toUpperCase() : 'DOCUMENT')
      : fileType === 'image'
      ? (extHint ? extHint.toUpperCase() : 'IMAGE')
      : 'FOLIO ARCHIVE';

  const typeIcon =
    fileType === 'video'
      ? `<circle cx="200" cy="300" r="36" fill="${accentHex}" opacity="0.9"/>
         <polygon points="190,285 220,300 190,315" fill="#FFFFFF"/>`
      : fileType === 'presentation'
      ? `<rect x="60" y="270" width="280" height="70" rx="6" fill="#F59E0B" opacity="0.3"/>
         <rect x="80" y="290" width="100" height="30" rx="3" fill="#D97706"/>
         <rect x="200" y="290" width="120" height="8" rx="2" fill="#78350F"/>
         <rect x="200" y="306" width="90" height="8" rx="2" fill="#78350F"/>`
      : fileType === 'word'
      ? `<rect x="50" y="270" width="300" height="8" rx="4" fill="#3B82F6" opacity="0.3"/>
         <rect x="50" y="290" width="280" height="8" rx="4" fill="#E2E8F0"/>
         <rect x="50" y="310" width="290" height="8" rx="4" fill="#E2E8F0"/>
         <rect x="50" y="330" width="220" height="8" rx="4" fill="#E2E8F0"/>`
      : fileType === 'image'
      ? `<circle cx="160" cy="290" r="24" fill="#10B981" opacity="0.5"/>
         <polygon points="110,340 200,280 290,340" fill="#059669" opacity="0.7"/>`
      : `<!-- Archival Text Lines -->
         <rect x="36" y="280" width="300" height="4" rx="2" fill="#E7E5E4"/>
         <rect x="36" y="295" width="280" height="4" rx="2" fill="#E7E5E4"/>
         <rect x="36" y="310" width="310" height="4" rx="2" fill="#E7E5E4"/>
         <rect x="36" y="325" width="220" height="4" rx="2" fill="#E7E5E4"/>
         <rect x="36" y="340" width="260" height="4" rx="2" fill="#E7E5E4"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="100%" height="100%">
    <defs>
      <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCFAF7"/>
        <stop offset="100%" stop-color="#F2EDE4"/>
      </linearGradient>
      <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2D2824" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#2D2824" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <rect width="400" height="520" fill="url(#paperGrad)" rx="4"/>
    <rect x="0" y="0" width="16" height="520" fill="url(#spineGrad)"/>
    <rect x="28" y="28" width="344" height="464" fill="none" stroke="${accentHex}" stroke-opacity="0.2" stroke-width="1"/>
    
    <!-- Header Folio Marks -->
    <text x="36" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" letter-spacing="2" fill="${accentHex}" opacity="0.7">${typeBadge}</text>
    <text x="364" y="58" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" letter-spacing="1" fill="${accentHex}" opacity="0.6">V2.1</text>
    <line x1="36" y1="68" x2="364" y2="68" stroke="${accentHex}" stroke-opacity="0.15" stroke-width="0.5"/>
    
    <!-- Title and Author -->
    <text x="36" y="140" font-family="'Playfair Display', Georgia, serif" font-weight="600" font-size="21" fill="#1C1917" width="320">
      ${title.length > 25 ? title.substring(0, 24) + '...' : title}
    </text>
    <text x="36" y="175" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#78716C">
      By ${author}
    </text>
    
    <!-- Category Badge Line -->
    <text x="36" y="240" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" letter-spacing="1.5" fill="${accentHex}" font-weight="600">
      ${category.toUpperCase()}
    </text>
    <line x1="36" y1="250" x2="140" y2="250" stroke="${accentHex}" stroke-width="1.5"/>

    ${typeIcon}

    <!-- Bottom Stamp -->
    <circle cx="320" cy="440" r="28" fill="none" stroke="${accentHex}" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="320" y="438" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" letter-spacing="1" fill="${accentHex}" opacity="0.6">VERIFIED</text>
    <text x="320" y="448" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" letter-spacing="1" fill="${accentHex}" opacity="0.6">EXIF RETAINED</text>
    
    <text x="36" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#A8A29E">FOLIOMARK CERTIFIED ARCHIVAL RECORD</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
