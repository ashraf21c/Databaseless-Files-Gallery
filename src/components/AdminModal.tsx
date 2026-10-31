/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  X,
  Lock,
  Unlock,
  FolderPlus,
  Upload,
  Sliders,
  KeyRound,
  FileDown,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  FileText,
  Video,
  Presentation,
  FileSpreadsheet,
  Image as ImageIcon,
  Folder,
  Copy,
  RefreshCw,
  FolderTree,
  Tags
} from 'lucide-react';
import { AdminConfig, ExifDisplaySettings, FileType, Language, MediaItem, PdfFolder } from '../types';
import { verifyPassword, hashPassword } from '../utils/crypto';
import {
  detectFileType,
  extractMultiFormatMetadata,
  generateSvgThumbnail,
  createSamplePowerpointBlob
} from '../utils/pdfExtractor';
import {
  exportGalleryToYaml,
  importGalleryFromYaml,
  generateSingleHtmlBundle,
  PHP_SCANNER_GUIDE
} from '../utils/storage';
import { translations } from '../utils/translations';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onAuthenticate: () => void;
  onLogout: () => void;
  language: Language;
  folders: PdfFolder[];
  items: MediaItem[];
  config: AdminConfig;
  onUpdateFolders: (folders: PdfFolder[]) => void;
  onUpdateItems: (items: MediaItem[]) => void;
  onUpdateConfig: (config: AdminConfig) => void;
  onResetCatalog: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onAuthenticate,
  onLogout,
  language,
  folders,
  items,
  config,
  onUpdateFolders,
  onUpdateItems,
  onUpdateConfig,
  onResetCatalog,
}) => {
  const t = translations[language];

  // Auth state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'folders' | 'upload' | 'exif' | 'security' | 'export'>('folders');

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Folder creation / edit state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newFolderTags, setNewFolderTags] = useState('');
  const [newFolderAllowDownload, setNewFolderAllowDownload] = useState(true);

  // Upload GUI state
  const [uploadTargetFolder, setUploadTargetFolder] = useState<string>(folders[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [uploadedRecentSummary, setUploadedRecentSummary] = useState<string[]>([]);
  
  // Video PowerPoint companion attachment
  const [attachPptxToVideo, setAttachPptxToVideo] = useState(true);

  // Batch Processing & Folder Ingestion state
  const [autoCreateFolders, setAutoCreateFolders] = useState<boolean>(true);
  const [autoTagFromFolders, setAutoTagFromFolders] = useState<boolean>(true);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [batchStats, setBatchStats] = useState<{ totalFiles: number; totalFolders: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const pptxInputRef = useRef<HTMLInputElement>(null);
  const yamlInputRef = useRef<HTMLInputElement>(null);

  // Currently selected item for attaching PPTX
  const [targetVideoForPptx, setTargetVideoForPptx] = useState<MediaItem | null>(null);

  // PHP Guide copy state
  const [copiedPhp, setCopiedPhp] = useState(false);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const isValid = await verifyPassword(passwordInput, config.passwordHash, config.salt);
      if (isValid) {
        onAuthenticate();
        setPasswordInput('');
      } else {
        setAuthError(t.invalidPassword);
      }
    } catch (err) {
      setAuthError('Authentication error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t.passwordMismatch);
      return;
    }

    try {
      const newHash = await hashPassword(newPassword, config.salt);
      onUpdateConfig({
        ...config,
        passwordHash: newHash,
      });
      setPasswordSuccess(t.passwordChanged);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError('Failed to hash and save password.');
    }
  };

  // Folder Operations
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: PdfFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      description: newFolderDesc.trim() || undefined,
      tags: newFolderTags.split(',').map(s => s.trim()).filter(Boolean),
      allowDownload: newFolderAllowDownload,
      visibleInFrontend: true,
      order: folders.length + 1,
    };

    onUpdateFolders([...folders, newFolder]);
    setNewFolderName('');
    setNewFolderDesc('');
    setNewFolderTags('');
    setIsCreatingFolder(false);
  };

  const handleToggleFolderVisibility = (folderId: string) => {
    const updated = folders.map(f =>
      f.id === folderId ? { ...f, visibleInFrontend: !f.visibleInFrontend } : f
    );
    onUpdateFolders(updated);
  };

  const handleToggleFolderDownload = (folderId: string) => {
    const updated = folders.map(f =>
      f.id === folderId ? { ...f, allowDownload: !f.allowDownload } : f
    );
    onUpdateFolders(updated);
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm(t.confirmDeleteFolder)) {
      onUpdateFolders(folders.filter(f => f.id !== folderId));
      onUpdateItems(items.filter(i => i.folderId !== folderId));
    }
  };

  const handleMoveFolder = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= folders.length) return;
    const reordered = [...folders];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;
    reordered.forEach((f, idx) => (f.order = idx + 1));
    onUpdateFolders(reordered);
  };

  // Document & Video Operations
  const handleToggleItemDownload = (itemId: string) => {
    const updated = items.map(i =>
      i.id === itemId ? { ...i, allowDownload: !i.allowDownload } : i
    );
    onUpdateItems(updated);
  };

  const handleToggleItemPptDownload = (itemId: string) => {
    const updated = items.map(i =>
      i.id === itemId ? { ...i, allowPowerpointDownload: !(i.allowPowerpointDownload !== false) } : i
    );
    onUpdateItems(updated);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm(t.confirmDeleteFile)) {
      onUpdateItems(items.filter(i => i.id !== itemId));
    }
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= items.length) return;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;
    reordered.forEach((item, idx) => (item.order = idx + 1));
    onUpdateItems(reordered);
  };

  // Attach separate PPTX to a video item
  const handlePptxFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetVideoForPptx) return;

    const url = URL.createObjectURL(file);
    const updated = items.map(i =>
      i.id === targetVideoForPptx.id
        ? {
            ...i,
            powerpointUrl: url,
            powerpointFileName: file.name,
            powerpointFileSize: file.size,
            allowPowerpointDownload: true,
          }
        : i
    );
    onUpdateItems(updated);
    setTargetVideoForPptx(null);
  };

  // Batch Processing Item Interface
  interface BatchUploadItem {
    file: File;
    relativePath?: string;
    folderName?: string;
    subFolders?: string[];
  }

  // Recursive directory tree extractor for drag-and-drop supporting multiple folders & files simultaneously
  const extractFilesFromDataTransfer = async (dataTransfer: DataTransfer): Promise<BatchUploadItem[]> => {
    const batchList: BatchUploadItem[] = [];

    // 1. Try webkitGetAsEntry (standard directory traversal across modern browsers)
    if (dataTransfer.items && dataTransfer.items.length > 0) {
      const entries: any[] = [];
      for (let i = 0; i < dataTransfer.items.length; i++) {
        const item = dataTransfer.items[i];
        if (item.kind === 'file') {
          const entry = (item as any).webkitGetAsEntry ? (item as any).webkitGetAsEntry() : null;
          if (entry) {
            entries.push(entry);
          }
        }
      }

      if (entries.length > 0) {
        const readAllDirectoryEntries = async (dirReader: any): Promise<any[]> => {
          const allEntries: any[] = [];
          const readChunk = (): Promise<any[]> =>
            new Promise((resolve, reject) => dirReader.readEntries(resolve, reject));

          let batch = await readChunk();
          while (batch && batch.length > 0) {
            allEntries.push(...batch);
            batch = await readChunk();
          }
          return allEntries;
        };

        const traverseEntry = async (entry: any, currentPath = ''): Promise<void> => {
          if (entry.isFile) {
            const file: File = await new Promise((resolve, reject) => entry.file(resolve, reject));
            const fullPath = currentPath ? `${currentPath}/${file.name}` : (file.webkitRelativePath || file.name);
            const parts = fullPath.split('/').filter(Boolean);
            const folderName = parts.length > 1 ? parts[0] : undefined;
            const subFolders = parts.length > 1 ? parts.slice(0, -1) : [];

            batchList.push({
              file,
              relativePath: fullPath,
              folderName,
              subFolders,
            });
          } else if (entry.isDirectory) {
            const nextPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
            const dirReader = entry.createReader();
            const childEntries = await readAllDirectoryEntries(dirReader);
            for (const child of childEntries) {
              await traverseEntry(child, nextPath);
            }
          }
        };

        for (const entry of entries) {
          await traverseEntry(entry);
        }

        if (batchList.length > 0) {
          return batchList;
        }
      }
    }

    // 2. Fallback to dataTransfer.files
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      for (let i = 0; i < dataTransfer.files.length; i++) {
        const file = dataTransfer.files[i];
        const relPath = file.webkitRelativePath || file.name;
        const parts = relPath.split('/').filter(Boolean);
        const folderName = parts.length > 1 ? parts[0] : undefined;
        const subFolders = parts.length > 1 ? parts.slice(0, -1) : [];
        batchList.push({
          file,
          relativePath: relPath,
          folderName,
          subFolders,
        });
      }
    }

    return batchList;
  };

  // Convert FileList from file/folder inputs into batch queue
  const extractFilesFromFileList = (fileList: FileList): BatchUploadItem[] => {
    const batchList: BatchUploadItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const relPath = file.webkitRelativePath || file.name;
      const parts = relPath.split('/').filter(Boolean);
      const folderName = parts.length > 1 ? parts[0] : undefined;
      const subFolders = parts.length > 1 ? parts.slice(0, -1) : [];
      batchList.push({
        file,
        relativePath: relPath,
        folderName,
        subFolders,
      });
    }
    return batchList;
  };

  // Main Batch Processing Ingestion Engine
  const processBatchFiles = async (batchFiles: BatchUploadItem[]) => {
    if (!batchFiles || batchFiles.length === 0) return;

    // Filter out OS artifacts (.DS_Store, Thumbs.db, desktop.ini)
    const validBatch = batchFiles.filter(item => {
      const name = item.file.name;
      return !name.startsWith('.') && name !== 'Thumbs.db' && name !== 'desktop.ini';
    });

    if (validBatch.length === 0) return;

    setIsUploading(true);
    setUploadProgress(5);
    setUploadStatusText('Analyzing dropped hierarchy and container formats...');
    setUploadedRecentSummary([]);

    // Extract unique detected folder names from dragged items
    const rawFolderNames = validBatch
      .map(b => b.folderName)
      .filter((fn): fn is string => Boolean(fn && fn.trim().length > 0));
    const uniqueFolderNames = Array.from(new Set(rawFolderNames));

    setBatchStats({
      totalFiles: validBatch.length,
      totalFolders: uniqueFolderNames.length,
    });

    const workingFolders = [...folders];
    const newlyCreatedFolders: PdfFolder[] = [];
    const folderNameToIdMap = new Map<string, string>();

    // Index existing folders
    workingFolders.forEach(f => {
      folderNameToIdMap.set(f.name.toLowerCase().trim(), f.id);
      folderNameToIdMap.set(f.id, f.id);
    });

    // Auto-create folders if enabled
    if (autoCreateFolders && uniqueFolderNames.length > 0) {
      for (const fName of uniqueFolderNames) {
        const lowerName = fName.toLowerCase().trim();
        if (!folderNameToIdMap.has(lowerName)) {
          const newFolderId = `folder-batch-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
          const createdFolder: PdfFolder = {
            id: newFolderId,
            name: fName,
            description: `Auto-created collection album from batch import of "${fName}".`,
            tags: [fName],
            allowDownload: true,
            visibleInFrontend: true,
            order: workingFolders.length + newlyCreatedFolders.length + 1,
          };
          workingFolders.push(createdFolder);
          newlyCreatedFolders.push(createdFolder);
          folderNameToIdMap.set(lowerName, newFolderId);
        }
      }

      if (newlyCreatedFolders.length > 0) {
        onUpdateFolders(workingFolders);
      }
    }

    const defaultFolderId = uploadTargetFolder || folders[0]?.id || 'folder-arch';
    const newItems: MediaItem[] = [];
    const summaryList: string[] = [];
    const total = validBatch.length;

    for (let i = 0; i < total; i++) {
      const { file, folderName, subFolders } = validBatch[i];
      const detectedType: FileType = detectFileType(file.name, file.type);

      setUploadProgress(Math.round(5 + ((i + 0.3) / total) * 88));
      setUploadStatusText(`Batch item ${i + 1}/${total}: Analyzing ${file.name} (${detectedType.toUpperCase()})...`);

      const buffer = await file.arrayBuffer();

      setUploadProgress(Math.round(5 + ((i + 0.7) / total) * 88));
      setUploadStatusText(`Batch item ${i + 1}/${total}: Extracting EXIF & applying folder tags for ${file.name}...`);

      const extractedExif = extractMultiFormatMetadata(file.name, buffer, detectedType);
      const blob = new Blob([buffer], { type: file.type || 'application/octet-stream' });
      const objectUrl = URL.createObjectURL(blob);

      const title = extractedExif.title || file.name.replace(/\.[^/.]+$/, '');
      const author = extractedExif.author || 'Archive Contributor';
      const thumbnail = generateSvgThumbnail(title, author, detectedType.toUpperCase(), '#292524', detectedType);

      // Determine folder ID for this item
      let assignedFolderId = defaultFolderId;
      let assignedFolderName = workingFolders.find(f => f.id === defaultFolderId)?.name || 'Default Collection';

      if (folderName) {
        const lower = folderName.toLowerCase().trim();
        if (folderNameToIdMap.has(lower)) {
          assignedFolderId = folderNameToIdMap.get(lower)!;
          assignedFolderName = folderName;
        }
      }

      // Auto-tagging logic: Merge EXIF keywords with folder and subfolder names
      const tagSet = new Set<string>();

      if (extractedExif.keywords && extractedExif.keywords.length > 0) {
        extractedExif.keywords.forEach(k => tagSet.add(k));
      } else {
        tagSet.add(detectedType.toUpperCase());
        tagSet.add('Uploaded');
      }

      if (autoTagFromFolders) {
        if (folderName) {
          tagSet.add(folderName);
        }
        if (subFolders && subFolders.length > 0) {
          subFolders.forEach(sf => {
            if (sf.trim()) tagSet.add(sf.trim());
          });
        }
      }

      const finalTags = Array.from(tagSet);

      let pptUrl: string | undefined = undefined;
      let pptName: string | undefined = undefined;
      let pptSize: number | undefined = undefined;

      // If video file and auto-attachment is enabled: generate paired presentation deck
      if (detectedType === 'video' && attachPptxToVideo) {
        const pptBlob = createSamplePowerpointBlob(title);
        pptUrl = URL.createObjectURL(pptBlob);
        pptName = `${file.name.replace(/\.[^/.]+$/, '')}_Presentation_Deck.pptx`;
        pptSize = 12582912;
      }

      const newItem: MediaItem = {
        id: `media-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        name: file.name,
        originalFileName: file.name,
        fileType: detectedType,
        folderId: assignedFolderId,
        tags: finalTags,
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        allowDownload: true,
        url: objectUrl,
        thumbnailUrl: thumbnail,
        exif: {
          ...extractedExif,
          keywords: finalTags,
        },
        order: items.length + newItems.length + 1,
        summary: extractedExif.subject || `${detectedType.toUpperCase()} file uploaded on ${new Date().toLocaleDateString()}. EXIF retained.`,
        powerpointUrl: pptUrl,
        powerpointFileName: pptName,
        powerpointFileSize: pptSize,
        allowPowerpointDownload: true,
      };

      newItems.push(newItem);
      summaryList.push(
        `${file.name} [${detectedType.toUpperCase()}] → Folder: "${assignedFolderName}" · Tags: [${finalTags.join(', ')}] ${
          detectedType === 'video' && pptName ? '· (Paired Presentation Deck attached)' : ''
        }`
      );
    }

    setUploadProgress(100);
    setUploadStatusText(t.uploadComplete);
    setUploadedRecentSummary(summaryList);
    onUpdateItems([...items, ...newItems]);

    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  };

  // Compatibility helper for single FileList
  const processUploadedFiles = async (fileList: FileList) => {
    const batch = extractFilesFromFileList(fileList);
    await processBatchFiles(batch);
  };

  // EXIF Governance Toggle
  const handleToggleExifField = (field: keyof ExifDisplaySettings) => {
    const updatedSettings = {
      ...config.exifSettings,
      [field]: !config.exifSettings[field],
    };
    onUpdateConfig({
      ...config,
      exifSettings: updatedSettings,
    });
  };

  // YAML Export
  const handleExportYaml = () => {
    const yamlString = exportGalleryToYaml(folders, items, config);
    const blob = new Blob([yamlString], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `foliovault-v2-settings-${new Date().toISOString().split('T')[0]}.yaml`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // YAML Import
  const handleImportYaml = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = importGalleryFromYaml(text);
        if (result.folders) onUpdateFolders(result.folders);
        if (result.items) onUpdateItems(result.items as MediaItem[]);
        if (result.settings) {
          onUpdateConfig({ ...config, ...result.settings });
        }
        alert('YAML Configuration successfully imported!');
      } catch (err: any) {
        alert('Error parsing YAML: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Single HTML Export
  const handleExportSingleHtml = () => {
    const htmlBundle = generateSingleHtmlBundle(folders, items, config);
    const blob = new Blob([htmlBundle], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `foliovault-v2-standalone-archive.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyPhpScript = () => {
    navigator.clipboard.writeText(PHP_SCANNER_GUIDE);
    setCopiedPhp(true);
    setTimeout(() => setCopiedPhp(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100">
        
        {/* Modal Top Bar */}
        <div className="h-16 px-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50/80 dark:bg-stone-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md">
              {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-medium text-stone-900 dark:text-stone-100">
                  {isAdmin ? t.adminDashboardTitle : t.adminPortal}
                </h2>
                <span className="text-[10px] bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded font-mono font-semibold">v2.0</span>
              </div>
              <p className="text-xs text-stone-500">
                {isAdmin ? t.adminUnlocked : t.hashEncryptionNote}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        {!isAdmin ? (
          
          /* LOGIN SCREEN */
          <div className="p-8 max-w-md mx-auto my-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <KeyRound className="w-8 h-8 text-stone-700 dark:text-stone-300 mx-auto stroke-[1.5]" />
              <h3 className="text-lg font-serif font-medium text-stone-900 dark:text-stone-100">
                {t.enterPassword}
              </h3>
              <p className="text-xs text-stone-500">
                Encrypted SHA-256 verification. Plaintext passwords are never stored.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-600"
                />
              </div>

              {authError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || !passwordInput}
                className="w-full py-2.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? 'Verifying Hash...' : t.loginButton}
              </button>

              <div className="text-center text-[11px] text-stone-400">
                Default password for demonstration: <span className="font-mono font-medium text-stone-600 dark:text-stone-300">admin123</span>
              </div>
            </form>
          </div>

        ) : (

          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Tabs Navigation */}
            <div className="px-6 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto bg-stone-50/50 dark:bg-stone-950/20 text-xs shrink-0">
              <button
                onClick={() => setActiveTab('folders')}
                className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'folders'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>{t.tabFolders}</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{t.tabUpload}</span>
              </button>

              <button
                onClick={() => setActiveTab('exif')}
                className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'exif'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{t.tabExif}</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'security'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t.tabSecurity}</span>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'export'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{t.tabExport}</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: FOLDERS & ALBUMS MANAGEMENT */}
              {activeTab === 'folders' && (
                <div className="space-y-6">
                  
                  {/* Create New Folder Button / Form */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {t.tabFolders}
                      </h4>
                      <p className="text-xs text-stone-500">
                        Control folder visibility in frontend, download restrictions, and rearrange sequence.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                      className="px-3 py-1.5 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>{t.newFolder}</span>
                    </button>
                  </div>

                  {isCreatingFolder && (
                    <form onSubmit={handleCreateFolder} className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400 block mb-1">
                            {t.folderName} *
                          </label>
                          <input
                            type="text"
                            required
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="e.g. Video Keynotes & Symposia"
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400 block mb-1">
                            {t.folderTags}
                          </label>
                          <input
                            type="text"
                            value={newFolderTags}
                            onChange={(e) => setNewFolderTags(e.target.value)}
                            placeholder="Video, Keynote, Presentations"
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400 block mb-1">
                          {t.folderDescription}
                        </label>
                        <input
                          type="text"
                          value={newFolderDesc}
                          onChange={(e) => setNewFolderDesc(e.target.value)}
                          placeholder="Brief description for gallery users"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newFolderAllowDownload}
                            onChange={(e) => setNewFolderAllowDownload(e.target.checked)}
                            className="rounded"
                          />
                          <span>{t.allowDownloads}</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsCreatingFolder(false)}
                            className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400"
                          >
                            {t.cancel}
                          </button>
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded"
                          >
                            {t.createFolder}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Folders List */}
                  <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden bg-white dark:bg-stone-900">
                    {folders.map((folder, index) => {
                      const count = items.filter(i => i.folderId === folder.id).length;

                      return (
                        <div key={folder.id} className="p-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <button
                                onClick={() => handleMoveFolder(index, 'up')}
                                disabled={index === 0}
                                className="p-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20 cursor-pointer"
                                title={t.moveUp}
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveFolder(index, 'down')}
                                disabled={index === folders.length - 1}
                                className="p-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20 cursor-pointer"
                                title={t.moveDown}
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-medium text-stone-900 dark:text-stone-100 text-xs">
                                  {folder.name}
                                </span>
                                <span className="text-[11px] text-stone-400 tabular-nums">
                                  ({count} {t.itemsCount})
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-500 truncate max-w-sm">
                                {folder.description || 'No description'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              onClick={() => handleToggleFolderVisibility(folder.id)}
                              className={`px-2.5 py-1 text-xs rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
                                folder.visibleInFrontend
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                              }`}
                              title={folder.visibleInFrontend ? t.visibleInFrontend : t.hiddenInFrontend}
                            >
                              {folder.visibleInFrontend ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span className="text-[11px]">{folder.visibleInFrontend ? 'Visible' : 'Hidden'}</span>
                            </button>

                            <button
                              onClick={() => handleToggleFolderDownload(folder.id)}
                              className={`px-2.5 py-1 text-xs rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
                                folder.allowDownload
                                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              }`}
                              title={folder.allowDownload ? t.downloadsEnabled : t.downloadsDisabled}
                            >
                              <Lock className="w-3 h-3" />
                              <span className="text-[11px]">{folder.allowDownload ? 'Download ON' : 'Download OFF'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteFolder(folder.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                              title={t.deleteFolder}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Multi-Format Media Rearrange and PowerPoint link manager */}
                  <div className="pt-4 space-y-3">
                    <h5 className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      Media Ordering & Dual Download Setup ({items.length} items)
                    </h5>

                    <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg max-h-72 overflow-y-auto bg-white dark:bg-stone-900 text-xs">
                      {items.map((item, index) => {
                        const isVideo = item.fileType === 'video';

                        return (
                          <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="flex flex-col shrink-0">
                                <button
                                  onClick={() => handleMoveItem(index, 'up')}
                                  disabled={index === 0}
                                  className="text-stone-400 hover:text-stone-700 disabled:opacity-20"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveItem(index, 'down')}
                                  disabled={index === items.length - 1}
                                  className="text-stone-400 hover:text-stone-700 disabled:opacity-20"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="min-w-0">
                                <div className="font-medium truncate text-stone-800 dark:text-stone-200 flex items-center gap-2">
                                  <span className="font-mono text-[10px] uppercase font-bold text-stone-500 border border-stone-200 dark:border-stone-700 px-1 py-0.2 rounded">
                                    {item.fileType}
                                  </span>
                                  <span className="truncate">{item.exif.title || item.name}</span>
                                </div>
                                <div className="text-[11px] text-stone-400 truncate flex items-center gap-2 mt-0.5">
                                  <span>{item.originalFileName}</span>
                                  {isVideo && (
                                    <>
                                      <span>·</span>
                                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                                        PPT: {item.powerpointFileName || 'No slide deck linked'}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* If video: button to attach/replace PowerPoint presentation */}
                              {isVideo && (
                                <button
                                  onClick={() => {
                                    setTargetVideoForPptx(item);
                                    pptxInputRef.current?.click();
                                  }}
                                  className="text-[11px] px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
                                  title="Attach or replace original PowerPoint slide deck"
                                >
                                  <Presentation className="w-3 h-3" />
                                  <span>{item.powerpointFileName ? 'Change PPT' : '+ PPT Deck'}</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleToggleItemDownload(item.id)}
                                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                  item.allowDownload
                                    ? 'bg-stone-50 border-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                                }`}
                              >
                                {item.allowDownload ? 'Download ON' : 'Download OFF'}
                              </button>

                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Hidden Presentation Input (PPTX, PPT, ODP) */}
                    <input
                      ref={pptxInputRef}
                      type="file"
                      accept=".pptx,.ppt,.odp,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.oasis.opendocument.presentation"
                      onChange={handlePptxFileSelect}
                      className="hidden"
                    />
                  </div>

                </div>
              )}

              {/* TAB 2: UPLOAD GUI (MULTI-FORMAT: PDF, WORD, VIDEO, IMAGES) */}
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t.uploadTitle}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Upload PDF folios, Microsoft Word (.docx), Video recordings (.mp4), and high-resolution images.
                    </p>
                  </div>

                  {/* Target Folder Selector & Video PPT companion option */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-700 dark:text-stone-300 whitespace-nowrap">
                        {t.uploadFolderSelect}:
                      </span>
                      <select
                        value={uploadTargetFolder}
                        onChange={(e) => setUploadTargetFolder(e.target.value)}
                        className="px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs font-medium focus:outline-none"
                      >
                        {folders.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 text-stone-700 dark:text-stone-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attachPptxToVideo}
                        onChange={(e) => setAttachPptxToVideo(e.target.checked)}
                        className="rounded"
                      />
                      <span>Auto-provision PowerPoint slide deck download for video uploads</span>
                    </label>
                  </div>

                  {/* Batch Processing & Auto-Tagging Ingestion Panel */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                        <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {t.batchProcessingTitle}
                        </h5>
                      </div>
                      {batchStats && (
                        <div className="text-[11px] font-mono text-stone-500 bg-white dark:bg-stone-900 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                          {batchStats.totalFiles} {t.batchItemsDetected} ({batchStats.totalFolders} folders)
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="flex items-start gap-2.5 text-stone-700 dark:text-stone-300 cursor-pointer p-2 bg-white dark:bg-stone-900/80 rounded-lg border border-stone-200/80 dark:border-stone-700/80">
                        <input
                          type="checkbox"
                          checked={autoCreateFolders}
                          onChange={(e) => setAutoCreateFolders(e.target.checked)}
                          className="rounded mt-0.5"
                        />
                        <div>
                          <span className="font-medium text-[11px] block text-stone-900 dark:text-stone-100">
                            {t.autoCreateFoldersToggle}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            Detects parent directories and automatically provisions matching albums.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 text-stone-700 dark:text-stone-300 cursor-pointer p-2 bg-white dark:bg-stone-900/80 rounded-lg border border-stone-200/80 dark:border-stone-700/80">
                        <input
                          type="checkbox"
                          checked={autoTagFromFolders}
                          onChange={(e) => setAutoTagFromFolders(e.target.checked)}
                          className="rounded mt-0.5"
                        />
                        <div>
                          <span className="font-medium text-[11px] block text-stone-900 dark:text-stone-100">
                            {t.autoTaggingToggle}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {t.autoTagFolderNotice}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Drag and Drop Box with Multi-Folder Tree Support */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      const batch = await extractFilesFromDataTransfer(e.dataTransfer);
                      if (batch.length > 0) {
                        processBatchFiles(batch);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-8 text-center space-y-4 transition-all duration-200 ${
                      isDraggingOver
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-stone-800 ring-2 ring-stone-900/20'
                        : 'border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 bg-stone-50/50 dark:bg-stone-900/50'
                    }`}
                  >
                    <div className="relative inline-block">
                      <Upload className="w-10 h-10 text-stone-400 mx-auto stroke-[1.2]" />
                      {autoTagFromFolders && (
                        <Tags className="w-4 h-4 text-stone-600 dark:text-stone-300 absolute -bottom-1 -right-1 bg-white dark:bg-stone-900 rounded-full p-0.5 border border-stone-200 dark:border-stone-700" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-medium text-stone-800 dark:text-stone-200">
                        {t.uploadDragDrop}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Drop multiple files or entire folder trees at once. Auto-tags items and creates collection albums.
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        Supported: PDF, DOCX, DOC, ODT, MP4, WEBM, MOV, PPTX, PPT, ODP, JPG, PNG, WEBP, GIF.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{t.uploadSelectFiles}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => folderInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded shadow-xs hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FolderTree className="w-3.5 h-3.5" />
                        <span>{t.uploadSelectFolder}</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="application/pdf,.pdf,video/mp4,.mp4,.webm,.mov,.docx,.doc,.odt,.pptx,.ppt,.odp,image/*,.jpg,.jpeg,.png,.webp,.gif"
                      onChange={(e) => {
                        if (e.target.files) {
                          const batch = extractFilesFromFileList(e.target.files);
                          processBatchFiles(batch);
                          e.target.value = '';
                        }
                      }}
                      className="hidden"
                    />
                    <input
                      ref={folderInputRef}
                      type="file"
                      // @ts-expect-error webkitdirectory is standard for folder upload
                      webkitdirectory=""
                      directory=""
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          const batch = extractFilesFromFileList(e.target.files);
                          processBatchFiles(batch);
                          e.target.value = '';
                        }
                      }}
                      className="hidden"
                    />
                  </div>

                  {/* Upload Progress GUI */}
                  {isUploading && (
                    <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-stone-800 dark:text-stone-200">
                          {t.uploadProgress}
                        </span>
                        <span className="font-mono tabular-nums text-stone-600 dark:text-stone-400">
                          {uploadProgress}%
                        </span>
                      </div>

                      <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-stone-900 dark:bg-stone-100 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-stone-500 font-mono">
                        {uploadStatusText}
                      </div>
                    </div>
                  )}

                  {/* Summary of Parsed EXIF */}
                  {uploadedRecentSummary.length > 0 && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-2 text-xs">
                      <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t.uploadComplete}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono">
                        {uploadedRecentSummary.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: EXIF & METADATA GOVERNANCE */}
              {activeTab === 'exif' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t.exifGovernanceTitle}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      {t.exifGovernanceDesc}
                    </p>
                  </div>

                  <div className="border border-stone-200 dark:border-stone-800 rounded-lg divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
                    {[
                      { key: 'showTitle', label: t.fieldTitle, desc: 'Original title tag from document or video header' },
                      { key: 'showAuthor', label: t.fieldAuthor, desc: 'Author, presenter, and director credits' },
                      { key: 'showSubject', label: t.fieldSubject, desc: 'Abstract, keynote summary, or thesis topic' },
                      { key: 'showKeywords', label: t.fieldKeywords, desc: 'Tags and index terms' },
                      { key: 'showVideoDuration', label: t.fieldVideoDuration, desc: 'Running time for video keynote recordings' },
                      { key: 'showWordCount', label: t.fieldWordCount, desc: 'Word and paragraph count for Word manuscripts' },
                      { key: 'showCreationDate', label: t.fieldCreationDate, desc: 'Original creation date extracted from metadata' },
                      { key: 'showPageCount', label: t.fieldPageCount, desc: 'Page count for PDF folios and Word monographs' },
                      { key: 'showFileSize', label: t.fieldFileSize, desc: 'Precise byte length and megabyte representation' },
                      { key: 'showDimensions', label: t.fieldDimensions, desc: 'Resolution for videos/images and format for folios' },
                    ].map((row) => {
                      const isEnabled = config.exifSettings[row.key as keyof ExifDisplaySettings];

                      return (
                        <div key={row.key} className="p-3.5 flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs font-medium text-stone-900 dark:text-stone-100">
                              {row.label}
                            </div>
                            <div className="text-[11px] text-stone-400">
                              {row.desc}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleExifField(row.key as keyof ExifDisplaySettings)}
                            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                              isEnabled
                                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100'
                                : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            {isEnabled ? t.showInFrontend : t.visibleToAdminOnly}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: SECURITY & ENCRYPTED HASH */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t.changePassword}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      {t.hashEncryptionNote}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                    <div className="font-medium text-stone-700 dark:text-stone-300">
                      Active SHA-256 Encrypted Hash:
                    </div>
                    <code className="text-[11px] font-mono break-all block bg-white dark:bg-stone-900 p-2.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400">
                      {config.passwordHash}
                    </code>
                  </div>

                  <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                    <div>
                      <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
                        {t.newPassword}
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
                        {t.confirmPassword}
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-600"
                      />
                    </div>

                    {passwordError && (
                      <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 rounded text-xs text-red-600">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded text-xs text-emerald-700">
                        {passwordSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {t.savePassword}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: DATABASELESS EXPORT & PHP GUIDE */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t.tabExport}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Portable flat-file schemas, YAML settings management, and standalone zero-dependency exports.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-lg space-y-3">
                      <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        YAML Configuration
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Export or synchronize your entire multi-format catalog into a standard flat <code>settings.yaml</code> file.
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <button
                          onClick={handleExportYaml}
                          className="px-3 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Export YAML</span>
                        </button>

                        <button
                          onClick={() => yamlInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium rounded hover:bg-stone-50 transition-colors cursor-pointer"
                        >
                          Import YAML
                        </button>
                        <input
                          ref={yamlInputRef}
                          type="file"
                          accept=".yaml,.yml"
                          onChange={handleImportYaml}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-lg space-y-3">
                      <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {t.exportSingleHtml}
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {t.exportSingleHtmlDesc}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={handleExportSingleHtml}
                          className="px-3.5 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Generate Single HTML</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {t.phpGuideTitle}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Supported Versions: <strong className="text-stone-700 dark:text-stone-300">PHP 8.1, PHP 8.2, and PHP 8.3+</strong> (Multi-format directory scanner)
                        </div>
                      </div>

                      <button
                        onClick={copyPhpScript}
                        className="px-2.5 py-1 text-xs border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800 hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedPhp ? 'Copied!' : 'Copy Script'}</span>
                      </button>
                    </div>

                    <pre className="p-3 bg-stone-950 rounded border border-stone-800 text-[11px] font-mono text-stone-300 overflow-x-auto max-h-40 whitespace-pre">
                      {PHP_SCANNER_GUIDE}
                    </pre>
                  </div>

                  <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                        {t.resetDemoData}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Restores initial sample state with videos, slide decks, Word docs, images, and folios.
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(t.confirmReset)) {
                          onResetCatalog();
                        }
                      }}
                      className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded bg-red-50 dark:bg-red-950/20 hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t.resetDemoData}</span>
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
};
