import React, { useState } from 'react';
import {
  Mail, Lock, User, AtSign, Globe, Calendar, CheckCircle2, ArrowRight, Radio, LogIn, UserPlus,
} from 'lucide-react';
import { UserProfile } from '../types';
import { loginWithEmail, registerWithEmail, loginWithFacebook } from '../lib/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  required?: boolean;
  onAuthSuccess?: (user: UserProfile) => void;
  onLoginSuccess?: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  required = false,
  onAuthSuccess,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('South Africa');
  const [dob, setDob] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeGuidelines, setAgreeGuidelines] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const notifySuccess = (user: UserProfile) => {
    if (onAuthSuccess) onAuthSuccess(user);
    if (onLoginSuccess) onLoginSuccess(user);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      notifySuccess(user);
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMessage(
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Incorrect email or password. Please try again.'
          : err.message || 'Login failed. Please check your credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password || !dob) {
      setErrorMessage('Please complete all required fields.');
      return;
    }
    if (!agreeTerms || !agreeGuidelines) {
      setErrorMessage('You must agree to the Terms and Community Guidelines to continue.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    try {
      const user = await registerWithEmail(email, password, fullName, username);
      notifySuccess(user);
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMessage(
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists. Please log in.'
          : err.code === 'auth/weak-password'
          ? 'Password must be at least 6 characters.'
          : err.message || 'Registration failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithFacebook();
      notifySuccess(user);
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Facebook Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto"
      onClick={required ? undefined : () => onClose?.()}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900/60 via-red-900/40 to-amber-900/30 p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/60 shrink-0">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              HF<span className="text-rose-500">Art</span> Streaming
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {required ? 'Sign in to access the platform' : 'Connecting Creators With The World'}
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-950">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              mode === 'login'
                ? 'text-rose-400 border-b-2 border-rose-500 bg-slate-900'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              mode === 'signup'
                ? 'text-rose-400 border-b-2 border-rose-500 bg-slate-900'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Facebook Sign In */}
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-950/40"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              or use email
            </span>
          </div>

          {/* Email Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Log In to HFArt</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-rose-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-rose-400" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                    placeholder="your_handle"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-rose-400" />
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="South Africa">🇿🇦 South Africa</option>
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Kenya">🇰🇪 Kenya</option>
                    <option value="Ghana">🇬🇭 Ghana</option>
                    <option value="Zimbabwe">🇿🇼 Zimbabwe</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Brazil">🇧🇷 Brazil</option>
                    <option value="Other">🌍 Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date(Date.now() - 13 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 accent-rose-600"
                  />
                  I agree to HFArt <span className="text-rose-400 underline cursor-pointer">Terms of Service</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreeGuidelines}
                    onChange={(e) => setAgreeGuidelines(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 accent-rose-600"
                  />
                  I agree to HFArt <span className="text-rose-400 underline cursor-pointer">Community Guidelines</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Create HFArt Account</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
