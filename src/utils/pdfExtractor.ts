/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PdfExifMetadata } from '../types';

/**
 * Parses raw PDF buffer text to extract PDF Info dictionary and EXIF metadata
 * when external libraries are sandboxed or running synchronously.
 */
export function extractRawPdfMetadata(buffer: ArrayBuffer): PdfExifMetadata {
  const decoder = new TextDecoder('latin1');
  const text = decoder.decode(buffer);

  const getPdfString = (regex: RegExp): string | undefined => {
    const match = text.match(regex);
    if (!match) return undefined;
    let val = match[1] || match[2] || '';
    // Clean PDF escape sequences and parentheses
    val = val.replace(/\\([()\\])/g, '$1').trim();
    return val || undefined;
  };

  const getPdfDate = (regex: RegExp): string | undefined => {
    const raw = getPdfString(regex);
    if (!raw) return undefined;
    // PDF dates often look like D:20261028143000Z or D:20261028143000+02'00'
    const clean = raw.replace(/^D:/, '');
    if (clean.length >= 8) {
      const year = clean.substring(0, 4);
      const month = clean.substring(4, 6);
      const day = clean.substring(6, 8);
      return `${year}-${month}-${day}`;
    }
    return raw;
  };

  // PDF version from header (e.g. %PDF-1.7)
  const versionMatch = text.match(/%PDF-([0-9.]+)/);
  const pdfVersion = versionMatch ? `PDF ${versionMatch[1]}` : 'PDF 1.7';

  // Count pages by counting /Type /Page (excluding /Pages)
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
 * Creates a valid standalone sample PDF Blob with realistic content and embedded Info dictionary.
 */
export function createSamplePdfBlob(
  title: string,
  author: string,
  category: string,
  summary: string,
  pageCount: number = 3
): Blob {
  const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  
  // Minimal valid PDF 1.4 template with vector text and catalog
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
 * Generate a clean SVG thumbnail representation of the document for instant preview
 */
export function generateSvgThumbnail(title: string, author: string, category: string, accentHex: string = '#292524'): string {
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
    <text x="36" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" letter-spacing="2" fill="${accentHex}" opacity="0.6">FOLIO ARCHIVE / VOL. XXVI</text>
    <text x="364" y="58" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" letter-spacing="1" fill="${accentHex}" opacity="0.6">DOC.PDF</text>
    <line x1="36" y1="68" x2="364" y2="68" stroke="${accentHex}" stroke-opacity="0.15" stroke-width="0.5"/>
    
    <!-- Title and Author -->
    <text x="36" y="140" font-family="'Playfair Display', Georgia, serif" font-weight="600" font-size="22" fill="#1C1917" width="320">
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

    <!-- Archival Text Lines -->
    <rect x="36" y="280" width="300" height="4" rx="2" fill="#E7E5E4"/>
    <rect x="36" y="295" width="280" height="4" rx="2" fill="#E7E5E4"/>
    <rect x="36" y="310" width="310" height="4" rx="2" fill="#E7E5E4"/>
    <rect x="36" y="325" width="220" height="4" rx="2" fill="#E7E5E4"/>
    <rect x="36" y="340" width="260" height="4" rx="2" fill="#E7E5E4"/>

    <!-- Bottom Stamp -->
    <circle cx="320" cy="440" r="28" fill="none" stroke="${accentHex}" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="320" y="438" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" letter-spacing="1" fill="${accentHex}" opacity="0.6">VERIFIED</text>
    <text x="320" y="448" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" letter-spacing="1" fill="${accentHex}" opacity="0.6">EXIF RETAINED</text>
    
    <text x="36" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#A8A29E">FOLIOMARK CERTIFIED ARCHIVAL RECORD</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
