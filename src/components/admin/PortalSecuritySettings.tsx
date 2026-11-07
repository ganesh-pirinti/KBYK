import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Loader2,
  Sliders,
  Check,
} from 'lucide-react';
import { useStudioAuth } from '../../context/StudioAuthContext';
import { evaluatePasswordStrength } from '../../utils/security';

export const PortalSecuritySettings: React.FC = () => {
  const {
    changePassword,
    lockPortal,
    inactivityTimeoutMinutes,
    setInactivityTimeoutMinutes,
    resetDemoAuth,
    isLoading,
  } = useStudioAuth();

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  // Inactivity timeout state
  const [savedTimeoutToast, setSavedTimeoutToast] = useState(false);

  // Reset confirmation dialog state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Evaluate password strength
  const strength = evaluatePasswordStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      setErrorMsg('Please enter your current studio password.');
      return;
    }

    if (!newPassword) {
      setErrorMsg('Please enter your new password.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg('New password cannot be the same as your current password.');
      return;
    }

    if (!strength.isValid) {
      setErrorMsg('New password does not meet security strength standards (at least 8 chars with a mix of types).');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('New passwords do not match. Please verify both fields.');
      return;
    }

    setIsChanging(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsChanging(false);

    if (res.success) {
      setSuccessMsg('Your Studio Portal password was successfully updated! The previous password has been invalidated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSuccessMsg(''), 6000);
    } else {
      setErrorMsg(res.error || 'Failed to change password. Please verify your current password.');
    }
  };

  const handleTimeoutChange = (mins: number) => {
    setInactivityTimeoutMinutes(mins);
    setSavedTimeoutToast(true);
    setTimeout(() => setSavedTimeoutToast(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Section Header */}
      <div className="border-b border-[#2C3532] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Security & Portal Access
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage owner password credentials, auto-lock timeouts, and session security.
          </p>
        </div>

        {/* Quick Lock Action Button */}
        <button
          onClick={lockPortal}
          className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Lock className="w-4 h-4 text-red-400" />
          <span>Lock Studio Portal Now</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ============================================================== */}
        {/* Form 1: CHANGE PASSWORD (Left 7 Columns)                       */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-[#161B19] rounded-3xl p-6 sm:p-8 border border-[#2C3532] shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#2C3532]">
            <div className="w-10 h-10 rounded-xl bg-[#145C45]/30 border border-[#145C45] flex items-center justify-center text-emerald-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                Change Studio Password
              </h3>
              <p className="text-xs text-gray-400">
                Update your credentials. The old password will be invalidated immediately.
              </p>
            </div>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-950/70 border border-red-700 text-red-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4" autoComplete="off">
            
            {/* Current Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 block">
                Current Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your existing password"
                  autoComplete="off"
                  disabled={isChanging}
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-[#101413] border border-[#2C3532] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 block">
                New Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  disabled={isChanging}
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-[#101413] border border-[#2C3532] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter for New Password */}
              {newPassword.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Strength:</span>
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
                            bar <= strength.score ? strength.color : '#2C3532',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 block">
                Confirm New Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  disabled={isChanging}
                  className={`w-full px-4 py-3 pr-11 rounded-2xl bg-[#101413] border text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono ${
                    confirmNewPassword && !passwordsMatch
                      ? 'border-red-500 focus:border-red-500'
                      : confirmNewPassword && passwordsMatch
                      ? 'border-emerald-500 focus:border-emerald-500'
                      : 'border-[#2C3532] focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {confirmNewPassword && (
                <div className="text-[11px] pt-0.5">
                  {passwordsMatch ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Criteria checklist */}
            <div className="p-3.5 bg-[#101413] rounded-2xl border border-[#2C3532] space-y-1.5 text-[11px] text-gray-400">
              <span className="font-semibold text-gray-300 block mb-1">
                New password requirements:
              </span>
              {strength.feedback.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {item.met ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-600 flex-shrink-0" />
                  )}
                  <span className={item.met ? 'text-gray-200 font-medium' : ''}>
                    {item.rule}
                  </span>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isChanging || !currentPassword || !strength.isValid || !passwordsMatch}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#145C45] hover:bg-[#0F4534] text-white text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isChanging ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Validating & Updating Salted Hash...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-emerald-200" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ============================================================== */}
        {/* Side Panel: INACTIVITY TIMEOUT & SESSION CONTROLS (Right 5)   */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Inactivity Auto-Lock Box */}
          <div className="bg-[#161B19] rounded-3xl p-6 border border-[#2C3532] shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-white font-serif font-bold text-base">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Inactivity Auto-Lock</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              For security, the Studio Portal automatically locks when no mouse movements, touches, or keystrokes are detected.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {[5, 15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleTimeoutChange(mins)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                    inactivityTimeoutMinutes === mins
                      ? 'bg-[#145C45] border-[#145C45] text-white shadow-xs'
                      : 'bg-[#101413] border-[#2C3532] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span>{mins} Minutes</span>
                  {inactivityTimeoutMinutes === mins && <Check className="w-3.5 h-3.5 text-emerald-200" />}
                </button>
              ))}
            </div>

            {savedTimeoutToast && (
              <p className="text-[11px] text-emerald-400 font-medium animate-fade-in flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-lock updated to {inactivityTimeoutMinutes} minutes
              </p>
            )}
          </div>

          {/* Prototype Security Architecture Note */}
          <div className="bg-[#161B19] rounded-3xl p-6 border border-[#2C3532] shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Prototype Security Notice</span>
            </div>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>
                This Studio Portal utilizes the native <strong>Web Crypto API</strong> (PBKDF2-SHA256 with a unique 16-byte cryptographic salt). No passwords are ever stored or transmitted in plaintext.
              </p>
              <p className="text-[11px] text-gray-500 border-t border-[#2C3532] pt-2">
                <em>Notice:</em> Client-side browser storage (localStorage) is intended for prototype evaluation and paired interaction design. Real production deployment requires server-side tokenized authentication.
              </p>
            </div>
          </div>

          {/* Reset Demo Credentials Box */}
          <div className="bg-[#161B19] rounded-3xl p-6 border border-[#2C3532] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Reset Demo Password
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Prototype Only</span>
            </div>
            <p className="text-xs text-gray-400">
              Clear saved password credentials to re-test the first-time setup screen from scratch.
            </p>

            {showResetConfirm ? (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-2xl space-y-2 text-xs text-red-200">
                <p>Are you sure you want to reset password setup for testing?</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetDemoAuth();
                      setShowResetConfirm(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-[#2C3532] text-gray-300 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#101413] hover:bg-[#2A3330] border border-[#2C3532] text-xs font-semibold text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                <span>Reset to First-Time Setup Screen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
