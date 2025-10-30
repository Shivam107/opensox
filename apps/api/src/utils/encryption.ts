import crypto from "crypto";

/**
 * Encryption utility for sensitive OAuth tokens
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // For AES, this is always 16
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Get encryption key from environment variable
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY environment variable is not set. This is required for token encryption."
    );
  }

  // Derive a consistent key from the secret using PBKDF2
  const salt = crypto
    .createHash("sha256")
    .update("opensox-token-encryption-salt")
    .digest();
  return crypto.pbkdf2Sync(key, salt, 100000, KEY_LENGTH, "sha256");
}

/**
 * Encrypt a string value
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 */
export function encrypt(text: string | null | undefined): string | null {
  if (!text) return null;

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt token");
  }
}

/**
 * Decrypt an encrypted string
 * @param encryptedText - Encrypted string in format: iv:authTag:encrypted
 * @returns Decrypted plain text
 */
export function decrypt(
  encryptedText: string | null | undefined
): string | null {
  if (!encryptedText) return null;

  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(":");

    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      throw new Error("Invalid encrypted text format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt token");
  }
}

/**
 * Encrypt OAuth tokens in an Account object
 */
export function encryptAccountTokens(data: any): any {
  if (!data) return data;

  return {
    ...data,
    refresh_token: data.refresh_token ? encrypt(data.refresh_token) : null,
    access_token: data.access_token ? encrypt(data.access_token) : null,
    id_token: data.id_token ? encrypt(data.id_token) : null,
  };
}

/**
 * Decrypt OAuth tokens in an Account object
 */
export function decryptAccountTokens(data: any): any {
  if (!data) return data;

  return {
    ...data,
    refresh_token: data.refresh_token ? decrypt(data.refresh_token) : null,
    access_token: data.access_token ? decrypt(data.access_token) : null,
    id_token: data.id_token ? decrypt(data.id_token) : null,
  };
}
