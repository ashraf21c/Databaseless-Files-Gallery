# FolioVault — Databaseless Central Media & Document Gallery

FolioVault is a portable, high-performance, databaseless media and document library supporting both **v1.0 (PDF-Only Folios)** and **v2.0 (Multi-Format Video, Word, Images, and Folios)** profiles.

It requires **no SQL database, no server daemon, and no complex backend dependencies**. All documents, albums, metadata governance, and security configurations are maintained in portable flat-files (`settings.yaml`), standalone zero-dependency HTML bundles, or client-side storage.

---

## 1. Admin Portal Default Credentials

Access the administration dashboard by clicking the **Admin** button (gear icon) in the header bar.

| Parameter | Default Value | Notes |
| :--- | :--- | :--- |
| **Username** | *None required* | Direct password-protected master gateway |
| **Default Password** | `admin123` | Can be entered in plaintext or as a SHA-256 hash |
| **Hash Standard** | **SHA-256** (Unsalted) | Standard RFC 6234 compliant |
| **Hex Hash (64 chars)** | `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9` | Standard format |
| **Base64 Hash (44 chars)**| `JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=` | Interchangeable with Hex |

> **Note on Security:** For security reasons, neither the plaintext password nor the cryptographic hash are displayed on the login modal. Both the plain password (`admin123`) and its SHA-256 hash are accepted in the login password field.

---

## 2. Changing the Password Without Logging In (FTP & Offline Recovery)

If you are locked out or need to update the administrator password without using the web UI, you can edit the configuration files directly on your web server via **FTP, SFTP, cPanel File Manager, or SSH**.

Depending on how your catalog is deployed, choose the relevant file below:

### Option A: Editing `settings.yaml` (Recommended for static/flat-file deployments)

If you deployed FolioVault using the YAML flat-file configuration:

1. Connect to your web server using an FTP client (e.g. FileZilla, WinSCP, Cyberduck).
2. Locate and download the `settings.yaml` file from your web root.
3. Open `settings.yaml` in any text editor and find the `settings:` section:
   ```yaml
   settings:
     passwordHash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
     showRssWidget: true
   ```
4. Replace the value of `passwordHash` with your newly generated SHA-256 hash (in Hex or Base64 format). For example:
   ```yaml
   settings:
     passwordHash: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
   ```
5. Save the file and upload it back via FTP, overwriting the old `settings.yaml`.

---

### Option B: Editing `src/utils/sampleData.ts` (For Source / Node.js Deployments)

If you are running the project from source or building with Vite:

1. Open `/src/utils/sampleData.ts` via FTP, SSH, or your local code editor.
2. Locate the `INITIAL_ADMIN_CONFIG` object:
   ```typescript
   export const INITIAL_ADMIN_CONFIG: AdminConfig = {
     passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
     // ... other configuration fields
   };
   ```
3. Replace the `passwordHash` string with your new SHA-256 hash.
4. Save the file and run `npm run build` to compile the production bundle.

---

### Option C: Editing Standalone HTML Bundles (`bundle_v1.html` or `bundle_v2.html`)

If you are hosting a standalone zero-dependency single-file HTML bundle:

1. Download the `.html` file from your FTP server.
2. Open the file in a text editor (e.g. VS Code, Sublime Text, or Notepad++).
3. Search for the text `passwordHash` inside the embedded `<script>` tag:
   ```javascript
   "config": {
     "passwordHash": "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
     ...
   }
   ```
4. Replace the 64-character hash string with your new SHA-256 hash.
5. Save and upload the modified HTML file to your server.

---

### Important: Clearing Browser Cache / LocalStorage

FolioVault automatically caches your admin settings in your browser's `localStorage` under the key `mediacatalog_admin_config`.

After updating the password via FTP:
- Clear your browser's cached site data for the website, **OR**
- Open the site in an **Incognito / Private Window** to ensure the browser loads the new server configuration immediately.

---

## 3. How to Generate a SHA-256 Password Hash

FolioVault uses standard, unsalted SHA-256 hashing. You can generate a compatible hash using any of the following methods:

### Method 1: Online Converter
1. Visit **[feutex.com Online Hash Converter](https://feutex.com/tools/online-hash-converter.html)**
2. Enter your desired new password into the text box.
3. Select **SHA-256** as the algorithm.
4. Copy either the **Hexadecimal** (64 hex characters) or **Base64** (44 characters) hash output. Both formats are fully supported.

---

### Method 2: Linux / macOS Terminal (Bash / Zsh)
Run the following command in your terminal (replace `YourNewPasswordHere` with your password):

```bash
# Linux (GNU coreutils)
echo -n "YourNewPasswordHere" | sha256sum

# macOS (BSD)
echo -n "YourNewPasswordHere" | shasum -a 256
```

---

### Method 3: Windows PowerShell
Run the following one-line command in PowerShell:

```powershell
[System.BitConverter]::ToString([System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes("YourNewPasswordHere"))).Replace("-","").ToLower()
```

---

### Method 4: PHP (Command-Line or Script)
```bash
php -r 'echo hash("sha256", "YourNewPasswordHere") . PHP_EOL;'
```

---

### Method 5: Node.js
```bash
node -e 'console.log(require("crypto").createHash("sha256").update("YourNewPasswordHere").digest("hex"))'
```

---

## 4. Changing the Password from the Web UI

If you are already logged in:
1. Open the **Admin Modal** (gear icon in the top header).
2. Enter your current password (`admin123`).
3. Click on the **Security** tab.
4. Enter your new password in the **New Password** and **Confirm Password** fields.
5. Click **Save New Password**.
6. Go to the **Export & Portability** tab and click **Export v2 YAML (settings.yaml)** or **Export Standalone HTML (v2.0)** to download your updated configuration files for FTP upload.

---

## 5. Summary of Key Features

- **Databaseless Architecture**: Zero database setup required. Runs on any static host, Apache/Nginx web space, or shared hosting.
- **Multilingual Support**: 100% UI localization in English, Arabic (`ar` with native RTL layout), and Japanese (`ja`).
- **Batch Processing & Ingestion**: Drag-and-drop multiple folders and files simultaneously with automated folder provisioning and tag generation.
- **Media RSS 2.0 (`recently_added.rss`)**: Generates an XML feed with Media RSS (`mrss`) enclosures and thumbnails for the 10 latest additions.
- **RSS Widget**: Front-end interactive carousel showing recent additions, toggleable directly from the admin panel.
- **Multi-Format Support**: High-fidelity viewers for PDF folios, Word manuscripts (`.docx`), MP4 video keynotes (with companion PowerPoint deck downloads), and high-resolution images.
- **Accessibility**: Full WCAG 2.1 AA compliance with high-contrast ratios, focus rings, keyboard navigation, and screen reader announcements.
