/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export interface TranslationDictionary {
  brandTitle: string;
  brandTagline: string;
  versionBadge: string;
  allAlbums: string;
  allTags: string;
  filterByFolder: string;
  filterByTag: string;
  filterByFormat: string;
  formatAll: string;
  formatPdf: string;
  formatVideo: string;
  formatPresentation: string;
  formatImage: string;
  formatWord: string;
  searchPlaceholder: string;
  sortBy: string;
  sortName: string;
  sortSize: string;
  sortDate: string;
  sortTitle: string;
  sortAuthor: string;
  sortPageCount: string;
  sortCreationDate: string;
  sortFileType: string;
  sortAsc: string;
  sortDesc: string;
  viewInline: string;
  openNewTab: string;
  downloadPdf: string;
  downloadFile: string;
  downloadVideo: string;
  downloadPowerpoint: string;
  powerpointDeck: string;
  noPowerpointAttached: string;
  attachPowerpoint: string;
  powerpointFileName: string;
  powerpointFileSize: string;
  downloadDisabled: string;
  downloadDisabledTip: string;
  noPdfsFound: string;
  noPdfsFoundSub: string;
  itemsCount: string;
  foldersCount: string;
  adminPortal: string;
  adminLogin: string;
  adminLogout: string;
  adminUnlocked: string;
  enterPassword: string;
  passwordPlaceholder: string;
  loginButton: string;
  invalidPassword: string;
  adminDashboardTitle: string;
  tabFolders: string;
  tabUpload: string;
  tabExif: string;
  tabSecurity: string;
  tabExport: string;
  uploadTitle: string;
  uploadFolderSelect: string;
  uploadDragDrop: string;
  uploadSelectFiles: string;
  uploadSelectFolder: string;
  uploading: string;
  uploadProgress: string;
  uploadComplete: string;
  extractedMetadata: string;
  batchProcessingTitle: string;
  autoTagFolderNotice: string;
  autoCreateFoldersToggle: string;
  autoTaggingToggle: string;
  batchItemsDetected: string;
  newFolder: string;
  folderName: string;
  folderDescription: string;
  folderTags: string;
  createFolder: string;
  editFolder: string;
  deleteFolder: string;
  confirmDeleteFolder: string;
  confirmDeleteFile: string;
  reorderHint: string;
  moveUp: string;
  moveDown: string;
  visibleInFrontend: string;
  hiddenInFrontend: string;
  allowDownloads: string;
  downloadsEnabled: string;
  downloadsDisabled: string;
  exifGovernanceTitle: string;
  exifGovernanceDesc: string;
  fieldTitle: string;
  fieldAuthor: string;
  fieldSubject: string;
  fieldKeywords: string;
  fieldCreationDate: string;
  fieldPageCount: string;
  fieldProducer: string;
  fieldFileSize: string;
  fieldPdfVersion: string;
  fieldDimensions: string;
  fieldVideoDuration: string;
  fieldWordCount: string;
  showInFrontend: string;
  visibleToAdminOnly: string;
  changePassword: string;
  newPassword: string;
  confirmPassword: string;
  savePassword: string;
  passwordChanged: string;
  passwordMismatch: string;
  hashEncryptionNote: string;
  exportYaml: string;
  importYaml: string;
  exportSingleHtml: string;
  exportSingleHtmlDesc: string;
  phpGuideTitle: string;
  phpGuideContent: string;
  close: string;
  save: string;
  cancel: string;
  pages: string;
  fileDetails: string;
  exifInspector: string;
  rawExifData: string;
  zoomIn: string;
  zoomOut: string;
  fitWidth: string;
  rotate: string;
  previousDoc: string;
  nextDoc: string;
  pageNavigation: string;
  ofPage: string;
  copyMetadata: string;
  copied: string;
  standaloneNote: string;
  resetDemoData: string;
  confirmReset: string;
  videoDualDownloadNotice: string;
  videoPlayer: string;
  wordDocumentViewer: string;
  imageViewer: string;
  words: string;
  rssWidgetTitle: string;
  rssWidgetSubtitle: string;
  rssFeedName: string;
  downloadRssFeed: string;
  viewRssFeed: string;
  copyRssXml: string;
  rssCopied: string;
  enableRssWidget: string;
  disableRssWidget: string;
  rssWidgetToggleAdmin: string;
  rssWidgetEnabledNotice: string;
  rssWidgetDisabledNotice: string;
  recentlyAddedBadge: string;
  latestAdditions: string;
  downloadWord: string;
  downloadImage: string;
  downloadPresentation: string;
  tableActions: string;
  visible: string;
  hidden: string;
  downloadOn: string;
  downloadOff: string;
  changePpt: string;
  addPptDeck: string;
  noDescription: string;
  mediaOrderingTitle: string;
  autoAttachPptxNotice: string;
  batchDropHint: string;
  supportedFormatsHint: string;
  authVerifying: string;
  defaultPasswordDemo: string;
  importYamlSuccess: string;
  copyScript: string;
  scriptCopied: string;
  generateSingleHtml: string;
  importYamlButton: string;
  exportYamlButton: string;
  gridMode: string;
  listMode: string;
  resetFilterTag: string;
  passwordMinLength: string;
  activeHashLabel: string;
  supportedPhpVersions: string;
  heroDescription: string;
  heroVolBadge: string;
  heroFigCaption: string;
  coreDatabaselessTitle: string;
  coreDatabaselessSubtitle: string;
  coreCryptoTitle: string;
  coreCryptoSubtitle: string;
  coreExifTitle: string;
  coreExifSubtitle: string;
  coreLangTitle: string;
  coreLangSubtitle: string;
  skipToContent: string;
  mainNavigation: string;
  themeToggleLight: string;
  themeToggleDark: string;
  selectLanguage: string;
  resultsCountLive: string;
  closeDialog: string;
  catalogTableCaption: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandTitle: 'FolioVault',
    brandTagline: 'Databaseless Central Media & Document Gallery (v2.0)',
    versionBadge: 'Version 2.0 (Multi-Format + Dual Video & PPT Downloads)',
    allAlbums: 'All Collections',
    allTags: 'All Tags',
    filterByFolder: 'Filter by Folder',
    filterByTag: 'Filter by Tag',
    filterByFormat: 'Media Format',
    formatAll: 'All Formats',
    formatPdf: 'PDF Documents',
    formatVideo: 'Videos & Keynotes (MP4, WebM, MOV)',
    formatPresentation: 'Slide Decks (PPTX, PPT, ODP)',
    formatImage: 'Images (JPG, PNG, WebP, GIF)',
    formatWord: 'Documents (DOCX, DOC, ODT)',
    searchPlaceholder: 'Search titles, authors, keywords, videos, slide decks...',
    sortBy: 'Sort by',
    sortName: 'File Name',
    sortSize: 'File Size',
    sortDate: 'Upload Date',
    sortTitle: 'Document Title',
    sortAuthor: 'Author',
    sortPageCount: 'Page Count',
    sortCreationDate: 'Creation Date',
    sortFileType: 'Media Type',
    sortAsc: 'Ascending',
    sortDesc: 'Descending',
    viewInline: 'View Item',
    openNewTab: 'Open in New Window',
    downloadPdf: 'Download PDF',
    downloadFile: 'Download File',
    downloadVideo: 'Download Video (MP4)',
    downloadPowerpoint: 'Download Slide Deck (PPTX)',
    powerpointDeck: 'Accompanying Presentation',
    noPowerpointAttached: 'No slide deck linked',
    attachPowerpoint: 'Attach Original PowerPoint (.pptx)',
    powerpointFileName: 'Presentation File Name',
    powerpointFileSize: 'Presentation Size',
    downloadDisabled: 'Downloads Disabled',
    downloadDisabledTip: 'Download restricted by archive administrator (inline viewing only).',
    noPdfsFound: 'No media items match your criteria',
    noPdfsFoundSub: 'Try selecting a different collection folder, format, or clearing active tags.',
    itemsCount: 'items',
    foldersCount: 'collections',
    adminPortal: 'Admin Portal',
    adminLogin: 'Admin Sign In',
    adminLogout: 'Sign Out',
    adminUnlocked: 'Admin Mode Active',
    enterPassword: 'Enter Admin Password',
    passwordPlaceholder: 'Encrypted hash verification...',
    loginButton: 'Unlock Admin Portal',
    invalidPassword: 'Incorrect password. Cryptographic hash did not match.',
    adminDashboardTitle: 'Central Archive Management (v2)',
    tabFolders: 'Folders & Organization',
    tabUpload: 'Upload GUI (All Formats)',
    tabExif: 'EXIF & Metadata Rules',
    tabSecurity: 'Security & Hash',
    tabExport: 'Databaseless / Export',
    uploadTitle: 'Upload Documents, Videos, Images or Folders',
    uploadFolderSelect: 'Target Collection Folder',
    uploadDragDrop: 'Drag & drop PDF, Word (.docx), Video (.mp4), or Images (.jpg/.png) here',
    uploadSelectFiles: 'Select Files (PDF, Word, Video, Image)',
    uploadSelectFolder: 'Upload Entire Directory',
    uploading: 'Processing & Extracting Metadata...',
    uploadProgress: 'Upload Progress',
    uploadComplete: 'Files parsed, EXIF retained, and added to gallery',
    extractedMetadata: 'Retained EXIF Metadata',
    batchProcessingTitle: 'Batch Processing & Multi-Folder Ingestion',
    autoTagFolderNotice: 'Auto-tagging active: items automatically inherit folder names as tags.',
    autoCreateFoldersToggle: 'Auto-create new collection albums when dragged folder does not exist',
    autoTaggingToggle: 'Auto-tag documents based on dragged folder names',
    batchItemsDetected: 'items detected across directories',
    newFolder: 'New Collection Folder',
    folderName: 'Folder Name',
    folderDescription: 'Description / Context',
    folderTags: 'Folder Tags (comma separated)',
    createFolder: 'Create Folder',
    editFolder: 'Edit Folder',
    deleteFolder: 'Delete Folder',
    confirmDeleteFolder: 'Are you sure you want to delete this collection and its references?',
    confirmDeleteFile: 'Are you sure you want to delete this file from the gallery?',
    reorderHint: 'Re-arrange albums & documents order:',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    visibleInFrontend: 'Visible in Public Gallery',
    hiddenInFrontend: 'Hidden from Public Gallery',
    allowDownloads: 'Allow Public Downloads',
    downloadsEnabled: 'Downloads Allowed',
    downloadsDisabled: 'Downloads Prohibited (Inline Only)',
    exifGovernanceTitle: 'EXIF Metadata Display Governance',
    exifGovernanceDesc: 'Media files retain their full internal EXIF/XMP/Codec data. Select which attributes are publicly rendered in the front end. All attributes remain visible in the Admin back end.',
    fieldTitle: 'Document / Media Title',
    fieldAuthor: 'Author / Presenter / Creator',
    fieldSubject: 'Subject / Abstract',
    fieldKeywords: 'Keywords / Index Terms',
    fieldCreationDate: 'Creation Date (EXIF)',
    fieldPageCount: 'Page Count',
    fieldProducer: 'Producer / Camera / Software',
    fieldFileSize: 'File Size',
    fieldPdfVersion: 'Specification Version / Format',
    fieldDimensions: 'Dimensions & Aspect Ratio',
    fieldVideoDuration: 'Video Duration',
    fieldWordCount: 'Word & Paragraph Count',
    showInFrontend: 'Display in Front End',
    visibleToAdminOnly: 'Admin Back End Only',
    changePassword: 'Change Admin Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    savePassword: 'Hash & Save Password',
    passwordChanged: 'Password successfully updated and hashed with SHA-256.',
    passwordMismatch: 'Passwords do not match.',
    hashEncryptionNote: 'Passwords are never stored in plaintext. They are salted and encrypted via SHA-256 Web Crypto standards.',
    exportYaml: 'Export YAML Configuration (settings.yaml)',
    importYaml: 'Import YAML Configuration',
    exportSingleHtml: 'Export Standalone Single HTML Bundle',
    exportSingleHtmlDesc: 'Generate a single, zero-dependency HTML file containing all HTML, CSS, JS, albums, videos, Word docs, and metadata ready for any static web host or USB distribution.',
    phpGuideTitle: 'PHP Deployment & Server Guide',
    phpGuideContent: 'FolioVault v2 is fully databaseless. When deploying with PHP (supports PHP 8.1, 8.2, and 8.3+), you can place PDFs, MP4s, DOCX, and images in a /documents/ folder without SQL.',
    close: 'Close',
    save: 'Save Changes',
    cancel: 'Cancel',
    pages: 'pages',
    fileDetails: 'Media Information',
    exifInspector: 'Full EXIF / Metadata Inspector',
    rawExifData: 'Complete Raw Metadata Dictionary',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitWidth: 'Fit Width',
    rotate: 'Rotate 90°',
    previousDoc: 'Previous Item',
    nextDoc: 'Next Item',
    pageNavigation: 'Page',
    ofPage: 'of',
    copyMetadata: 'Copy Metadata as JSON',
    copied: 'Copied to Clipboard!',
    standaloneNote: 'Zero-Database Architecture: multi-format flat portable schemas.',
    resetDemoData: 'Reset Demo Catalog',
    confirmReset: 'Reset all collections and documents to initial curated sample state?',
    videoDualDownloadNotice: 'Dual download package available: Video Recording (.mp4) + Accompanying Presentation (.pptx).',
    videoPlayer: 'Video Player',
    wordDocumentViewer: 'Word Document Viewer',
    imageViewer: 'High-Resolution Image Inspector',
    words: 'words',
    rssWidgetTitle: 'Recently Added',
    rssWidgetSubtitle: 'Latest 10 additions with Media RSS XML feed',
    rssFeedName: 'recently_added.rss',
    downloadRssFeed: 'Download recently_added.rss',
    viewRssFeed: 'View RSS Feed XML',
    copyRssXml: 'Copy Feed XML',
    rssCopied: 'Feed XML copied to clipboard!',
    enableRssWidget: 'Enable Recently Added Widget',
    disableRssWidget: 'Disable Widget',
    rssWidgetToggleAdmin: 'Display Recently Added Media RSS Widget in Frontend',
    rssWidgetEnabledNotice: 'Media RSS widget is active and tracking the 10 latest additions.',
    rssWidgetDisabledNotice: 'Recently Added widget is currently hidden.',
    recentlyAddedBadge: 'Recently Added',
    latestAdditions: 'Latest 10 Additions',
    downloadWord: 'Download Word Document',
    downloadImage: 'Download Image',
    downloadPresentation: 'Download Slide Deck',
    tableActions: 'Actions',
    visible: 'Visible',
    hidden: 'Hidden',
    downloadOn: 'Download ON',
    downloadOff: 'Download OFF',
    changePpt: 'Change PPT',
    addPptDeck: '+ PPT Deck',
    noDescription: 'No description provided',
    mediaOrderingTitle: 'Media Ordering & Dual Download Setup',
    autoAttachPptxNotice: 'Auto-provision PowerPoint slide deck download for video uploads',
    batchDropHint: 'Drop multiple files or entire folder trees at once. Auto-tags items and creates collection albums.',
    supportedFormatsHint: 'Supported: PDF, DOCX, DOC, ODT, MP4, WEBM, MOV, PPTX, PPT, ODP, JPG, PNG, WEBP, GIF.',
    authVerifying: 'Verifying Hash...',
    defaultPasswordDemo: 'Default password for demonstration: admin123',
    importYamlSuccess: 'YAML Configuration successfully imported!',
    copyScript: 'Copy Script',
    scriptCopied: 'Script Copied!',
    generateSingleHtml: 'Generate Single HTML',
    importYamlButton: 'Import YAML',
    exportYamlButton: 'Export YAML',
    gridMode: 'Grid View',
    listMode: 'List View',
    resetFilterTag: 'Reset',
    passwordMinLength: 'Password must be at least 4 characters long.',
    activeHashLabel: 'Active SHA-256 Encrypted Hash:',
    supportedPhpVersions: 'Supported Versions: PHP 8.1, PHP 8.2, and PHP 8.3+ (Multi-format directory scanner)',
    heroDescription: 'Curated central gallery for PDF documents, folios, architectural monographs, and exhibition catalogs. Built entirely without databases: utilizing portable flat schemas, cryptographic SHA-256 admin governance, and full EXIF metadata retention.',
    heroVolBadge: 'CENTRAL ARCHIVE · DATABASELESS SPECIFICATION',
    heroFigCaption: 'Fig. 1 — Archival examination folio with preserved vector plates and metadata records.',
    coreDatabaselessTitle: 'Databaseless Core',
    coreDatabaselessSubtitle: 'YAML / Flat-file storage',
    coreCryptoTitle: 'Encrypted Pass',
    coreCryptoSubtitle: 'Salted SHA-256 Web Crypto',
    coreExifTitle: 'EXIF Governance',
    coreExifSubtitle: 'Selective front-end reveals',
    coreLangTitle: 'RTL & Multilingual',
    coreLangSubtitle: 'Arabic, Japanese, English',
    skipToContent: 'Skip to main content',
    mainNavigation: 'Main navigation',
    themeToggleLight: 'Switch to light theme',
    themeToggleDark: 'Switch to dark theme',
    selectLanguage: 'Select language',
    resultsCountLive: 'Showing {count} items',
    closeDialog: 'Close dialog',
    catalogTableCaption: 'Media archive document and asset catalog',
  },
  ar: {
    brandTitle: 'فوليو فولت',
    brandTagline: 'معرض وأرشيف الوسائط والوثائق المركزي بدون قاعدة بيانات (الإصدار 2)',
    versionBadge: 'الإصدار 2.0 (دعم الفيديو والصور والوورد + رابطي تنزيل للفيديو والبوربوينت)',
    allAlbums: 'جميع المجموعات',
    allTags: 'جميع الوسوم',
    filterByFolder: 'تصفية حسب المجلد',
    filterByTag: 'تصفية حسب الوسم',
    filterByFormat: 'نوع الملف',
    formatAll: 'كافة التنسيقات',
    formatPdf: 'وثائق PDF',
    formatVideo: 'فيديوهات وتسجيلات (MP4, WebM, MOV)',
    formatPresentation: 'عروض تقديمية (PPTX, PPT, ODP)',
    formatImage: 'صور ولوحات (JPG, PNG, WebP, GIF)',
    formatWord: 'مستندات ووثائق (DOCX, DOC, ODT)',
    searchPlaceholder: 'ابحث عن العناوين، المؤلفين، الفيديوهات أو عروض البوربوينت...',
    sortBy: 'ترتيب حسب',
    sortName: 'اسم الملف',
    sortSize: 'حجم الملف',
    sortDate: 'تاريخ الرفع',
    sortTitle: 'عنوان الوثيقة',
    sortAuthor: 'المؤلف / المحاضر',
    sortPageCount: 'عدد الصفحات',
    sortCreationDate: 'تاريخ الإنشاء',
    sortFileType: 'نوع الوسائط',
    sortAsc: 'تصاعدي',
    sortDesc: 'تنازلي',
    viewInline: 'عرض الملف مباشرة',
    openNewTab: 'فتح في نافذة جديدة',
    downloadPdf: 'تنزيل PDF',
    downloadFile: 'تنزيل الملف',
    downloadVideo: 'تنزيل الفيديو (MP4)',
    downloadPowerpoint: 'تنزيل عرض الشرائح (PPTX)',
    powerpointDeck: 'العرض التقديمي الأصلي المرفق',
    noPowerpointAttached: 'لا يوجد عرض بوربوينت مرتبط',
    attachPowerpoint: 'ربط ملف بوربوينت الأصلي (.pptx)',
    powerpointFileName: 'اسم ملف البوربوينت',
    powerpointFileSize: 'حجم ملف البوربوينت',
    downloadDisabled: 'التنزيل معطّل',
    downloadDisabledTip: 'تم تعطيل التنزيل بواسطة المسؤول (عرض مباشر فقط).',
    noPdfsFound: 'لا توجد وسائط تطابق معايير البحث',
    noPdfsFoundSub: 'جرّب اختيار مجلد آخر أو تغيير نوع التنسيق أو إزالة بعض الوسوم.',
    itemsCount: 'عنصر',
    foldersCount: 'مجموعة',
    adminPortal: 'بوابة الإدارة',
    adminLogin: 'تسجيل دخول المسؤول',
    adminLogout: 'تسجيل الخروج',
    adminUnlocked: 'وضع الإدارة نشط',
    enterPassword: 'أدخل كلمة مرور المسؤول',
    passwordPlaceholder: 'التحقق من التشفير التجزئي (Hash)...',
    loginButton: 'فتح بوابة الإدارة',
    invalidPassword: 'كلمة المرور غير صحيحة. رمز التجزئة المشفر لا يتطابق.',
    adminDashboardTitle: 'إدارة الأرشيف المركزي (v2)',
    tabFolders: 'المجلدات والتنظيم',
    tabUpload: 'واجهة الرفع GUI (لكافة التنسيقات)',
    tabExif: 'قواعد بيانات EXIF والوسائط',
    tabSecurity: 'الأمان والتشفير',
    tabExport: 'بدون قاعدة بيانات / تصدير',
    uploadTitle: 'رفع الوثائق، الفيديوهات، الصور أو المجلدات',
    uploadFolderSelect: 'مجلد المجموعة المستهدف',
    uploadDragDrop: 'اسحب وأفلت ملفات PDF أو Word (.docx) أو فيديو (.mp4) أو صور هنا',
    uploadSelectFiles: 'اختيار ملفات منفردة (PDF, Word, Video, Image)',
    uploadSelectFolder: 'رفع مجلد كامل',
    uploading: 'جاري المعالجة واستخراج البيانات الوصفية...',
    uploadProgress: 'مؤشر تقدم الرفع',
    uploadComplete: 'تم تحليل الملفات وحفظ بيانات EXIF وإضافتها للمعرض',
    extractedMetadata: 'بيانات EXIF والوسائط المحفوظة',
    batchProcessingTitle: 'المعالجة الدفعية واستيراد المجلدات المتعددة',
    autoTagFolderNotice: 'الوسم التلقائي نشط: ترث العناصر أسماء المجلدات كوسوم تلقائياً.',
    autoCreateFoldersToggle: 'إنشاء ألبومات جديدة تلقائياً عند إفلات مجلدات غير موجودة',
    autoTaggingToggle: 'وسم الوثائق تلقائياً بالاعتماد على أسماء المجلدات المسحوبة',
    batchItemsDetected: 'عنصر تم اكتشافها عبر المجلدات',
    newFolder: 'مجلد مجموعة جديد',
    folderName: 'اسم المجلد',
    folderDescription: 'الوصف والسياق',
    folderTags: 'وسوم المجلد (مفصولة بفواصل)',
    createFolder: 'إنشاء مجلد',
    editFolder: 'تعديل المجلد',
    deleteFolder: 'حذف المجلد',
    confirmDeleteFolder: 'هل أنت متأكد من رغبتك في حذف هذا المجلد ومحتوياته؟',
    confirmDeleteFile: 'هل أنت متأكد من حذف هذا الملف من المعرض؟',
    reorderHint: 'إعادة ترتيب المجلدات والوسائط:',
    moveUp: 'تحريك لأعلى',
    moveDown: 'تحريك لأسفل',
    visibleInFrontend: 'ظاهر في المعرض العام',
    hiddenInFrontend: 'مخفي من المعرض العام',
    allowDownloads: 'السماح بالتنزيل العام',
    downloadsEnabled: 'التنزيل مسموح',
    downloadsDisabled: 'التنزيل ممنوع (عرض مباشر فقط)',
    exifGovernanceTitle: 'التحكم في عرض بيانات EXIF والوسائط الوصفية',
    exifGovernanceDesc: 'تحتفظ الملفات بكافة بيانات EXIF/XMP والكوديك الأصلية. حدد الحقول التي تظهر للجمهور في الواجهة الأمامية.',
    fieldTitle: 'عنوان الوثيقة / الوسائط',
    fieldAuthor: 'المؤلف / المحاضر / المصور',
    fieldSubject: 'الموضوع / الملخص',
    fieldKeywords: 'الكلمات الدلالية المفتاحية',
    fieldCreationDate: 'تاريخ الإنشاء (EXIF)',
    fieldPageCount: 'عدد الصفحات',
    fieldProducer: 'البرنامج المنتج / الكاميرا / الكوديك',
    fieldFileSize: 'حجم الملف',
    fieldPdfVersion: 'مواصفات التنسيق / الإصدار',
    fieldDimensions: 'الأبعاد ودقة العرض',
    fieldVideoDuration: 'مدة الفيديو',
    fieldWordCount: 'عدد الكلمات والفقرات',
    showInFrontend: 'عرض في الواجهة الأمامية',
    visibleToAdminOnly: 'خاص بلوحة الإدارة فقط',
    changePassword: 'تغيير كلمة مرور المسؤول',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة',
    savePassword: 'تشفير وحفظ كلمة المرور',
    passwordChanged: 'تم تحديث وتشفير كلمة المرور بنجاح باستخدام خوارزمية SHA-256.',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    hashEncryptionNote: 'لا يتم تخزين كلمات المرور كنص صريح أبدًا، بل يتم تشفيرها وفق معايير Web Crypto الآمنة.',
    exportYaml: 'تصدير إعدادات YAML (settings.yaml)',
    importYaml: 'استيراد إعدادات YAML',
    exportSingleHtml: 'تصدير كملف HTML مستقل بالكامل',
    exportSingleHtmlDesc: 'إنشاء ملف HTML واحد مستقل بدون أي تبعيات، يجمع كافة الأنماط والبرمجة والمحتوى والوسائط.',
    phpGuideTitle: 'دليل النشر عبر خوادم PHP',
    phpGuideContent: 'يعمل النظام بالكامل بدون قاعدة بيانات (يدعم إصدارات PHP 8.1 و 8.2 و 8.3+). يمكنك وضع ملفات PDF و MP4 و DOCX في مجلد /documents/.',
    close: 'إغلاق',
    save: 'حفظ التعديلات',
    cancel: 'إلغاء',
    pages: 'صفحات',
    fileDetails: 'معلومات الوسائط والملف',
    exifInspector: 'مفتش بيانات EXIF والترميز الكاملة',
    rawExifData: 'قاموس البيانات الوصفية الخام',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    fitWidth: 'ملاءمة العرض',
    rotate: 'تدوير 90°',
    previousDoc: 'العنصر السابق',
    nextDoc: 'العنصر التالي',
    pageNavigation: 'صفحة',
    ofPage: 'من',
    copyMetadata: 'نسخ البيانات الوصفية كـ JSON',
    copied: 'تم النسخ إلى الحافظة!',
    standaloneNote: 'معمارية خالية من قواعد البيانات: كافة البيانات محفوظة في تنسيقات مسطحة محمولة.',
    resetDemoData: 'إعادة ضبط الكتالوج التجريبي',
    confirmReset: 'هل تريد إعادة تعيين كافة المجموعات والوسائط إلى الحالة النموذجية الأولية؟',
    videoDualDownloadNotice: 'حزمة تنزيل مزدوجة متاحة: تسجيل الفيديو (.mp4) + العرض التقديمي الأصلي المرفق (.pptx).',
    videoPlayer: 'مشغل الفيديو',
    wordDocumentViewer: 'عارض مستندات Word',
    imageViewer: 'مستعرض الصور عالي الدقة',
    words: 'كلمة',
    rssWidgetTitle: 'أحدث الإضافات',
    rssWidgetSubtitle: 'أحدث 10 إضافات للمستودع مع خلاصة Media RSS XML',
    rssFeedName: 'recently_added.rss',
    downloadRssFeed: 'تحميل recently_added.rss',
    viewRssFeed: 'عرض كود خلاصة RSS XML',
    copyRssXml: 'نسخ كود الخلاصة',
    rssCopied: 'تم نسخ كود خلاصة RSS إلى الحافظة!',
    enableRssWidget: 'تفعيل أداة أحدث الإضافات',
    disableRssWidget: 'تعطيل الأداة',
    rssWidgetToggleAdmin: 'عرض أداة أحدث الإضافات (Media RSS) في واجهة الزوار',
    rssWidgetEnabledNotice: 'أداة خلاصة RSS مفعلة وتعرض أحدث 10 ملفات مضافة.',
    rssWidgetDisabledNotice: 'أداة أحدث الإضافات مخفية حالياً.',
    recentlyAddedBadge: 'مضاف حديثاً',
    latestAdditions: 'أحدث 10 إضافات',
    downloadWord: 'تنزيل مستند Word',
    downloadImage: 'تنزيل الصورة',
    downloadPresentation: 'تنزيل عرض الشرائح',
    tableActions: 'الإجراءات',
    visible: 'ظاهر',
    hidden: 'مخفي',
    downloadOn: 'التنزيل مفعّل',
    downloadOff: 'التنزيل معطّل',
    changePpt: 'تغيير العرض',
    addPptDeck: '+ عرض بوربوينت',
    noDescription: 'لا يوجد وصف مدخل',
    mediaOrderingTitle: 'ترتيب الوسائط وإعداد التنزيل المزدوج',
    autoAttachPptxNotice: 'تجهيز ملف عرض بوربوينت تلقائياً مع الفيديوهات المرفوعة',
    batchDropHint: 'أفلت عدة ملفات أو مجلدات متكاملة دفعة واحدة. سيتم وسمها وإنشاء الألبومات تلقائياً.',
    supportedFormatsHint: 'التنسيقات المدعومة: PDF, DOCX, DOC, ODT, MP4, WEBM, MOV, PPTX, PPT, ODP, JPG, PNG, WEBP, GIF.',
    authVerifying: 'جاري التحقق من التجزئة...',
    defaultPasswordDemo: 'كلمة المرور الافتراضية للتجربة: admin123',
    importYamlSuccess: 'تم استيراد إعدادات YAML بنجاح!',
    copyScript: 'نسخ الكود',
    scriptCopied: 'تم نسخ الكود!',
    generateSingleHtml: 'توليد ملف HTML المستقل',
    importYamlButton: 'استيراد YAML',
    exportYamlButton: 'تصدير YAML',
    gridMode: 'عرض شبكي',
    listMode: 'عرض القائمة',
    resetFilterTag: 'إلغاء التصفية',
    passwordMinLength: 'يجب ألا تقل كلمة المرور عن 4 أحرف.',
    activeHashLabel: 'رمز تجزئة SHA-256 النشط:',
    supportedPhpVersions: 'الإصدارات المدعومة: PHP 8.1 و 8.2 و 8.3+ (ماسح المجلدات متعدد التنسيقات)',
    heroDescription: 'معرض وأرشيف مركزي لوثائق PDF والمجلدات والمونوغرافات المعمارية والمعارض الفنية. مبني بالكامل بدون قواعد بيانات: يعتمد على ملفات مسطحة محمولة، وتشفير SHA-256 لإدارة النظام، مع الاحتفاظ الكامل ببيانات EXIF.',
    heroVolBadge: 'الأرشيف المركزي · مواصفات خالية من قواعد البيانات',
    heroFigCaption: 'شكل 1 — لوحة فحص أرشيفية تحتفظ بالرسومات المتجهة والسجلات الوصفية الكاملة.',
    coreDatabaselessTitle: 'بدون قاعدة بيانات',
    coreDatabaselessSubtitle: 'تخزين مسطح عبر YAML',
    coreCryptoTitle: 'تشفير فائق',
    coreCryptoSubtitle: 'تجزئة SHA-256 مع ملح مشفر',
    coreExifTitle: 'حوكمة EXIF',
    coreExifSubtitle: 'كشف مخصص للواجهة الأمامية',
    coreLangTitle: 'دعم كامل لـ RTL واللغات',
    coreLangSubtitle: 'العربية، اليابانية، الإنجليزية',
    skipToContent: 'الانتقال إلى المحتوى الرئيسي',
    mainNavigation: 'التنقل الرئيسي',
    themeToggleLight: 'التبديل إلى المظهر الفاتح',
    themeToggleDark: 'التبديل إلى المظهر الداكن',
    selectLanguage: 'اختر لغة العرض',
    resultsCountLive: 'يتم عرض {count} عنصراً',
    closeDialog: 'إغلاق النافذة المنبثقة',
    catalogTableCaption: 'فهرس وسائط ومستندات الأرشيف',
  },
  ja: {
    brandTitle: 'FolioVault',
    brandTagline: 'データベース不要の中央マルチメディア＆文書ギャラリー (v2.0)',
    versionBadge: 'バージョン 2.0 (動画・画像・Word対応 + 動画・PPTデュアルダウンロード)',
    allAlbums: 'すべてのコレクション',
    allTags: 'すべてのタグ',
    filterByFolder: 'フォルダで絞り込み',
    filterByTag: 'タグで絞り込み',
    filterByFormat: 'メディア形式',
    formatAll: '全形式',
    formatPdf: 'PDF文書',
    formatVideo: '動画・録画 (MP4, WebM, MOV)',
    formatPresentation: 'スライド資料 (PPTX, PPT, ODP)',
    formatImage: '画像 (JPG, PNG, WebP, GIF)',
    formatWord: '文書・原稿 (DOCX, DOC, ODT)',
    searchPlaceholder: 'タイトル、著者、キーワード、動画、スライドを検索...',
    sortBy: '並び替え',
    sortName: 'ファイル名',
    sortSize: 'ファイルサイズ',
    sortDate: 'アップロード日',
    sortTitle: 'ドキュメント名',
    sortAuthor: '著者・登壇者',
    sortPageCount: 'ページ数',
    sortCreationDate: '作成日',
    sortFileType: 'メディア種類',
    sortAsc: '昇順',
    sortDesc: '降順',
    viewInline: 'アイテムを表示',
    openNewTab: '新しいタブで開く',
    downloadPdf: 'PDFをダウンロード',
    downloadFile: 'ファイルをダウンロード',
    downloadVideo: '動画をダウンロード (MP4)',
    downloadPowerpoint: 'スライドをダウンロード (PPTX)',
    powerpointDeck: '付属のオリジナル発表資料 (PPTX)',
    noPowerpointAttached: 'スライドは未設定です',
    attachPowerpoint: '元PowerPointスライド (.pptx) を添付',
    powerpointFileName: 'スライドファイル名',
    powerpointFileSize: 'スライドサイズ',
    downloadDisabled: 'ダウンロード制限中',
    downloadDisabledTip: '管理者によりダウンロードが制限されています（閲覧のみ可能）。',
    noPdfsFound: '該当するアイテムが見つかりません',
    noPdfsFoundSub: '別のコレクションまたはファイル形式を選択するか、タグフィルターを解除してください。',
    itemsCount: '件のアイテム',
    foldersCount: '件のコレクション',
    adminPortal: '管理者ポータル',
    adminLogin: '管理者ログイン',
    adminLogout: 'ログアウト',
    adminUnlocked: '管理者モード有効',
    enterPassword: '管理者パスワードを入力',
    passwordPlaceholder: '暗号化ハッシュ検証...',
    loginButton: '管理者画面を開く',
    invalidPassword: 'パスワードが正しくありません。暗号化ハッシュが一致しません。',
    adminDashboardTitle: 'アーカイブ統合管理 (v2)',
    tabFolders: 'フォルダ・整理',
    tabUpload: 'アップロードGUI (全形式対応)',
    tabExif: 'EXIF・メタデータ規約',
    tabSecurity: 'セキュリティ・ハッシュ',
    tabExport: 'DB不要・エクスポート',
    uploadTitle: '文書・動画・画像・フォルダの一括アップロード',
    uploadFolderSelect: '対象コレクションフォルダ',
    uploadDragDrop: 'PDF、Word (.docx)、動画 (.mp4)、画像をドラッグ＆ドロップ',
    uploadSelectFiles: 'ファイルを選択 (PDF, Word, Video, Image)',
    uploadSelectFolder: 'フォルダごとアップロード',
    uploading: '処理中・メタデータを抽出しています...',
    uploadProgress: 'アップロード進行状況',
    uploadComplete: 'ファイルの解析とEXIF情報の保持が完了しました',
    extractedMetadata: '保持されたEXIFメタデータ',
    batchProcessingTitle: '一括バッチ処理と複数フォルダ自動取り込み',
    autoTagFolderNotice: '自動タグ付け有効：アイテムはフォルダ名やサブ階層名を自動でタグとして継承します。',
    autoCreateFoldersToggle: 'ドロップされたフォルダが存在しない場合にアルバムを自動作成',
    autoTaggingToggle: 'フォルダ名に基づいてドキュメントを自動タグ付け',
    batchItemsDetected: '件のアイテムをディレクトリから検出',
    newFolder: '新しいコレクションフォルダ',
    folderName: 'フォルダ名',
    folderDescription: '説明・概要',
    folderTags: 'フォルダタグ（カンマ区切り）',
    createFolder: 'フォルダを作成',
    editFolder: 'フォルダを編集',
    deleteFolder: 'フォルダを削除',
    confirmDeleteFolder: 'このコレクションフォルダとそのアイテムを削除してもよろしいですか？',
    confirmDeleteFile: 'このファイルをギャラリーから削除してもよろしいですか？',
    reorderHint: 'アルバムおよびアイテムの並び替え:',
    moveUp: '上へ移動',
    moveDown: '下へ移動',
    visibleInFrontend: '公開ギャラリーに表示',
    hiddenInFrontend: '公開ギャラリーで非表示',
    allowDownloads: '一般ダウンロードを許可',
    downloadsEnabled: 'ダウンロード許可',
    downloadsDisabled: 'ダウンロード禁止（閲覧のみ）',
    exifGovernanceTitle: 'EXIF・メディア情報の公開ガバナンス',
    exifGovernanceDesc: 'メディアファイルは内部のEXIF/XMP/Codec情報を保持します。一般公開する属性を選択してください。',
    fieldTitle: 'アイテム名・タイトル',
    fieldAuthor: '著者・登壇者・撮影者',
    fieldSubject: '件名・概要',
    fieldKeywords: 'キーワード・索引語',
    fieldCreationDate: '作成日時 (EXIF)',
    fieldPageCount: 'ページ数',
    fieldProducer: '作成ソフト・カメラ・コーデック',
    fieldFileSize: 'ファイルサイズ',
    fieldPdfVersion: '仕様バージョン・形式',
    fieldDimensions: '解像度・アスペクト比',
    fieldVideoDuration: '動画再生時間',
    fieldWordCount: '文字数・段落数',
    showInFrontend: 'フロントエンドで表示',
    visibleToAdminOnly: '管理者画面のみ表示',
    changePassword: '管理者パスワードの変更',
    newPassword: '新しいパスワード',
    confirmPassword: 'パスワードの再確認',
    savePassword: 'ハッシュ化して保存',
    passwordChanged: 'パスワードがSHA-256で安全にハッシュ化され保存されました。',
    passwordMismatch: 'パスワードが一致しません。',
    hashEncryptionNote: 'パスワードは平文で保存されず、Web Crypto規格のSHA-256によって暗号化ハッシュとして保管されます。',
    exportYaml: 'YAML設定をエクスポート (settings.yaml)',
    importYaml: 'YAML設定をインポート',
    exportSingleHtml: '単一HTMLファイルバンドルを出力',
    exportSingleHtmlDesc: 'HTML・CSS・JS・動画・Word・PDFが1つの独立したHTMLファイルにパッケージ化され即座に動作します。',
    phpGuideTitle: 'PHPサーバー運用ガイド',
    phpGuideContent: 'データベースは不要です。PHP環境（PHP 8.1、8.2、8.3+対応）では、PDF・MP4・DOCX等を/documents/に配置するだけでSQL不要の軽量運用が可能です。',
    close: '閉じる',
    save: '変更を保存',
    cancel: 'キャンセル',
    pages: 'ページ',
    fileDetails: 'メディア詳細情報',
    exifInspector: 'EXIF / メタデータ完全インスペクター',
    rawExifData: '未加工メタデータ全辞書',
    zoomIn: '拡大',
    zoomOut: '縮小',
    fitWidth: '幅に合わせる',
    rotate: '90度回転',
    previousDoc: '前のアイテム',
    nextDoc: '次のアイテム',
    pageNavigation: 'ページ',
    ofPage: '/',
    copyMetadata: 'メタデータをJSONとしてコピー',
    copied: 'クリップボードにコピーしました！',
    standaloneNote: 'データベースレス設計：マルチフォーマット対応のフラットデータ構造。',
    resetDemoData: 'デモカタログを初期化',
    confirmReset: 'すべてのコレクションとアイテムを初期状態にリセットしますか？',
    videoDualDownloadNotice: 'デュアルダウンロード対応：録画動画 (.mp4) と 元PowerPoint発表スライド (.pptx) の両方を提供。',
    videoPlayer: '動画プレーヤー',
    wordDocumentViewer: 'Word文書ビューアー',
    imageViewer: '高解像度画像インスペクター',
    words: '文字',
    rssWidgetTitle: '最近追加されたメディア',
    rssWidgetSubtitle: '最新10件のメディアとMedia RSSフィード',
    rssFeedName: 'recently_added.rss',
    downloadRssFeed: 'recently_added.rss をダウンロード',
    viewRssFeed: 'RSS XMLフィードを表示',
    copyRssXml: 'フィードXMLをコピー',
    rssCopied: 'RSS XMLフィードをクリップボードにコピーしました！',
    enableRssWidget: '最近の追加ウィジェットを有効化',
    disableRssWidget: 'ウィジェットを無効化',
    rssWidgetToggleAdmin: 'フロントエンドで「最近の追加 (Media RSS)」ウィジェットを表示',
    rssWidgetEnabledNotice: 'Media RSSウィジェットは有効で、最新10件のアイテムを監視しています。',
    rssWidgetDisabledNotice: '最近の追加ウィジェットは現在非表示です。',
    recentlyAddedBadge: '新着',
    latestAdditions: '最新10件',
    downloadWord: 'Word文書をダウンロード',
    downloadImage: '画像をダウンロード',
    downloadPresentation: 'スライドをダウンロード',
    tableActions: '操作',
    visible: '公開',
    hidden: '非表示',
    downloadOn: 'DL許可',
    downloadOff: 'DL禁止',
    changePpt: 'PPT変更',
    addPptDeck: '+ PPT添付',
    noDescription: '説明文はありません',
    mediaOrderingTitle: 'メディア並び替え＆デュアルDL設定',
    autoAttachPptxNotice: '動画アップロード時に元PPTスライドのDL枠を自動付与',
    batchDropHint: '複数ファイルやフォルダ階層を一括ドロップ。自動タグ付けとアルバム作成を行います。',
    supportedFormatsHint: '対応形式: PDF, DOCX, DOC, ODT, MP4, WEBM, MOV, PPTX, PPT, ODP, JPG, PNG, WEBP, GIF',
    authVerifying: 'ハッシュ照合中...',
    defaultPasswordDemo: 'デモ用初期パスワード: admin123',
    importYamlSuccess: 'YAML設定が正常にインポートされました！',
    copyScript: 'スクリプトをコピー',
    scriptCopied: 'コピー完了！',
    generateSingleHtml: '単一HTML生成',
    importYamlButton: 'YAMLをインポート',
    exportYamlButton: 'YAMLをエクスポート',
    gridMode: 'グリッド表示',
    listMode: 'リスト表示',
    resetFilterTag: 'リセット',
    passwordMinLength: 'パスワードは4文字以上である必要があります。',
    activeHashLabel: '適用中のSHA-256暗号化ハッシュ:',
    supportedPhpVersions: '対応バージョン: PHP 8.1, PHP 8.2, PHP 8.3+（マルチフォーマットスキャナー）',
    heroDescription: 'PDF文書、学術フォリオ、建築モノグラフ、展覧会図録の中央ギャラリー。データベースを一切使用せず、ポータブルなフラットデータ、SHA-256暗号化管理、完全なEXIFメタデータ保持により構築されています。',
    heroVolBadge: '中央アーカイブ · データベースレス仕様',
    heroFigCaption: '図1 — ベクター図版とメタデータ記録が保存されたアーカイブ調査フォリオ。',
    coreDatabaselessTitle: 'DB完全不要',
    coreDatabaselessSubtitle: 'YAML / フラットファイル保存',
    coreCryptoTitle: '暗号化認証',
    coreCryptoSubtitle: 'Salt付きSHA-256 Web Crypto',
    coreExifTitle: 'EXIFガバナンス',
    coreExifSubtitle: 'フロントエンド公開設定',
    coreLangTitle: 'RTL＆多言語対応',
    coreLangSubtitle: 'アラビア語・日本語・英語',
    skipToContent: 'メインコンテンツへスキップ',
    mainNavigation: 'メインナビゲーション',
    themeToggleLight: 'ライトテーマに切り替え',
    themeToggleDark: 'ダークテーマに切り替え',
    selectLanguage: '表示言語を選択',
    resultsCountLive: '{count}件のアイテムを表示中',
    closeDialog: 'ダイアログを閉じる',
    catalogTableCaption: 'メディアアーカイブ文書および資産カタログ',
  }
};
