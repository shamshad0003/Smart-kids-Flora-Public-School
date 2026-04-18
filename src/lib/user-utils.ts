import { randomBytes } from'crypto';

/**
 * Generates a secure random temporary password.
 * Format: 8 characters, alphanumeric.
 */
export function generateTempPassword(): string {
  // Generate 6 random bytes (48 bits)
  // Converting to base64 gives a string longer than 8 chars, we slice it
  return randomBytes(6).toString('base64').replace(/[/+=]/g, 'X').slice(0, 8);
}
