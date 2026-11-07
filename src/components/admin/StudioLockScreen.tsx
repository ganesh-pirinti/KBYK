import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { useStudioAuth } from '../../context/StudioAuthContext';
import { evaluatePasswordStrength } from '../../utils/security';

interface StudioLockScreenProps {
  onBackToStorefront: () => void;
}

export const StudioLockScreen: React.FC<StudioLockScreenProps> = ({ onBackToStorefront }) => {
  const { isSetup, setupPassword, unlockPortal, isLoading } = useStudioAuth();

  // Common unlock form state
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [shakeUnlock, setShakeUnlock] = useState(false);

  // Setup form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [setupError, setSetupError] = useState('');

  // Password strength for setup
  const strength = evaluatePasswordStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Handle Unlock
  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');

    if (!unlockPassword.trim()) {
      setUnlockError('Please enter your studio password.');
      setShakeUnlock(true);
      setTimeout(() => setShakeUnlock(false), 500);
      return;
    }

    const res = await unlockPortal(unlockPassword);
    if (!res.success) {
      setUnlockError(res.error || 'Incorrect password. Access denied.');
      setShakeUnlock(true);
      setTimeout(() => setShakeUnlock(false), 500);
    }
  };

  // Handle Setup
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    if (!newPassword) {
      setSetupError('Please choose a password to secure your studio.');
      return;
    }

    if (!strength.isValid) {
      setSetupError('Password must be at least 8 characters and include a mix of character types.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSetupError('The two passwords do not match. Please re-enter carefully.');
      return;
    }

    const res = await setupPassword(newPassword);
    if (!res.success) {
      setSetupError(res.error || 'Failed to initialize password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF9] flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Decorative luxury background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#F7E6EB]/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E8B5C3]/40 blur-3xl pointer-events-none" />

      {/* Top Header / Storefront Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10">
        <button
          onClick={onBackToStorefront}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#77716F] hover:text-[#145C45] transition-colors py-2 px-3 rounded-full hover:bg-white/80"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>

        <span className="text-[11px] font-medium text-[#77716F] bg-white px-3 py-1 rounded-full border border-[#F7E6EB] shadow-2xs">
          Studio Access Control
        </span>
      </div>

      {/* Main Card Container */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F7E6EB] shadow-xl space-y-6">

          {/* ============================================================== */}
          {/* 1. UNLOCK SCREEN (Subsequent Visits)                            */}
          {/* ============================================================== */}
          {isSetup ? (
            <div className="space-y-6">
              
              {/* Lock Badge & Branding */}
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-[#F7E6EB] border border-[#E8B5C3] flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8 text-[#145C45]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#145C45] flex items-center justify-center text-white text-[10px] shadow-sm">
                    <KeyRound className="w-3 h-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest font-bold text-[#145C45]">
                    KBYK Owner Workspace
                  </span>
                  <h1 className="font-serif text-3xl text-[#292626] font-medium">
                    Welcome Back
                  </h1>
                  <p className="text-xs text-[#77716F] max-w-xs mx-auto">
                    Enter your Studio Portal password to continue.
                  </p>
                </div>
              </div>

              {/* Error Alert */}
              {unlockError && (
                <div
                  className={`p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 transition-all ${
                    shakeUnlock ? 'animate-shake' : ''
                  }`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{unlockError}</span>
                </div>
              )}

              {/* Unlock Form */}
              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#292626]">
                    <label htmlFor="portal-password">Studio Password</label>
                    <span className="text-[11px] text-[#77716F]">Encrypted local session</span>
                  </div>

                  <div className="relative">
                    <input
                      id="portal-password"
                      type={showUnlockPassword ? 'text' : 'password'}
                      value={unlockPassword}
                      onChange={(e) => {
                        setUnlockPassword(e.target.value);
                        if (unlockError) setUnlockError('');
                      }}
                      placeholder="••••••••••••"
                      autoFocus
                      disabled={isLoading}
                      className="w-full px-4 py-3.5 pr-11 rounded-2xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45] focus:ring-2 focus:ring-[#145C45]/15 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77716F] hover:text-[#292626] p-1"
                      aria-label={showUnlockPassword ? 'Hide password' : 'Show password'}
                    >
                      {showUnlockPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Unlock Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#145C45] hover:bg-[#0F4534] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-emerald-200" />
                      <span>Unlock Studio Portal</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ============================================================== */
            /* 2. FIRST-TIME SETUP SCREEN                                     */
            /* ============================================================== */
            <div className="space-y-6">
              
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#F7E6EB] border border-[#E8B5C3] flex items-center justify-center mx-auto text-[#145C45]">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#145C45] bg-[#F7E6EB] px-2.5 py-0.5 rounded-full inline-block">
                    First-Time Setup
                  </span>
                  <h1 className="font-serif text-3xl text-[#292626] font-medium">
                    Secure Your Studio
                  </h1>
                  <p className="text-xs text-[#77716F] max-w-xs mx-auto">
                    Create a private password to protect your KBYK workspace.
                  </p>
                </div>
              </div>

              {/* Error Alert */}
              {setupError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{setupError}</span>
                </div>
              )}

              {/* Setup Form */}
              <form onSubmit={handleSetupSubmit} className="space-y-4">
                
                {/* Create Password */}
                <div className="space-y-1.5">
                  <label htmlFor="create-password" className="text-xs font-semibold text-[#292626] block">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      id="create-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-11 rounded-2xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45] focus:ring-2 focus:ring-[#145C45]/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77716F] hover:text-[#292626] p-1"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#77716F]">Strength:</span>
                        <span className="font-semibold" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className="rounded-full transition-all duration-300"
                            style={{
                              backgroundColor:
                                bar <= strength.score ? strength.color : '#E5E7EB',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirm-password" className="text-xs font-semibold text-[#292626] block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 pr-11 rounded-2xl bg-[#FCFAF9] border text-sm text-[#292626] focus:outline-none focus:ring-2 focus:ring-[#145C45]/15 transition-all ${
                        confirmPassword && !passwordsMatch
                          ? 'border-red-400 focus:border-red-500'
                          : confirmPassword && passwordsMatch
                          ? 'border-emerald-500 focus:border-emerald-600'
                          : 'border-[#E8B5C3] focus:border-[#145C45]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77716F] hover:text-[#292626] p-1"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {confirmPassword && (
                    <div className="text-[11px] flex items-center gap-1.5 pt-0.5">
                      {passwordsMatch ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Validation Checklist */}
                <div className="p-3 bg-[#FCFAF9] rounded-2xl border border-[#F7E6EB] space-y-1.5 text-[11px] text-[#77716F]">
                  <span className="font-semibold text-[#292626] block mb-1">
                    Password requirements:
                  </span>
                  {strength.feedback.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      {item.met ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />
                      )}
                      <span className={item.met ? 'text-[#292626] font-medium' : ''}>
                        {item.rule}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Submit Setup Button */}
                <button
                  type="submit"
                  disabled={isLoading || !strength.isValid || !passwordsMatch}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#145C45] hover:bg-[#0F4534] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Configuring Security Hash...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>Set Password & Continue</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Security Architecture Footnote */}
          <div className="pt-4 border-t border-[#F7E6EB] text-center">
            <p className="text-[10px] text-[#77716F] leading-relaxed">
              <strong>Frontend Prototype Security:</strong> Uses PBKDF2-SHA256 with 16-byte cryptographic salt. Client-side storage is intended for prototype evaluation and requires backend validation for production deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-md w-full mx-auto text-center py-2 z-10">
        <span className="text-[11px] text-[#77716F]">
          KBYK • Handmade & Personalised Gifting Atelier
        </span>
      </div>
    </div>
  );
};
