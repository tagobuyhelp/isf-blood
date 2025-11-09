"use client";

import { useEffect, useRef, useState } from "react";
import { X, CheckCircle, Trash2 } from "lucide-react";
import { subscribeUserToPush, sendTestPush } from "../lib/pushNotifications";

export default function NotificationModal({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onToggleRead,
  onClearAll,
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Mobile bottom-sheet swipe-to-dismiss
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement;
      // Focus first focusable element in modal
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 10);
      const onKeyDown = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Tab") {
          // Simple focus trap
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
      // Restore focus to the trigger
      lastFocusedRef.current?.focus?.();
    }
  }, [open, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Touch handlers for mobile swipe-to-dismiss
  const onTouchStart = (e) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - startYRef.current;
    setDragY(delta > 0 ? delta : 0);
  };
  const onTouchEnd = () => {
    setIsDragging(false);
    const threshold = 80; // pixels to dismiss
    if (dragY > threshold) {
      onClose();
    }
    setDragY(0);
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center"
      aria-hidden={!open}
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        tabIndex={-1}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`
          w-full md:max-w-[60vw] md:min-w-[40vw]
          bg-white rounded-t-2xl md:rounded-isf shadow-isf
          transition-transform duration-300 ease-out
          focus:outline-none
        `}
        style={{
          transform: `translateY(${dragY}px)`,
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-heading font-semibold">Notifications</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm rounded-isf bg-gray-100 hover:bg-gray-200 text-gray-700 min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm rounded-isf bg-gray-100 hover:bg-gray-200 text-gray-700 min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Clear all notifications"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 md:w-10 md:h-10 inline-flex items-center justify-center rounded-isf hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] md:max-h-[70vh] overflow-y-auto p-4 md:p-6">
          {/* Enable Push Notifications */}
          <div className="mb-4 p-3 md:p-4 rounded-isf border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm md:text-base font-medium text-gray-900">Enable push notifications</p>
                <p className="text-xs md:text-sm text-gray-600">Get real-time alerts even when the app is closed.</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await subscribeUserToPush();
                    await sendTestPush({ title: 'Push Enabled', body: 'You will now receive alerts.' });
                    alert('Push notifications enabled. A test notification was sent.');
                  } catch (err) {
                    console.error(err);
                    alert('Failed to enable push notifications: ' + (err?.message || 'Unknown error'));
                  }
                }}
                className="inline-flex items-center justify-center px-3 py-2 text-xs md:text-sm rounded-isf bg-primary hover:bg-primary-dark text-white min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Enable
              </button>
            </div>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-600">No notifications</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li key={n.id} className="">
                  <button
                    className={`w-full text-left px-3 py-3 md:px-4 md:py-3 rounded-isf border flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      n.read ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
                    }`}
                    onClick={() => onToggleRead(n.id)}
                    aria-pressed={n.read}
                  >
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs md:text-sm text-gray-600 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                    </div>
                    {!n.read && (
                      <span className="mt-1 inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-500" aria-label="Unread"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}