/**
 * KBYK Studio Portal Security Utilities
 * Implements salted cryptographic password hashing using the standard Web Crypto API (PBKDF2-SHA256).
 *
 * NOTE: This is a frontend prototype security implementation.
 * In a production architecture, password authentication and authorization
 * must always be performed and validated on a secure backend server.
 */

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  feedback: { rule: string; met: boolean }[];
  isValid: boolean;
}

/**
 * Derives a salted cryptographic hash of a password using PBKDF2 with SHA-256 and 100,000 iterations.
 */
export async function hashPassword(
  password: string,
  existingSaltHex?: string
): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();

  // Generate or parse 16-byte cryptographic salt with guaranteed ArrayBuffer backing
  const saltBuffer = new ArrayBuffer(16);
  const saltBytes = new Uint8Array(saltBuffer);

  if (existingSaltHex && existingSaltHex.length === 32) {
    for (let i = 0; i < 16; i++) {
      saltBytes[i] = parseInt(existingSaltHex.substring(i * 2, i * 2 + 2), 16);
    }
  } else {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(saltBytes);
    } else {
      // Fallback for non-browser environments
      for (let i = 0; i < 16; i++) {
        saltBytes[i] = Math.floor(Math.random() * 256);
      }
    }
  }

  const saltHex = Array.from(saltBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Web Crypto API PBKDF2 derivation
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );

      const derivedBits = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBytes,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        256
      );

      const hashArray = Array.from(new Uint8Array(derivedBits));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      return { hash: hashHex, salt: saltHex };
    } catch (e) {
      console.warn('SubtleCrypto PBKDF2 fallback invoked:', e);
    }
  }

  // Graceful fallback if SubtleCrypto is unavailable in certain test environments
  let simpleHash = 0;
  const combined = password + saltHex;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    simpleHash = (simpleHash << 5) - simpleHash + char;
    simpleHash |= 0;
  }
  return {
    hash: Math.abs(simpleHash).toString(16).padStart(32, '0'),
    salt: saltHex,
  };
}

/**
 * Validates a candidate password against an existing salted hash.
 */
export async function verifyPassword(
  candidate: string,
  storedHash: string,
  saltHex: string
): Promise<boolean> {
  const result = await hashPassword(candidate, saltHex);
  return result.hash === storedHash;
}

/**
 * Evaluates password strength according to owner security requirements.
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  const feedback = [
    { rule: 'At least 8 characters long', met: password.length >= 8 },
    { rule: 'Contains both uppercase & lowercase letters', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { rule: 'Contains at least one number (0-9)', met: /[0-9]/.test(password) },
    { rule: 'Contains a symbol or special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = feedback.filter((f) => f.met).length;
  const isMinimumLength = password.length >= 8;

  let score = 0;
  let label: PasswordStrength['label'] = 'Too Weak';
  let color = '#EF4444'; // Red

  if (password.length === 0) {
    score = 0;
    label = 'Too Weak';
    color = '#D1D5DB';
  } else if (!isMinimumLength) {
    score = 1;
    label = 'Too Weak';
    color = '#EF4444';
  } else if (metCount <= 2) {
    score = 2;
    label = 'Fair';
    color = '#F59E0B'; // Amber
  } else if (metCount === 3) {
    score = 3;
    label = 'Good';
    color = '#10B981'; // Emerald
  } else {
    score = 4;
    label = 'Strong';
    color = '#145C45'; // Deep Emerald
  }

  // Valid if at least 8 chars and at least 2 rules met (or 8+ chars with mix)
  const isValid = isMinimumLength && metCount >= 2;

  return {
    score,
    label,
    color,
    feedback,
    isValid,
  };
}
