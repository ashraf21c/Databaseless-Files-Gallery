/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export interface TranslationDictionary {
  brandTitle: string;
  brandTagline: string;
  allAlbums: string;
  allTags: string;
  filterByFolder: string;
  filterByTag: string;
  searchPlaceholder: string;
  sortBy: string;
  sortName: string;
  sortSize: string;
  sortDate: string;
  sortTitle: string;
  sortAuthor: string;
  sortPageCount: string;
  sortCreationDate: string;
  sortAsc: string;
  sortDesc: string;
  viewInline: string;
  openNewTab: string;
  downloadPdf: string;
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
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandTitle: 'FolioVault',
    brandTagline: 'Databaseless Central PDF Archive & Gallery',
    allAlbums: 'All Collections',
    allTags: 'All Tags',
    filterByFolder: 'Filter by Folder',
    filterByTag: 'Filter by Tag',
    searchPlaceholder: 'Search titles, authors, keywords or folder names...',
    sortBy: 'Sort by',
    sortName: 'File Name',
    sortSize: 'File Size',
    sortDate: 'Upload Date',
    sortTitle: 'Document Title',
    sortAuthor: 'Author',
    sortPageCount: 'Page Count',
    sortCreationDate: 'Creation Date',
    sortAsc: 'Ascending',
    sortDesc: 'Descending',
    viewInline: 'View Document',
    openNewTab: 'Open in New Window',
    downloadPdf: 'Download PDF',
    downloadDisabled: 'Downloads Disabled',
    downloadDisabledTip: 'Download restricted by archive administrator (inline reading only).',
    noPdfsFound: 'No PDF documents match your criteria',
    noPdfsFoundSub: 'Try selecting a different collection folder or clearing active tags.',
    itemsCount: 'documents',
    foldersCount: 'collections',
    adminPortal: 'Admin Portal',
    adminLogin: 'Admin Sign In',
    adminLogout: 'Sign Out',
    adminUnlocked: 'Admin Mode Active',
    enterPassword: 'Enter Admin Password',
    passwordPlaceholder: 'Encrypted hash verification...',
    loginButton: 'Unlock Admin Portal',
    invalidPassword: 'Incorrect password. Cryptographic hash did not match.',
    adminDashboardTitle: 'Central Archive Management',
    tabFolders: 'Folders & Organization',
    tabUpload: 'Upload GUI',
    tabExif: 'EXIF & Metadata Rules',
    tabSecurity: 'Security & Hash',
    tabExport: 'Databaseless / Export',
    uploadTitle: 'Upload Documents or Entire Folders',
    uploadFolderSelect: 'Target Collection Folder',
    uploadDragDrop: 'Drag and drop PDF files or click below to upload',
    uploadSelectFiles: 'Select Individual PDFs',
    uploadSelectFolder: 'Upload Entire Folder',
    uploading: 'Processing & Extracting Metadata...',
    uploadProgress: 'Upload Progress',
    uploadComplete: 'Files parsed, EXIF retained, and added to gallery',
    extractedMetadata: 'Retained EXIF Metadata',
    newFolder: 'New Collection Folder',
    folderName: 'Folder Name',
    folderDescription: 'Description / Context',
    folderTags: 'Folder Tags (comma separated)',
    createFolder: 'Create Folder',
    editFolder: 'Edit Folder',
    deleteFolder: 'Delete Folder',
    confirmDeleteFolder: 'Are you sure you want to delete this collection and its references?',
    confirmDeleteFile: 'Are you sure you want to delete this document from the gallery?',
    reorderHint: 'Re-arrange albums & documents order:',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    visibleInFrontend: 'Visible in Public Gallery',
    hiddenInFrontend: 'Hidden from Public Gallery',
    allowDownloads: 'Allow Public Downloads',
    downloadsEnabled: 'Downloads Allowed',
    downloadsDisabled: 'Downloads Prohibited (Inline Only)',
    exifGovernanceTitle: 'EXIF Metadata Display Governance',
    exifGovernanceDesc: 'PDFs retain their full internal EXIF/XMP data. Select which attributes are publicly rendered in the front end. All attributes remain visible in the Admin back end.',
    fieldTitle: 'Document Title',
    fieldAuthor: 'Author / Contributor',
    fieldSubject: 'Subject / Abstract',
    fieldKeywords: 'Keywords / Index Terms',
    fieldCreationDate: 'Creation Date (EXIF)',
    fieldPageCount: 'Page Count',
    fieldProducer: 'PDF Producer / Software',
    fieldFileSize: 'File Size',
    fieldPdfVersion: 'PDF Specification Version',
    fieldDimensions: 'Page Dimensions & Format',
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
    exportSingleHtmlDesc: 'Generate a single, zero-dependency HTML file containing all HTML, CSS, JS, albums, and metadata ready for any static web host or USB distribution.',
    phpGuideTitle: 'PHP Deployment & Server Guide',
    phpGuideContent: 'FolioVault is fully databaseless. When deploying with PHP (supports PHP 8.1, 8.2, and 8.3+), you can place PDFs in a /documents/ folder and use our flat-file directory parser without SQL.',
    close: 'Close',
    save: 'Save Changes',
    cancel: 'Cancel',
    pages: 'pages',
    fileDetails: 'Document Information',
    exifInspector: 'Full EXIF / XMP Inspector',
    rawExifData: 'Complete Raw Metadata Dictionary',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitWidth: 'Fit Width',
    rotate: 'Rotate 90°',
    previousDoc: 'Previous Document',
    nextDoc: 'Next Document',
    pageNavigation: 'Page',
    ofPage: 'of',
    copyMetadata: 'Copy Metadata as JSON',
    copied: 'Copied to Clipboard!',
    standaloneNote: 'Zero-Database Architecture: all data is maintained in flat portable schemas.',
    resetDemoData: 'Reset Demo Catalog',
    confirmReset: 'Reset all collections and documents to initial curated sample state?'
  },
  ar: {
    brandTitle: 'فوليو فولت',
    brandTagline: 'معرض وأرشيف PDF المركزي بدون قاعدة بيانات',
    allAlbums: 'جميع المجموعات',
    allTags: 'جميع الوسوم',
    filterByFolder: 'تصفية حسب المجلد',
    filterByTag: 'تصفية حسب الوسم',
    searchPlaceholder: 'ابحث عن العناوين، المؤلفين، الكلمات المفتاحية أو المجلدات...',
    sortBy: 'ترتيب حسب',
    sortName: 'اسم الملف',
    sortSize: 'حجم الملف',
    sortDate: 'تاريخ الرفع',
    sortTitle: 'عنوان الوثيقة',
    sortAuthor: 'المؤلف',
    sortPageCount: 'عدد الصفحات',
    sortCreationDate: 'تاريخ الإنشاء',
    sortAsc: 'تصاعدي',
    sortDesc: 'تنازلي',
    viewInline: 'عرض الوثيقة مباشرة',
    openNewTab: 'فتح في نافذة جديدة',
    downloadPdf: 'تنزيل ملف PDF',
    downloadDisabled: 'التنزيل معطّل',
    downloadDisabledTip: 'تم تعطيل التنزيل بواسطة المسؤول (قراءة مباشرة فقط).',
    noPdfsFound: 'لا توجد وثائق تطابق معايير البحث',
    noPdfsFoundSub: 'جرّب اختيار مجلد آخر أو إزالة بعض الوسوم المحددة.',
    itemsCount: 'وثيقة',
    foldersCount: 'مجموعة',
    adminPortal: 'بوابة الإدارة',
    adminLogin: 'تسجيل دخول المسؤول',
    adminLogout: 'تسجيل الخروج',
    adminUnlocked: 'وضع الإدارة نشط',
    enterPassword: 'أدخل كلمة مرور المسؤول',
    passwordPlaceholder: 'التحقق من التشفير التجزئي (Hash)...',
    loginButton: 'فتح بوابة الإدارة',
    invalidPassword: 'كلمة المرور غير صحيحة. رمز التجزئة المشفر لا يتطابق.',
    adminDashboardTitle: 'إدارة الأرشيف المركزي',
    tabFolders: 'المجلدات والتنظيم',
    tabUpload: 'واجهة الرفع GUI',
    tabExif: 'قواعد بيانات EXIF الوصفية',
    tabSecurity: 'الأمان والتشفير',
    tabExport: 'بدون قاعدة بيانات / تصدير',
    uploadTitle: 'رفع الوثائق أو مجلدات كاملة',
    uploadFolderSelect: 'مجلد المجموعة المستهدف',
    uploadDragDrop: 'اسحب وأفلت ملفات PDF هنا أو انقر للاختيار',
    uploadSelectFiles: 'اختيار ملفات PDF منفردة',
    uploadSelectFolder: 'رفع مجلد كامل',
    uploading: 'جاري المعالجة واستخراج البيانات الوصفية...',
    uploadProgress: 'مؤشر تقدم الرفع',
    uploadComplete: 'تم تحليل الملفات وحفظ بيانات EXIF وإضافتها للمعرض',
    extractedMetadata: 'بيانات EXIF المحفوظة',
    newFolder: 'مجلد مجموعة جديد',
    folderName: 'اسم المجلد',
    folderDescription: 'الوصف والسياق',
    folderTags: 'وسوم المجلد (مفصولة بفواصل)',
    createFolder: 'إنشاء مجلد',
    editFolder: 'تعديل المجلد',
    deleteFolder: 'حذف المجلد',
    confirmDeleteFolder: 'هل أنت متأكد من رغبتك في حذف هذا المجلد ومحتوياته؟',
    confirmDeleteFile: 'هل أنت متأكد من حذف هذه الوثيقة من المعرض؟',
    reorderHint: 'إعادة ترتيب المجلدات والوثائق:',
    moveUp: 'تحريك لأعلى',
    moveDown: 'تحريك لأسفل',
    visibleInFrontend: 'ظاهر في المعرض العام',
    hiddenInFrontend: 'مخفي من المعرض العام',
    allowDownloads: 'السماح بالتنزيل العام',
    downloadsEnabled: 'التنزيل مسموح',
    downloadsDisabled: 'التنزيل ممنوع (عرض مباشر فقط)',
    exifGovernanceTitle: 'التحكم في عرض بيانات EXIF الوصفية',
    exifGovernanceDesc: 'تحتفظ ملفات PDF بكافة بيانات EXIF/XMP الأصلية. حدد الحقول التي تظهر للجمهور في الواجهة الأمامية. يرى المسؤول كافة الحقول في الواجهة الخلفية.',
    fieldTitle: 'عنوان الوثيقة',
    fieldAuthor: 'المؤلف / المساهم',
    fieldSubject: 'الموضوع / الملخص',
    fieldKeywords: 'الكلمات الدلالية المفتاحية',
    fieldCreationDate: 'تاريخ الإنشاء (EXIF)',
    fieldPageCount: 'عدد الصفحات',
    fieldProducer: 'البرنامج المنشئ / المنتج',
    fieldFileSize: 'حجم الملف',
    fieldPdfVersion: 'إصدار مواصفات PDF',
    fieldDimensions: 'أبعاد الصفحة وتنسيقها',
    showInFrontend: 'عرض في الواجهة الأمامية',
    visibleToAdminOnly: 'خاص بلوحة الإدارة فقط',
    changePassword: 'تغيير كلمة مرور المسؤول',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة',
    savePassword: 'تشفير وحفظ كلمة المرور',
    passwordChanged: 'تم تحديث وتشفير كلمة المرور بنجاح باستخدام خوارزمية SHA-256.',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    hashEncryptionNote: 'لا يتم تخزين كلمات المرور كنص صريح أبدًا، بل يتم تشفيرها وفق معايير Web Crypto التجزئية الآمنة.',
    exportYaml: 'تصدير إعدادات YAML (settings.yaml)',
    importYaml: 'استيراد إعدادات YAML',
    exportSingleHtml: 'تصدير كملف HTML مستقل بالكامل',
    exportSingleHtmlDesc: 'إنشاء ملف HTML واحد مستقل بدون أي تبعيات، يجمع كافة الأنماط والبرمجة والمحتوى ليعمل في أي استضافة أو عبر وحدة تخزين USB.',
    phpGuideTitle: 'دليل النشر عبر خوادم PHP',
    phpGuideContent: 'يعمل النظام بالكامل بدون قاعدة بيانات (يدعم إصدارات PHP 8.1 و 8.2 و 8.3+). يمكنك وضع ملفاتك في مجلد /documents/ واستخدام الماسح المسطح بدون SQL.',
    close: 'إغلاق',
    save: 'حفظ التعديلات',
    cancel: 'إلغاء',
    pages: 'صفحات',
    fileDetails: 'معلومات الوثيقة',
    exifInspector: 'مفتش بيانات EXIF / XMP الكاملة',
    rawExifData: 'قاموس البيانات الوصفية الخام',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    fitWidth: 'ملاءمة العرض',
    rotate: 'تدوير 90°',
    previousDoc: 'الوثيقة السابقة',
    nextDoc: 'الوثيقة التالية',
    pageNavigation: 'صفحة',
    ofPage: 'من',
    copyMetadata: 'نسخ البيانات الوصفية كـ JSON',
    copied: 'تم النسخ إلى الحافظة!',
    standaloneNote: 'معمارية خالية من قواعد البيانات: كافة البيانات محفوظة في تنسيقات مسطحة محمولة.',
    resetDemoData: 'إعادة ضبط الكتالوج التجريبي',
    confirmReset: 'هل تريد إعادة تعيين كافة المجموعات والوثائق إلى الحالة النموذجية الأولية؟'
  },
  ja: {
    brandTitle: 'FolioVault',
    brandTagline: 'データベース不要の中央PDFアーカイブ＆ギャラリー',
    allAlbums: 'すべてのコレクション',
    allTags: 'すべてのタグ',
    filterByFolder: 'フォルダで絞り込み',
    filterByTag: 'タグで絞り込み',
    searchPlaceholder: 'タイトル、著者、キーワード、フォルダ名を検索...',
    sortBy: '並び替え',
    sortName: 'ファイル名',
    sortSize: 'ファイルサイズ',
    sortDate: 'アップロード日',
    sortTitle: 'ドキュメント名',
    sortAuthor: '著者',
    sortPageCount: 'ページ数',
    sortCreationDate: '作成日',
    sortAsc: '昇順',
    sortDesc: '降順',
    viewInline: 'ドキュメントを表示',
    openNewTab: '新しいタブで開く',
    downloadPdf: 'PDFをダウンロード',
    downloadDisabled: 'ダウンロード制限中',
    downloadDisabledTip: '管理者によりダウンロードが制限されています（閲覧のみ可能）。',
    noPdfsFound: '該当するPDFドキュメントが見つかりません',
    noPdfsFoundSub: '別のコレクションを選択するか、タグフィルターを解除してください。',
    itemsCount: '件のドキュメント',
    foldersCount: '件のコレクション',
    adminPortal: '管理者ポータル',
    adminLogin: '管理者ログイン',
    adminLogout: 'ログアウト',
    adminUnlocked: '管理者モード有効',
    enterPassword: '管理者パスワードを入力',
    passwordPlaceholder: '暗号化ハッシュ検証...',
    loginButton: '管理者画面を開く',
    invalidPassword: 'パスワードが正しくありません。暗号化ハッシュが一致しません。',
    adminDashboardTitle: 'アーカイブ統合管理',
    tabFolders: 'フォルダ・整理',
    tabUpload: 'アップロードGUI',
    tabExif: 'EXIF・メタデータ規約',
    tabSecurity: 'セキュリティ・ハッシュ',
    tabExport: 'DB不要・エクスポート',
    uploadTitle: 'ドキュメントまたはフォルダの一括アップロード',
    uploadFolderSelect: '対象コレクションフォルダ',
    uploadDragDrop: 'PDFファイルをドラッグ＆ドロップ、または選択してください',
    uploadSelectFiles: 'PDFファイルを個別に選択',
    uploadSelectFolder: 'フォルダごとアップロード',
    uploading: '処理中・メタデータを抽出しています...',
    uploadProgress: 'アップロード進行状況',
    uploadComplete: 'ファイルの解析とEXIF情報の保持が完了しました',
    extractedMetadata: '保持されたEXIFメタデータ',
    newFolder: '新しいコレクションフォルダ',
    folderName: 'フォルダ名',
    folderDescription: '説明・概要',
    folderTags: 'フォルダタグ（カンマ区切り）',
    createFolder: 'フォルダを作成',
    editFolder: 'フォルダを編集',
    deleteFolder: 'フォルダを削除',
    confirmDeleteFolder: 'このコレクションフォルダとそのドキュメントを削除してもよろしいですか？',
    confirmDeleteFile: 'このドキュメントをギャラリーから削除してもよろしいですか？',
    reorderHint: 'アルバムおよびドキュメントの並び替え:',
    moveUp: '上へ移動',
    moveDown: '下へ移動',
    visibleInFrontend: '公開ギャラリーに表示',
    hiddenInFrontend: '公開ギャラリーで非表示',
    allowDownloads: '一般ダウンロードを許可',
    downloadsEnabled: 'ダウンロード許可',
    downloadsDisabled: 'ダウンロード禁止（閲覧のみ）',
    exifGovernanceTitle: 'EXIFメタデータの公開ガバナンス',
    exifGovernanceDesc: 'PDFは内部のEXIF/XMP情報を完全に保持します。フロントエンドで一般公開する属性を選択してください。管理画面では常にすべての属性が表示されます。',
    fieldTitle: 'ドキュメントタイトル',
    fieldAuthor: '著者・作成者',
    fieldSubject: '件名・アブストラクト',
    fieldKeywords: 'キーワード・索引語',
    fieldCreationDate: '作成日時 (EXIF)',
    fieldPageCount: 'ページ数',
    fieldProducer: 'PDF作成ソフトウェア・プロデューサー',
    fieldFileSize: 'ファイルサイズ',
    fieldPdfVersion: 'PDF仕様バージョン',
    fieldDimensions: 'ページ寸法・フォーマット',
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
    exportSingleHtmlDesc: 'HTML・CSS・JS・メタデータが1つの独立したHTMLファイルにパッケージ化され、DB不要で静的サーバーやUSB等で即座に動作します。',
    phpGuideTitle: 'PHPサーバー運用ガイド',
    phpGuideContent: 'データベースは不要です。PHP環境（PHP 8.1、8.2、8.3+対応）では、PDFを/documents/に配置するだけでSQL不要の軽量フラットファイル運用が可能です。',
    close: '閉じる',
    save: '変更を保存',
    cancel: 'キャンセル',
    pages: 'ページ',
    fileDetails: 'ドキュメント詳細情報',
    exifInspector: 'EXIF / XMP 完全インスペクター',
    rawExifData: '未加工メタデータ全辞書',
    zoomIn: '拡大',
    zoomOut: '縮小',
    fitWidth: '幅に合わせる',
    rotate: '90度回転',
    previousDoc: '前のドキュメント',
    nextDoc: '次のドキュメント',
    pageNavigation: 'ページ',
    ofPage: '/',
    copyMetadata: 'メタデータをJSONとしてコピー',
    copied: 'クリップボードにコピーしました！',
    standaloneNote: 'データベースレス設計：すべての情報はポータブルなフラットデータ構造で管理されます。',
    resetDemoData: 'デモカタログを初期化',
    confirmReset: 'すべてのコレクションとドキュメントを初期状態にリセットしますか？'
  }
};
