'use client';

import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';
import { LogIn, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const googleButtonRef = useRef(null);

  // Load Google Identity Services script
  useEffect(() => {
    const scriptId = 'google-identity-services';
    if (document.getElementById(scriptId)) {
      setGsiReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiReady(true);
    document.body.appendChild(script);
  }, []);

  const onGoogleCredential = async (response) => {
    try {
      const idToken = response?.credential;
      if (!idToken) throw new Error('No Google credential received');
      const res = await api.googleLogin(idToken);
      setSuccess(true);
      setTimeout(() => { window.location.href = '/profile'; }, 800);
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Google login failed';
      setError({ general: msg });
    }
  };

  // Initialize and render Google button when script is ready
  useEffect(() => {
    if (!gsiReady || !googleButtonRef.current) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return; // No client ID configured; keep fallback button
    try {
      /* global google */
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: onGoogleCredential,
        ux_mode: 'popup'
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rect',
      });
    } catch (e) {
      // Silently fail to fallback button
    }
  }, [gsiReady]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password.trim()) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errs = validate();
    if (Object.keys(errs).length) {
      setError(errs);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.login(email.trim(), password);
      // If we reach here, session has been saved by api.login
      setSuccess(true);
      setTimeout(() => { window.location.href = '/profile'; }, 800);
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Login failed';
      setError({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-6 md:py-8" aria-live="polite">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-isf-lg shadow-isf p-6 md:p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Login Successful</h2>
            <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6">Welcome back! Redirecting to your profile…</p>
            <button
              onClick={() => (window.location.href = '/profile')}
              className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 min-h-[48px] rounded-isf font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 md:py-8 mt-14 sm:mt-0 md:mt-0">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full mx-auto mb-3 md:mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-2">Log in</h1>
          <p className="text-sm md:text-base text-gray-600">Access your donor profile and manage requests</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-3 min-h-[48px] border border-gray-300 rounded-isf focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-invalid={Boolean(error?.email)}
                  aria-describedby={error?.email ? 'email-error' : undefined}
                />
              </div>
              {error?.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600">{error.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 min-h-[48px] border border-gray-300 rounded-isf focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-invalid={Boolean(error?.password)}
                  aria-describedby={error?.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-isf"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error?.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600">{error.password}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember" name="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed text-white px-6 py-3 min-h-[48px] rounded-isf font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
            {error?.general && (
              <p className="mt-2 text-sm text-red-600" aria-live="assertive">{error.general}</p>
            )}

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-gray-500">or</span>
              </div>
            </div>
            {/* Google Sign-In */}
            <div className="w-full">
              <div ref={googleButtonRef} className="flex justify-center" />
              {/* Fallback button if client ID not configured or script not loaded */}
              {!gsiReady || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                <button
                  type="button"
                  className="mt-2 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 min-h-[48px] rounded-isf font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  onClick={() => setError({ general: 'Google Sign-In is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.' })}
                >
                  Continue with Google
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}