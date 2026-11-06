/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminConfig, ExifDisplaySettings, MediaItem, PdfFolder } from '../types';
import {
  createSamplePdfBlob,
  createSamplePowerpointBlob,
  createSampleWordBlob,
  generateSvgThumbnail
} from './pdfExtractor';

export const HERO_IMAGE_URL = '/src/assets/images/gallery_curatorial_hero_1793386273415.jpg';
export const MONOGRAPH_COVER_URL = '/src/assets/images/sample_document_cover_1793386275184.jpg';

export const INITIAL_EXIF_SETTINGS: ExifDisplaySettings = {
  showTitle: true,
  showAuthor: true,
  showSubject: true,
  showKeywords: true,
  showCreationDate: true,
  showPageCount: true,
  showProducer: false, // hidden in frontend by default, visible in admin
  showFileSize: true,
  showPdfVersion: false, // hidden in frontend by default, visible in admin
  showDimensions: true,
  showVideoDuration: true,
  showWordCount: true,
};

// Default standard SHA-256 hash for "admin123" (matches feutex.com, CyberChef, sha256sum):
// Hex: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
// Base64: JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=
export const INITIAL_ADMIN_CONFIG: AdminConfig = {
  version: '2.0.0',
  passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  salt: '',
  galleryTitle: 'FolioVault Central Repository',
  gallerySubtitle: 'Databaseless central repository for verified scholarly, institutional, and multimedia folios.',
  defaultLanguage: 'en',
  allowGlobalDownloads: true,
  exifSettings: INITIAL_EXIF_SETTINGS,
  customCssEnabled: false,
  showRssWidget: true,
};

export const INITIAL_FOLDERS: PdfFolder[] = [
  {
    id: 'folder-arch',
    name: 'Architectural Monographs & Keynotes',
    nameTranslations: {
      en: 'Architectural Monographs & Keynotes',
      ar: 'العمارة والتراث والمحاضرات المرئية',
      ja: '建築モノグラフと基調講演'
    },
    description: 'Documentation of historic stone masonry, classical treatises, and recorded symposium keynotes.',
    tags: ['Architecture', 'Monographs', 'Heritage', 'Keynote', 'Video'],
    allowDownload: true,
    visibleInFrontend: true,
    order: 1,
    coverImage: HERO_IMAGE_URL
  },
  {
    id: 'folder-curator',
    name: 'Curatorial & Exhibition Catalogs',
    nameTranslations: {
      en: 'Curatorial & Exhibition Catalogs',
      ar: 'الكتالوجات والمعارض الفنية',
      ja: 'キュレーター企画・展覧会図録'
    },
    description: 'Official museum publications, gallery retrospective volumes, and critical essays.',
    tags: ['Art', 'Museum', 'Exhibition', 'Curatorial', 'Word'],
    allowDownload: false, // Downloads disabled for exhibition catalogs to test permission!
    visibleInFrontend: true,
    order: 2,
    coverImage: MONOGRAPH_COVER_URL
  },
  {
    id: 'folder-manuscripts',
    name: 'Rare Manuscripts & Paleography',
    nameTranslations: {
      en: 'Rare Manuscripts & Paleography',
      ar: 'المخطوطات النادرة وعلم الخط',
      ja: '稀少写本・古文書学'
    },
    description: 'High-resolution archival facsimiles of illumination scripts, codices, and cartography.',
    tags: ['Manuscripts', 'Paleography', 'History', 'Illumination'],
    allowDownload: true,
    visibleInFrontend: true,
    order: 3
  },
  {
    id: 'folder-science',
    name: 'Scientific Folios & Astronomical Charts',
    nameTranslations: {
      en: 'Scientific Folios & Astronomical Charts',
      ar: 'الوثائق العلمية والفلكية',
      ja: '科学フォリオ・天文学'
    },
    description: 'Historical celestial maps, botanical observations, and navigational quadrants.',
    tags: ['Science', 'Astronomy', 'Charts', 'Botany'],
    allowDownload: true,
    visibleInFrontend: true,
    order: 4
  }
];

export function generateInitialItems(): MediaItem[] {
  const items: MediaItem[] = [
    // 1. VIDEO ITEM WITH DUAL DOWNLOAD LINKS (Uploaded Video + Original PowerPoint Presentation)
    {
      id: 'media-001',
      name: 'Venetian_Palazzos_Keynote_Symposium.mp4',
      originalFileName: 'Venetian_Palazzos_Keynote_Symposium.mp4',
      fileType: 'video',
      folderId: 'folder-arch',
      tags: ['Architecture', 'Video', 'Keynote', 'Presentation', 'Venice'],
      uploadDate: '2026-10-28T16:40:00Z',
      fileSize: 184549376, // 176 MB
      allowDownload: true,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // sample valid MP4 stream
      thumbnailUrl: generateSvgThumbnail('Venetian Palazzos Symposium', 'Prof. Matteo Valmarana', 'Architecture', '#78350F', 'video'),
      summary: 'Recorded keynote lecture on harmonic proportions in Palladian stone facades, delivered at the International Architectural Heritage Symposium. Features synchronized high-definition slides and commentary.',
      order: 1,
      powerpointFileName: 'Venetian_Architecture_Keynote_Deck.pptx',
      powerpointFileSize: 16777216, // 16 MB
      allowPowerpointDownload: true,
      exif: {
        title: 'Venetian Stone Palazzos: Architectural Proportions & Harmonics Keynote',
        author: 'Prof. Matteo Valmarana (Venice Heritage Chair)',
        subject: 'Recorded Keynote Lecture with Accompanying Slide Deck',
        keywords: ['Architecture', 'Video', 'Lecture', 'Palladio', 'Venice', 'Slide Deck', 'Keynote'],
        creator: 'Sony FX6 4K Cinema Line / Atomos Ninja V+',
        producer: 'DaVinci Resolve Studio 19 / H.264 Encoder',
        creationDate: '2026-10-28',
        fileSize: 184549376,
        dimensions: '1920 × 1080 (16:9 Full HD)',
        videoDuration: '34:20',
        videoResolution: '1080p Full HD (1920x1080)',
        videoCodec: 'H.264 / High Profile + AAC Stereo 48kHz',
        videoFps: 60,
        rawExif: {
          VideoFormat: 'MPEG-4 Part 14 (.mp4)',
          MasterResolution: '1920x1080',
          FrameRate: '59.94 fps Progressive',
          VideoBitrate: '6.4 Mbps Target',
          AudioChannels: '2 (Stereo L/R)',
          AccompanyingSlideDeck: 'Venetian_Architecture_Keynote_Deck.pptx (Available for Dual Download)',
          SymposiumLocation: 'Scuola Grande di San Rocco, Venice'
        }
      }
    },

    // 2. WORD DOCUMENT ITEM (.docx)
    {
      id: 'media-002',
      name: 'Editorial_Monograph_Text_Critique.docx',
      originalFileName: 'Silent_Archive_Critical_Review_Draft.docx',
      fileType: 'word',
      folderId: 'folder-curator',
      tags: ['Word', 'Curatorial', 'Editorial', 'Essay', 'Manuscript'],
      uploadDate: '2026-10-25T11:20:00Z',
      fileSize: 845200,
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Critical Review & Monograph Draft', 'Dr. Claire St. John', 'Curatorial', '#1E3A8A', 'word'),
      summary: 'Comprehensive peer-reviewed editorial essay exploring the tactile materiality of black-and-white silver gelatin prints, darkroom techniques, and institutional archiving ethics.',
      order: 2,
      wordPreviewText: `THE MATERIALITY OF THE PRINT: AN ESSAY IN ARCHIVAL PHENOMENOLOGY

By Dr. Claire St. John
Department of Curatorial Studies & Art History

I. THE SURFACING OF MEMORY
When looking through the portfolio prints of the British avant-garde photographers active between 1965 and 1985, one is immediately struck by the recalcitrant materiality of the photographic paper itself. Before an image can be understood as representation, it exists in space as a physical matrix: fibers of cotton rag, baryta coating, suspended gelatin, and finely atomized colloidal silver.

II. THE LOSS OF THE TACTILE HORIZON
In modern digital cataloging, this physical presence is frequently subordinated to the screen representation. Yet the blind debossing along the margins—an indentation stamped under three tons of mechanical pressure—testifies to the artisan labor invested into each plate. The archive is not merely an optical index; it is an archaeology of paper, chemical residue, and physical inscription.

III. INSTITUTIONAL ETHICS IN REPRODUCING FACSIMILES
How do contemporary cultural museums preserve both the intellectual content and the haptic dignity of the folio? The protocols established in this monograph argue for complete metadata fidelity, explicit page dimensioning, and uncompromised surface density.`,
      exif: {
        title: 'The Materiality of the Print: An Essay in Archival Phenomenology',
        author: 'Dr. Claire St. John',
        subject: 'Contemporary Museum Retrospective Critical Review',
        keywords: ['Word', 'Essay', 'Curatorial', 'Photography', 'Silver Gelatin', 'Monograph'],
        creator: 'Microsoft Word for Mac 16.89',
        producer: 'OpenXML Engine v4.0',
        creationDate: '2026-10-25',
        pageCount: 14,
        wordCount: 7850,
        paragraphCount: 92,
        revisionNumber: 'Rev 6.2 (Peer Reviewed)',
        fileSize: 845200,
        dimensions: 'A4 Standard (210 × 297 mm)',
        rawExif: {
          DocType: 'Word Processing ML Document (.docx)',
          TotalEditingTime: '420 Minutes',
          WordsCount: 7850,
          Paragraphs: 92,
          Lines: 540,
          Characters: 48920,
          Company: 'Institute of Curatorial Research'
        }
      }
    },

    // 3. CURATORIAL HIGH-RES IMAGE ITEM
    {
      id: 'media-003',
      name: 'Curatorial_Archival_Table_Master_Scan.jpg',
      originalFileName: 'Archival_Table_Research_Leica.jpg',
      fileType: 'image',
      folderId: 'folder-arch',
      tags: ['Image', 'Heritage', 'Photography', 'Archive', 'Folio'],
      uploadDate: '2026-10-22T09:15:00Z',
      fileSize: 12582912, // 12 MB
      allowDownload: true,
      url: HERO_IMAGE_URL,
      thumbnailUrl: HERO_IMAGE_URL,
      summary: 'High-resolution medium format documentation of rare architectural treatises on natural oak examination tables, captured in morning ambient daylight.',
      order: 3,
      exif: {
        title: 'Archival Examination Table: Master Conservation Session',
        author: 'Elena Rostova (Senior Heritage Photographer)',
        subject: 'Conservation Photography & Rare Manuscript Inspection',
        keywords: ['Image', 'Heritage', 'Photography', 'Hasselblad', 'Conservation', 'Leica'],
        creator: 'Hasselblad H6D-100c Digital Back',
        producer: 'Phocus Archival Studio v3.6',
        creationDate: '2026-10-22',
        fileSize: 12582912,
        dimensions: '4000 × 2250 (16:9 Ultra HD)',
        colorSpace: 'Adobe RGB (1998)',
        cameraModel: 'Hasselblad H6D-100c',
        lensModel: 'Hasselblad HC 2,2/100mm',
        iso: 64,
        focalLength: '100mm f/8.0 1/125s',
        rawExif: {
          CameraMake: 'Hasselblad',
          CameraModel: 'H6D-100c',
          ShutterSpeed: '1/125 sec',
          Aperture: 'f/8.0',
          ISO: 64,
          FocalLength: '100.0 mm',
          ColorSpace: 'Adobe RGB (1998)',
          MeteringMode: 'CenterWeightedAverage',
          LightSource: 'Natural Daylight'
        }
      }
    },

    // 4. PDF DOCUMENT ITEM (With downloads disabled to demonstrate security permission)
    {
      id: 'media-004',
      name: 'The Materiality of the Print & Avant-Garde Photography.pdf',
      originalFileName: 'Silent_Archive_Monograph_1985.pdf',
      fileType: 'pdf',
      folderId: 'folder-curator',
      tags: ['PDF', 'Art', 'Museum', 'Photography', 'Monographs'],
      uploadDate: '2026-10-24T09:15:00Z',
      fileSize: 4280192,
      allowDownload: false, // downloads disabled for this item
      url: '',
      thumbnailUrl: MONOGRAPH_COVER_URL,
      summary: 'A definitive retrospective examining blind-debossed silver gelatin prints and British avant-garde photographic materials between 1965 and 1985.',
      order: 4,
      exif: {
        title: 'The Silent Archive: British Avant-Garde Photography 1965-1985',
        author: 'Elias Thorne',
        subject: 'Contemporary Museum Retrospective Catalog Vol. XIV',
        keywords: ['PDF', 'Photography', 'Silver Gelatin', 'Curatorial', 'Print Materiality', 'Exhibition'],
        creator: 'FolioVault Curatorial Typesetter',
        producer: 'Adobe PDF Library 22.1 / Quadtone Engine',
        creationDate: '2026-04-18',
        modDate: '2026-05-02',
        pageCount: 64,
        pdfVersion: 'PDF 1.7 (ISO 32000-1)',
        fileSize: 4280192,
        dimensions: '240 × 300 mm (Editorial Quarto)',
        colorSpace: 'DeviceCMYK + Grayscale Spot',
        rawExif: {
          Format: 'application/pdf',
          Title: 'The Silent Archive: British Avant-Garde Photography 1965-1985',
          Author: 'Elias Thorne',
          CuratorID: 'CUR-LON-8841',
          Resolution: '600 DPI Master Print Proof',
          ColorProfile: 'FOGRA39 Coated',
          Trapping: 'True'
        }
      }
    },

    // 5. PDF DOCUMENT ITEM
    {
      id: 'media-005',
      name: 'Palladian Proportions in Venetian Stone Palazzos.pdf',
      originalFileName: 'Venetian_Proportions_Treatise.pdf',
      fileType: 'pdf',
      folderId: 'folder-arch',
      tags: ['PDF', 'Architecture', 'Monographs', 'Heritage', 'Venice'],
      uploadDate: '2026-10-18T14:22:00Z',
      fileSize: 3145728,
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Palladian Proportions in Stone', 'Matteo Valmarana', 'Architecture', '#78350F', 'pdf'),
      summary: 'Measured geometric elevation drawings, portico harmonics, and limestone structural joinery based on classical Renaissance blueprints.',
      order: 5,
      exif: {
        title: 'Palladian Proportions in Venetian Stone Palazzos',
        author: 'Prof. Matteo Valmarana',
        subject: 'Architectural Heritage & Geometric Analysis',
        keywords: ['PDF', 'Architecture', 'Palladio', 'Venice', 'Geometry', 'Limestone', 'Proportions'],
        creator: 'AutoCAD Architectural Export 2026',
        producer: 'Harlequin RIP v13.0',
        creationDate: '2026-03-12',
        modDate: '2026-03-20',
        pageCount: 48,
        pdfVersion: 'PDF 1.6',
        fileSize: 3145728,
        dimensions: '297 × 420 mm (A3 Landscape)',
        colorSpace: 'DeviceRGB',
        rawExif: {
          Institution: 'Venetian Architectural Archive',
          Scale: '1:50 Metric',
          Draftsman: 'M. Valmarana Studio',
          PaperStandard: 'Fabriano Ingres 160gsm'
        }
      }
    },

    // 6. PDF DOCUMENT ITEM
    {
      id: 'media-006',
      name: 'Andalusi Celestial Astrolabes & Meridian Tables.pdf',
      originalFileName: 'Andalusi_Astrolabe_Tables_1380.pdf',
      fileType: 'pdf',
      folderId: 'folder-manuscripts',
      tags: ['PDF', 'Manuscripts', 'Astronomy', 'History', 'Folio'],
      uploadDate: '2026-10-12T11:45:00Z',
      fileSize: 5898240,
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Andalusi Astrolabe Tables', 'Ibn al-Saffar Facsimile', 'Manuscripts', '#1E3A8A', 'pdf'),
      summary: 'Arabic astronomical tables charting stellar coordinates, azimuth indicators, and lunar reckoning instruments from the Toledo and Cordoba observatories.',
      order: 6,
      exif: {
        title: 'Andalusi Celestial Astrolabes & Meridian Tables (Facsimile Codex)',
        author: 'Scholarly Council for Medieval Arabic Paleography',
        subject: 'Historical Astronomy & Islamic Instrument Design',
        keywords: ['PDF', 'Astronomy', 'Astrolabe', 'Arabic', 'Toledo', 'Manuscript', 'Meridian', 'Codex'],
        creator: 'National Paleography Digitization Unit',
        producer: 'Phase One Cultural Heritage Capture',
        creationDate: '2026-02-14',
        pageCount: 36,
        pdfVersion: 'PDF/A-1b (Archival Certified)',
        fileSize: 5898240,
        dimensions: '215 × 310 mm (Folio)',
        colorSpace: 'Adobe RGB (1998)',
        rawExif: {
          ScriptType: 'Maghrebi Kufic & Naskh',
          OriginalDate: 'Circa 1380 CE',
          Shelfmark: 'MS-ARAB-772-B',
          PreservationCondition: 'Stable / Pigments Intact'
        }
      }
    },
    // 7. PRESENTATION ITEM (.odp / .pptx)
    {
      id: 'media-007',
      name: 'Palladian_Facade_Symmetry_Study.odp',
      originalFileName: 'Palladian_Facade_Symmetry_Study.odp',
      fileType: 'presentation',
      folderId: 'folder-arch',
      tags: ['Presentation', 'ODP', 'Architecture', 'Slides', 'Palladio'],
      uploadDate: '2026-10-14T10:00:00Z',
      fileSize: 14680064, // 14 MB
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Palladian Facade Symmetry Study', 'Prof. Matteo Valmarana', 'Presentation', '#78350F', 'presentation', 'odp'),
      summary: 'OpenDocument Presentation (.odp) containing 48 high-definition architectural geometry slides, section diagrams, and speaker notes.',
      order: 7,
      exif: {
        title: 'Palladian Facade Symmetry & Portico Harmonics (ODP Deck)',
        author: 'Prof. Matteo Valmarana',
        subject: 'Architectural Analysis Lecture Slide Deck',
        keywords: ['Presentation', 'ODP', 'Architecture', 'Slides', 'Palladio'],
        creator: 'LibreOffice Impress 24.8 / OASIS ODF v1.3',
        producer: 'OpenDocument Foundation Spec',
        creationDate: '2026-10-14',
        slideCount: 48,
        dimensions: '16:9 Widescreen (1920 × 1080)',
        presentationFormat: 'OpenDocument Presentation (.odp)',
        fileSize: 14680064,
        rawExif: {
          Format: 'ODP / OASIS OpenDocument Presentation',
          SlidesCount: 48,
          AnimationSequences: 14,
          CompatibleSoftware: 'LibreOffice Impress, Apache OpenOffice, PowerPoint 365'
        }
      }
    },
    // 8. ANIMATED GIF / WEBP HERITAGE VISUAL
    {
      id: 'media-008',
      name: 'Astrolabe_Celestial_Rotation_Sequence.gif',
      originalFileName: 'Astrolabe_Celestial_Rotation_Sequence.gif',
      fileType: 'image',
      folderId: 'folder-manuscripts',
      tags: ['Image', 'GIF', 'Manuscripts', 'Astronomy', 'Animation'],
      uploadDate: '2026-10-10T12:00:00Z',
      fileSize: 4194304,
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Astrolabe Celestial Rotation', 'Paleography Lab', 'Animation', '#1E3A8A', 'image', 'gif'),
      summary: 'High-contrast animated sequence demonstrating rete rotation and zodiac alignment on medieval brass astrolabes.',
      order: 8,
      exif: {
        title: 'Astrolabe Celestial Projection & Rete Rotation (Animated GIF)',
        author: 'Paleography Archival Digitization Unit',
        subject: 'Historical Scientific Instrument In Motion',
        keywords: ['Image', 'GIF', 'Astronomy', 'Astrolabe', 'Animation', 'Heritage'],
        creationDate: '2026-10-10',
        fileSize: 4194304,
        dimensions: '800 × 800 (Square)',
        colorSpace: 'Indexed Color 256',
        isAnimatedGif: true,
        producer: 'FFmpeg Animated GIF Engine 7.1',
        rawExif: {
          Extension: 'GIF89a',
          Frames: 60,
          FrameRate: '15 fps',
          Loop: 'Continuous'
        }
      }
    }
  ];

  // Initialize live valid blobs for items so they can be viewed and downloaded immediately
  items.forEach(item => {
    if (item.fileType === 'pdf' && !item.url) {
      const blob = createSamplePdfBlob(
        item.exif.title || item.name,
        item.exif.author || 'Anonymous Contributor',
        item.tags[0] || 'Curatorial Archive',
        item.summary || 'FolioVault verified curatorial PDF document with embedded metadata and vector typography.',
        item.exif.pageCount || 10
      );
      item.url = URL.createObjectURL(blob);
    } else if (item.fileType === 'word' && !item.url) {
      const blob = createSampleWordBlob(
        item.exif.title || item.name,
        item.exif.author || 'Author',
        item.wordPreviewText || item.summary || ''
      );
      item.url = URL.createObjectURL(blob);
    } else if (item.fileType === 'presentation' && !item.url) {
      const ext = item.name.endsWith('.odp') ? 'odp' : item.name.endsWith('.ppt') ? 'ppt' : 'pptx';
      const blob = createSamplePowerpointBlob(item.exif.title || item.name, ext);
      item.url = URL.createObjectURL(blob);
    }

    // Attach sample PowerPoint/ODP presentation blob for video items
    if (item.fileType === 'video' && !item.powerpointUrl) {
      const pptBlob = createSamplePowerpointBlob(item.exif.title || item.name, 'pptx');
      item.powerpointUrl = URL.createObjectURL(pptBlob);
    }
  });

  return items;
}
