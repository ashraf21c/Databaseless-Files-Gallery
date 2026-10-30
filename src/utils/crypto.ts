/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Default password hash for 'admin123' with empty or simple salt
export const DEFAULT_SALT = 'foliovault_salt_2026';

/**
 * Computes a SHA-256 cryptographic hash of a plaintext password with a salt.
 */
export async function hashPassword(password: string, salt: string = DEFAULT_SALT): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compares an input plaintext password with the stored encrypted hash.
 */
export async function verifyPassword(password: string, storedHash: string, salt: string = DEFAULT_SALT): Promise<boolean> {
  const computedHash = await hashPassword(password, salt);
  return computedHash.toLowerCase() === storedHash.toLowerCase();
}
