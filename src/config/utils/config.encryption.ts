import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Initialization vector length for GCM
const KEY_LENGTH = 32; // 256 bits for AES-256

/**
 * Utility class for encrypting/decrypting sensitive configuration values
 */
export class ConfigEncryptionUtil {
  /**
   * Encrypts a sensitive value using AES-256-GCM
   * @param value - The value to encrypt
   * @param secretKey - The encryption key (must be 32 bytes for AES-256)
   * @returns Encrypted value as base64 string
   */
  static encrypt(value: string, secretKey: string): string {
    if (!secretKey || secretKey.length !== 32) {
      throw new Error('Encryption key must be exactly 32 characters for AES-256');
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secretKey, 'utf8'), iv);

    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine IV, auth tag, and encrypted data
    const encryptedData = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;

    return Buffer.from(encryptedData).toString('base64');
  }

  /**
   * Decrypts an encrypted value using AES-256-GCM
   * @param encryptedValue - The encrypted value as base64 string
   * @param secretKey - The decryption key (must be 32 bytes for AES-256)
   * @returns Decrypted value
   */
  static decrypt(encryptedValue: string, secretKey: string): string {
    if (!secretKey || secretKey.length !== 32) {
      throw new Error('Encryption key must be exactly 32 characters for AES-256');
    }

    const decoded = Buffer.from(encryptedValue, 'base64').toString('utf8');
    const [ivHex, authTagHex, encryptedData] = decoded.split(':');

    if (!ivHex || !authTagHex || !encryptedData) {
      throw new Error('Invalid encrypted value format');
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(secretKey, 'utf8'), Buffer.from(ivHex, 'hex'));

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Checks if a value is encrypted (base64 encoded with our format)
   * @param value - The value to check
   * @returns True if the value appears to be encrypted
   */
  static isEncrypted(value: string): boolean {
    try {
      if (!value || typeof value !== 'string') {
        return false;
      }

      // Check if it's a valid base64
      const buffer = Buffer.from(value, 'base64');
      if (buffer.toString('base64') !== value) {
        return false;
      }

      // Check if it has our IV:AUTH_TAG:ENCRYPTED_DATA format after decoding
      const decoded = buffer.toString('utf8');
      const parts = decoded.split(':');

      return (
        parts.length === 3 &&
        parts[0].length === IV_LENGTH * 2 && // IV hex length
        parts[1].length === 32 && // Auth tag hex length (16 bytes)
        parts[2].length > 0
      ); // Encrypted data exists
    } catch (error) {
      return false;
    }
  }

  /**
   * Conditionally encrypts a value if it's not already encrypted
   * @param value - The value to encrypt
   * @param secretKey - The encryption key
   * @returns Encrypted value or original if already encrypted
   */
  static maybeEncrypt(value: string, secretKey: string): string {
    if (!value || ConfigEncryptionUtil.isEncrypted(value)) {
      return value;
    }

    return ConfigEncryptionUtil.encrypt(value, secretKey);
  }

  /**
   * Conditionally decrypts a value if it's encrypted
   * @param value - The value to decrypt
   * @param secretKey - The decryption key
   * @returns Decrypted value or original if not encrypted
   */
  static maybeDecrypt(value: string, secretKey: string): string {
    if (!value || !ConfigEncryptionUtil.isEncrypted(value)) {
      return value;
    }

    return ConfigEncryptionUtil.decrypt(value, secretKey);
  }
}
