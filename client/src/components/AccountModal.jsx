"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { loadSession, isSessionValid, clearSession } from "@/lib/userStore";

export default function AccountModal({ open, onClose }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      lastFocusedRef.current = document.activeElement;
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 10);
      // Initialize auth state when modal opens
      (async () => {
        setAuthError("");
        setAuthLoading(true);
        try {
          const session = await loadSession();
          const valid = await isSessionValid();
          if (session?.user && valid) {
            setIsAuthed(true);
            setCurrentUser(session.user);
          } else if (session?.token) {
            try {
              const res = await api.me();
              const u = res?.data ?? res;
              setIsAuthed(true);
              setCurrentUser(u);
            } catch {
              setIsAuthed(false);
              setCurrentUser(null);
            }
          } else {
            setIsAuthed(false);
            setCurrentUser(null);
          }
        } catch (e) {
          setAuthError(e?.data?.message || e?.message || "Failed to read session");
          setIsAuthed(false);
          setCurrentUser(null);
        } finally {
          setAuthLoading(false);
        }
      })();
      const onKeyDown = (e) => {
        if (e.key === "Escape") handleRequestClose();
        if (e.key === "Tab") {
          const focusable = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable || focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    } else {
      setVisible(false);
      lastFocusedRef.current?.focus?.();
    }
  }, [open]);

  const handleRequestClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200); // allow exit animation
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleRequestClose();
  };

  const handleLogout = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await api.logout();
    } catch (e) {
      setAuthError(e?.data?.message || e?.message || "Logout failed");
    } finally {
      try { await clearSession(); } catch {}
      setIsAuthed(false);
      setCurrentUser(null);
      setAuthLoading(false);
      handleRequestClose();
    }
  };

  const initials = (() => {
    const n = currentUser?.name || "";
    return n.trim().split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";
  })();

  if (!open && !visible) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-start justify-end pt-16 md:pt-20 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Account"
        tabIndex={-1}
        className={`w-full sm:w-auto sm:min-w-[320px] sm:max-w-sm bg-white rounded-isf shadow-isf mx-4 sm:mx-6 transition-transform duration-200 ease-out focus:outline-none ${
          visible ? "translate-y-0" : "-translate-y-2"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-heading font-semibold">Account</h2>
          <button
            onClick={handleRequestClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-isf hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close account menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {authLoading ? (
            <div className="animate-pulse space-y-3" aria-live="polite" aria-busy="true">
              <div className="h-10 bg-gray-100 rounded-isf" />
              <div className="h-16 bg-gray-100 rounded-isf" />
            </div>
          ) : isAuthed && currentUser ? (
            <div className="space-y-4">
              {authError && (
                <div className="p-2 rounded-isf bg-red-50 text-red-700 border border-red-200" role="alert">
                  {authError}
                </div>
              )}
              <div className="flex items-center gap-3">
                {currentUser?.avatar ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                    <Image src={currentUser.avatar} alt="User avatar" width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{currentUser?.name || "User"}</div>
                  <div className="text-xs text-gray-600 truncate">{currentUser?.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-primary hover:text-primary px-4 py-2.5 rounded-isf font-medium transition-colors duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>View Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-isf font-medium transition-colors duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Logout"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-isf font-medium transition-colors duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-primary hover:text-primary px-4 py-2.5 rounded-isf font-medium transition-colors duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}