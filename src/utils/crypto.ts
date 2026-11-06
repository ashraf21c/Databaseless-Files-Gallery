/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Default standard SHA-256 hash for 'admin123' (produced by standard tools like feutex.com, sha256sum, PHP hash('sha256', 'admin123'))
export const DEFAULT_ADMIN_PASSWORD_PLAIN = 'admin123';
export const DEFAULT_ADMIN_HASH_HEX = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
export const DEFAULT_ADMIN_HASH_BASE64 = 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=';
export const LEGACY_SALTED_HASH = '8b7fca13f738b55695ef2aeef33b0cfbc92bc4aa4dd38aa4d693be7bf7bfaafc';
export const DEFAULT_SALT = 'foliovault_salt_2026';

/**
 * Computes standard SHA-256 hash of a string.
 * Returns lowercase hexadecimal string by default, or base64 if format === 'base64'.
 */
export async function computeSha256(input: string, format: 'hex' | 'base64' = 'hex'): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const uint8 = new Uint8Array(hashBuffer);

  if (format === 'base64') {
    let binary = '';
    for (let i = 0; i < uint8.byteLength; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary);
  }

  return Array.from(uint8).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Converts a 64-character hex SHA-256 string to Base64 format.
 */
export function hexToBase64(hex: string): string {
  try {
    const cleanHex = hex.trim().toLowerCase();
    if (cleanHex.length !== 64) return '';
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
    }
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return '';
  }
}

/**
 * Converts a 44-character Base64 SHA-256 string to lowercase hex format.
 */
export function base64ToHex(b64: string): string {
  try {
    const binary = atob(b64.trim());
    if (binary.length !== 32) return '';
    const hexParts: string[] = [];
    for (let i = 0; i < binary.length; i++) {
      hexParts.push(binary.charCodeAt(i).toString(16).padStart(2, '0'));
    }
    return hexParts.join('');
  } catch {
    return '';
  }
}

/**
 * Computes standard SHA-256 hash of a plaintext password.
 * Standard unsalted hash matches online converters (feutex.com, sha256sum, CyberChef).
 */
export async function hashPassword(password: string, _salt?: string): Promise<string> {
  return computeSha256(password, 'hex');
}

/**
 * Compares an input with the stored encrypted hash.
 * Fully supports:
 * 1. Plaintext password (hashes input with standard SHA-256 and compares)
 * 2. Directly pasted SHA-256 Hex hash (e.g. from feutex.com)
 * 3. Directly pasted SHA-256 Base64 hash (e.g. from feutex.com)
 * 4. Stored hashes in Hex or Base64
 * 5. Legacy salted hashes for backward compatibility
 */
export async function verifyPassword(
  input: string,
  storedHash: string,
  salt?: string
): Promise<boolean> {
  if (!input || !storedHash) return false;

  const cleanInput = input.trim();
  const cleanStored = storedHash.trim();

  // Normalize stored hash to lowercase hex
  let storedHex = cleanStored.toLowerCase();
  if (cleanStored.length === 44 && cleanStored.endsWith('=')) {
    const converted = base64ToHex(cleanStored);
    if (converted) storedHex = converted;
  }

  // Check 1: User pasted the SHA-256 Hex hash directly into the password field
  if (cleanInput.toLowerCase() === storedHex) {
    return true;
  }

  // Check 2: User pasted the SHA-256 Base64 hash directly into the password field
  if (cleanInput.length === 44 && cleanInput.endsWith('=')) {
    const inputHex = base64ToHex(cleanInput);
    if (inputHex && inputHex === storedHex) {
      return true;
    }
  }

  // Check 3: Standard unsalted SHA-256 hash of input (Hex & Base64)
  const inputHex = await computeSha256(cleanInput, 'hex');
  if (inputHex.toLowerCase() === storedHex) {
    return true;
  }

  const inputBase64 = await computeSha256(cleanInput, 'base64');
  if (inputBase64 === cleanStored) {
    return true;
  }

  // Check 4: Check if stored hash is the legacy placeholder hash and input is admin123 or its hash
  if (storedHex === LEGACY_SALTED_HASH.toLowerCase()) {
    if (
      cleanInput === 'admin123' ||
      cleanInput.toLowerCase() === DEFAULT_ADMIN_HASH_HEX ||
      cleanInput === DEFAULT_ADMIN_HASH_BASE64
    ) {
      return true;
    }
  }

  // Check 5: Salted hash fallback (if salt provided)
  if (salt) {
    const enc = new TextEncoder();
    const data = enc.encode(`${salt}:${cleanInput}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const saltedHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    if (saltedHex.toLowerCase() === storedHex) {
      return true;
    }
  }

  // Check 6: Legacy salt fallback with DEFAULT_SALT
  const enc = new TextEncoder();
  const legacyData = enc.encode(`${DEFAULT_SALT}:${cleanInput}`);
  const legacyBuffer = await crypto.subtle.digest('SHA-256', legacyData);
  const legacyHex = Array.from(new Uint8Array(legacyBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (legacyHex.toLowerCase() === storedHex) {
    return true;
  }

  return false;
}
