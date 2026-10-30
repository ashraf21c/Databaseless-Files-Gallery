/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminConfig, ExifDisplaySettings, PdfFolder, PdfItem } from '../types';
import { createSamplePdfBlob, generateSvgThumbnail } from './pdfExtractor';

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
};

// Default hashed password for "admin123" with salt "foliovault_salt_2026":
// Computed via crypto.subtle.digest: "foliovault_salt_2026:admin123" -> sha256
export const INITIAL_ADMIN_CONFIG: AdminConfig = {
  passwordHash: '8b7fca13f738b55695ef2aeef33b0cfbc92bc4aa4dd38aa4d693be7bf7bfaafc',
  salt: 'foliovault_salt_2026',
  galleryTitle: 'FolioVault Curatorial Repository',
  gallerySubtitle: 'Databaseless central repository for verified scholarly, institutional and artistic folios.',
  defaultLanguage: 'en',
  allowGlobalDownloads: true,
  exifSettings: INITIAL_EXIF_SETTINGS,
  customCssEnabled: false,
};

export const INITIAL_FOLDERS: PdfFolder[] = [
  {
    id: 'folder-arch',
    name: 'Architectural Monographs & Heritage',
    nameTranslations: {
      en: 'Architectural Monographs & Heritage',
      ar: 'العمارة والتراث التاريخي',
      ja: '建築モノグラフと遺産'
    },
    description: 'Documentation of historic stone masonry, sacred proportions, and classical treatises.',
    tags: ['Architecture', 'Monographs', 'Heritage', 'Treatise'],
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
    tags: ['Art', 'Museum', 'Exhibition', 'Curatorial'],
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

export function generateInitialItems(): PdfItem[] {
  const items: PdfItem[] = [
    {
      id: 'doc-001',
      name: 'The Materiality of the Print & Avant-Garde Photography.pdf',
      originalFileName: 'Silent_Archive_Monograph_1985.pdf',
      folderId: 'folder-curator',
      tags: ['Art', 'Museum', 'Photography', 'Monographs'],
      uploadDate: '2026-10-24T09:15:00Z',
      fileSize: 4280192,
      allowDownload: false, // downloads disabled for this item
      url: '',
      thumbnailUrl: MONOGRAPH_COVER_URL,
      summary: 'A definitive retrospective examining blind-debossed silver gelatin prints and British avant-garde photographic materials between 1965 and 1985.',
      order: 1,
      exif: {
        title: 'The Silent Archive: British Avant-Garde Photography 1965-1985',
        author: 'Elias Thorne',
        subject: 'Contemporary Museum Retrospective Catalog Vol. XIV',
        keywords: ['Photography', 'Silver Gelatin', 'Curatorial', 'Print Materiality', 'Exhibition'],
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
    {
      id: 'doc-002',
      name: 'Palladian Proportions in Venetian Stone Palazzos.pdf',
      originalFileName: 'Venetian_Proportions_Treatise.pdf',
      folderId: 'folder-arch',
      tags: ['Architecture', 'Monographs', 'Heritage', 'Venice'],
      uploadDate: '2026-10-18T14:22:00Z',
      fileSize: 3145728,
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Palladian Proportions in Stone', 'Matteo Valmarana', 'Architecture', '#78350F'),
      summary: 'Measured geometric elevation drawings, portico harmonics, and limestone structural joinery based on classical Renaissance blueprints.',
      order: 2,
      exif: {
        title: 'Palladian Proportions in Venetian Stone Palazzos',
        author: 'Prof. Matteo Valmarana',
        subject: 'Architectural Heritage & Geometric Analysis',
        keywords: ['Architecture', 'Palladio', 'Venice', 'Geometry', 'Limestone', 'Proportions'],
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
    {
      id: 'doc-003',
      name: 'Andalusi Celestial Astrolabes & Meridian Tables.pdf',
      originalFileName: 'Andalusi_Astrolabe_Tables_1380.pdf',
      folderId: 'folder-manuscripts',
      tags: ['Manuscripts', 'Astronomy', 'History', 'Folio'],
      uploadDate: '2026-10-12T11:45:00Z',
      fileSize: 5898240,
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Andalusi Astrolabe Tables', 'Ibn al-Saffar Facsimile', 'Manuscripts', '#1E3A8A'),
      summary: 'Arabic astronomical tables charting stellar coordinates, azimuth indicators, and lunar reckoning instruments from the Toledo and Cordoba observatories.',
      order: 3,
      exif: {
        title: 'Andalusi Celestial Astrolabes & Meridian Tables (Facsimile Codex)',
        author: 'Scholarly Council for Medieval Arabic Paleography',
        subject: 'Historical Astronomy & Islamic Instrument Design',
        keywords: ['Astronomy', 'Astrolabe', 'Arabic', 'Toledo', 'Manuscript', 'Meridian', 'Codex'],
        creator: 'National Paleography Digitization Unit',
        producer: 'Phase One Cultural Heritage Capture',
        creationDate: '2026-02-14',
        modDate: '2026-02-15',
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
    {
      id: 'doc-004',
      name: 'Harmonia Macrocosmica: Constellation Plates I-XII.pdf',
      originalFileName: 'Cellarius_Harmonia_Macrocosmica_Plates.pdf',
      folderId: 'folder-science',
      tags: ['Science', 'Astronomy', 'Charts', 'Archive'],
      uploadDate: '2026-09-30T16:10:00Z',
      fileSize: 6710886,
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Harmonia Macrocosmica', 'Andreas Cellarius', 'Astronomy', '#14532D'),
      summary: 'Ptolemaic, Copernican, and Tychonic world systems illustrated in hand-colored copperplate celestial engravings.',
      order: 4,
      exif: {
        title: 'Harmonia Macrocosmica: Selected Constellation Plates',
        author: 'Andreas Cellarius (Amsterdam, 1660)',
        subject: 'Historical Celestial Cartography & Engravings',
        keywords: ['Cartography', 'Celestial', 'Cellarius', 'Amsterdam', 'Engravings', 'Planisphere'],
        creator: 'Bibliotheca Universalis Archival Scan',
        producer: 'KODAK Archive Scanner 9600',
        creationDate: '2026-01-20',
        modDate: '2026-01-22',
        pageCount: 24,
        pdfVersion: 'PDF 1.7',
        fileSize: 6710886,
        dimensions: '430 × 510 mm (Double Elephant Folio)',
        colorSpace: 'DeviceRGB 16-bit',
        rawExif: {
          Cartographer: 'Andreas Cellarius',
          OriginalPublisher: 'Johannes Janssonius',
          CopperplateDPI: '1200 DPI Optical',
          ColoringTechnique: 'Period Hand Watercolor Gouache'
        }
      }
    },
    {
      id: 'doc-005',
      name: 'Timber Joinery Systems in Traditional Japanese Pagodas.pdf',
      originalFileName: 'Japanese_Pagoda_Joinery_Research.pdf',
      folderId: 'folder-arch',
      tags: ['Architecture', 'Monographs', 'Japan', 'Heritage'],
      uploadDate: '2026-09-15T08:30:00Z',
      fileSize: 2621440,
      allowDownload: true,
      url: '',
      thumbnailUrl: generateSvgThumbnail('Japanese Pagoda Joinery', 'Kenjiro Takahashi', 'Architecture', '#78350F'),
      summary: 'Study of Kanawa Tsugi, Kigumi interlocking joints, and seismic dampening characteristics of five-story timber pagodas.',
      order: 5,
      exif: {
        title: 'Kigumi Joinery and Seismic Flexibility in Japanese Pagodas',
        author: 'Dr. Kenjiro Takahashi (Kyoto Institute of Technology)',
        subject: 'Structural Timber Engineering & Architectural Heritage',
        keywords: ['Architecture', 'Japan', 'Kigumi', 'Pagoda', 'Timber', 'Earthquake', 'Joinery'],
        creator: 'LaTeX with Microtype & TeX Live 2026',
        producer: 'pdfTeX-1.40.24',
        creationDate: '2026-01-10',
        modDate: '2026-01-15',
        pageCount: 32,
        pdfVersion: 'PDF 1.5',
        fileSize: 2621440,
        dimensions: '210 × 297 mm (A4)',
        colorSpace: 'DeviceGray',
        rawExif: {
          Language: 'ja, en',
          Department: 'School of Architecture and Environmental Design',
          PeerReviewed: 'True',
          ISSN: '2381-9921'
        }
      }
    }
  ];

  // Initialize live valid PDF blobs for each sample item so they can be viewed immediately!
  items.forEach(item => {
    const blob = createSamplePdfBlob(
      item.exif.title || item.name,
      item.exif.author || 'Anonymous Contributor',
      item.tags[0] || 'Curatorial Archive',
      item.summary || 'FolioVault verified curatorial PDF document with embedded metadata and vector typography.',
      item.exif.pageCount || 10
    );
    item.url = URL.createObjectURL(blob);
  });

  return items;
}
