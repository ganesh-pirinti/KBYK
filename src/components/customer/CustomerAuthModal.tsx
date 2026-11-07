import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { login } = useCustomerAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, name || undefined);
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleQuickDemoLogin = () => {
    login('ananya.roy@example.com', 'Ananya Roy');
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#F7E6EB] shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden">
        
        {/* Decorative corner glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#F7E6EB] blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#77716F] hover:text-[#292626] p-1.5 rounded-full hover:bg-[#F7E6EB]/50 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F7E6EB] border border-[#E8B5C3] flex items-center justify-center mx-auto text-[#145C45]">
            <User className="w-6 h-6" />
          </div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#145C45] bg-[#F7E6EB] px-2.5 py-0.5 rounded-full inline-block">
            KBYK Patron Portal
          </span>
          <h2 className="font-serif text-2xl text-[#292626] font-medium">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-[#77716F]">
            Track custom gift orders, manage saved addresses & earn heirloom points.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-[#FCFAF9] p-1 border border-[#F7E6EB] mb-5">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#145C45] shadow-xs'
                : 'text-[#77716F] hover:text-[#292626]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-[#145C45] shadow-xs'
                : 'text-[#77716F] hover:text-[#292626]'
            }`}
          >
            New Customer
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#292626] block">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#292626] block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#292626] block">Phone / WhatsApp</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 XXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#292626] block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-[#145C45] hover:bg-[#0F4534] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{mode === 'signin' ? 'Sign In to My Account' : 'Create Account & Earn 100 Pts'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Login Preset */}
        <div className="mt-5 pt-4 border-t border-[#F7E6EB] text-center space-y-2">
          <span className="text-[11px] text-[#77716F] block">Reviewer / Demo Convenience:</span>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 px-3 rounded-xl bg-[#F7E6EB] hover:bg-[#E8B5C3]/50 text-xs font-semibold text-[#145C45] transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sign in as Ananya Roy (VIP Patron Demo)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
