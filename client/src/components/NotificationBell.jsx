"use client";

import { Bell } from "lucide-react";
import React from "react";

export default function NotificationBell({ count = 0, onClick, ariaControlsId }) {
  const hasUnread = count > 0;
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const ariaLabel = mounted && hasUnread ? `${count} unread notifications` : "Notifications";
  return (
    <button
      onClick={onClick}
      className="relative w-12 h-12 min-w-12 min-h-12 flex items-center justify-center rounded-isf hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      aria-expanded={false}
      aria-controls={ariaControlsId}
    >
      <Bell className="w-6 h-6 text-text-primary" />
      {mounted && hasUnread && (
        <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] font-semibold">
          {count}
        </span>
      )}
    </button>
  );
}