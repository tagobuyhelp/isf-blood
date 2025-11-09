"use client";

import { useEffect, useMemo, useState } from "react";

const LS_KEY = "isf_notifications";

function loadFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveToStorage(notifications) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(notifications));
  } catch (e) {
    // ignore
  }
}

export function useNotifications({ simulate = false } = {}) {
  const [notifications, setNotifications] = useState(() => loadFromStorage());

  useEffect(() => {
    // Initialize with sample notifications if empty
    if (notifications.length === 0) {
      const initial = [
        {
          id: crypto.randomUUID?.() || String(Date.now()),
          title: "Blood Request Near You",
          message: "Patient requires O+ donors at City Hospital.",
          timestamp: Date.now() - 1000 * 60 * 30,
          read: false,
        },
        {
          id: (crypto.randomUUID?.() || String(Date.now())) + "-2",
          title: "Registration Successful",
          message: "Thanks for joining ISF Blood Donor.",
          timestamp: Date.now() - 1000 * 60 * 60 * 5,
          read: true,
        },
      ];
      setNotifications(initial);
      saveToStorage(initial);
    }
  }, []);

  useEffect(() => {
    saveToStorage(notifications);
  }, [notifications]);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setNotifications(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Optional simulation of real-time updates
  useEffect(() => {
    if (!simulate) return;
    const interval = setInterval(() => {
      const n = {
        id: crypto.randomUUID?.() || String(Date.now()),
        title: "New Donor Available",
        message: "A donor nearby matches requested blood group.",
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => {
        const next = [n, ...prev];
        saveToStorage(next);
        return next;
      });
    }, 1000 * 60 * 10); // every 10 minutes
    return () => clearInterval(interval);
  }, [simulate]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAllRead,
    toggleRead,
    clearAll,
    addNotification,
  };
}