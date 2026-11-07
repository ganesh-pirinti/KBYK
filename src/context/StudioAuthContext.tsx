import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { hashPassword, verifyPassword, evaluatePasswordStrength } from '../utils/security';

interface AuthStorageData {
  hash: string;
  salt: string;
  createdAt: string;
  lastChangedAt?: string;
  timeoutMinutes?: number;
}

interface StudioAuthContextType {
  isSetup: boolean;
  isUnlocked: boolean;
  isLoading: boolean;
  inactivityTimeoutMinutes: number;
  lastActivity: number;
  setupPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  unlockPortal: (password: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  lockPortal: () => void;
  setInactivityTimeoutMinutes: (minutes: number) => void;
  resetDemoAuth: () => void;
}

const AUTH_STORAGE_KEY = 'kbyk_studio_auth_v1';
const SESSION_UNLOCKED_KEY = 'kbyk_studio_session_unlocked';
const LAST_ACTIVITY_KEY = 'kbyk_studio_last_activity';

const StudioAuthContext = createContext<StudioAuthContextType | undefined>(undefined);

export const StudioAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSetup, setIsSetup] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return !!stored;
    } catch {
      return false;
    }
  });

  const [inactivityTimeoutMinutes, setInactivityTimeoutState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthStorageData = JSON.parse(stored);
        return parsed.timeoutMinutes ?? 15;
      }
    } catch {
      // ignore
    }
    return 15;
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const sessionUnlocked = sessionStorage.getItem(SESSION_UNLOCKED_KEY) === 'true';
      const lastActive = parseInt(sessionStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
      if (sessionUnlocked && lastActive > 0) {
        const diffMinutes = (Date.now() - lastActive) / (1000 * 60);
        if (diffMinutes < 15) {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Inactivity watchdog
  const lockPortal = useCallback(() => {
    setIsUnlocked(false);
    try {
      sessionStorage.removeItem(SESSION_UNLOCKED_KEY);
      sessionStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch {
      // ignore
    }
  }, []);

  const updateActivity = useCallback(() => {
    if (isUnlocked) {
      const now = Date.now();
      setLastActivity(now);
      try {
        sessionStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
      } catch {
        // ignore
      }
    }
  }, [isUnlocked]);

  // Listen to user interaction to reset inactivity timer when portal is unlocked
  useEffect(() => {
    if (!isUnlocked) return;

    const handleUserAction = () => {
      updateActivity();
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, handleUserAction, { passive: true }));

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserAction));
    };
  }, [isUnlocked, updateActivity]);

  // Periodic inactivity check
  useEffect(() => {
    if (!isUnlocked || inactivityTimeoutMinutes <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diffMinutes = (now - lastActivity) / (1000 * 60);
      if (diffMinutes >= inactivityTimeoutMinutes) {
        lockPortal();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isUnlocked, lastActivity, inactivityTimeoutMinutes, lockPortal]);

  const setInactivityTimeoutMinutes = (minutes: number) => {
    setInactivityTimeoutState(minutes);
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthStorageData = JSON.parse(stored);
        parsed.timeoutMinutes = minutes;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  /**
   * First-time setup: generates random salt and PBKDF2 hash, saving to localStorage.
   */
  const setupPassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const strength = evaluatePasswordStrength(password);
      if (!strength.isValid) {
        return {
          success: false,
          error: 'Password does not meet the minimum security requirements (at least 8 characters with a mix of letters, numbers, or symbols).',
        };
      }

      // Compute PBKDF2 hash
      const { hash, salt } = await hashPassword(password);
      const data: AuthStorageData = {
        hash,
        salt,
        createdAt: new Date().toISOString(),
        timeoutMinutes: inactivityTimeoutMinutes,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
      setIsSetup(true);

      // Unlock for current session
      setIsUnlocked(true);
      const now = Date.now();
      setLastActivity(now);
      sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true');
      sessionStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to setup password.' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify password to unlock the portal.
   */
  const unlockPortal = async (password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Artificial verification micro-delay (450ms) for realistic UX feedback
      await new Promise((r) => setTimeout(r, 450));

      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) {
        return { success: false, error: 'No password has been configured yet. Please complete initial setup.' };
      }

      const { hash, salt }: AuthStorageData = JSON.parse(stored);
      const isMatch = await verifyPassword(password, hash, salt);

      if (!isMatch) {
        return { success: false, error: 'Incorrect password. Please verify and try again.' };
      }

      setIsUnlocked(true);
      const now = Date.now();
      setLastActivity(now);
      sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true');
      sessionStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Authentication error.' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Change existing password.
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Artificial verification delay
      await new Promise((r) => setTimeout(r, 400));

      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) {
        return { success: false, error: 'Security profile not found.' };
      }

      const { hash, salt }: AuthStorageData = JSON.parse(stored);
      const isCurrentValid = await verifyPassword(currentPassword, hash, salt);

      if (!isCurrentValid) {
        return { success: false, error: 'Current password does not match records.' };
      }

      if (currentPassword === newPassword) {
        return { success: false, error: 'New password cannot be identical to your current password.' };
      }

      const strength = evaluatePasswordStrength(newPassword);
      if (!strength.isValid) {
        return {
          success: false,
          error: 'New password does not meet the minimum security strength standards.',
        };
      }

      // Generate a fresh random salt and derive new PBKDF2 hash
      const { hash: newHash, salt: newSalt } = await hashPassword(newPassword);
      const updatedData: AuthStorageData = {
        hash: newHash,
        salt: newSalt,
        createdAt: JSON.parse(stored).createdAt || new Date().toISOString(),
        lastChangedAt: new Date().toISOString(),
        timeoutMinutes: inactivityTimeoutMinutes,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedData));
      updateActivity();

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Password update failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset helper for demo/test purposes to return to first-time setup state.
   */
  const resetDemoAuth = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_UNLOCKED_KEY);
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
    setIsSetup(false);
    setIsUnlocked(false);
  };

  return (
    <StudioAuthContext.Provider
      value={{
        isSetup,
        isUnlocked,
        isLoading,
        inactivityTimeoutMinutes,
        lastActivity,
        setupPassword,
        unlockPortal,
        changePassword,
        lockPortal,
        setInactivityTimeoutMinutes,
        resetDemoAuth,
      }}
    >
      {children}
    </StudioAuthContext.Provider>
  );
};

export const useStudioAuth = (): StudioAuthContextType => {
  const context = useContext(StudioAuthContext);
  if (!context) {
    throw new Error('useStudioAuth must be used within a StudioAuthProvider');
  }
  return context;
};
