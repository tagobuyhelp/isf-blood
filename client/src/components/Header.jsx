'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Droplets,
  Home as HomeIcon,
  Users,
  LifeBuoy,
  UserPlus,
  Shield,
  LogIn,
  User,
  Heart,
  ArrowRight,
  MapPin,
  ChevronDown,
  Bell,
  Phone,
  Mail,
  Twitter,
  Github,
  Linkedin,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import NotificationModal from './NotificationModal';
import AccountModal from './AccountModal';
import { useNotifications } from '../lib/useNotifications';
import api from '../lib/api';
import { loadSession, clearSession } from '../lib/userStore';

export default function Header() {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [selectedLocationCoords, setSelectedLocationCoords] = useState(null);
  const [geoDetecting, setGeoDetecting] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const notifDialogId = 'notifications-dialog';
  // Ref to desktop location input to focus when opening picker
  const locationInputRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAllRead,
    toggleRead,
    clearAll,
  } = useNotifications();

  const popularLocations = [
    'Kolkata',
    'Bhangar',
    'Canning',
    'Berhampur',
    'Krishnanagr',
    'Jangipur',
  ];

  // Approximate coordinates for popular locations (for expected location selection)
  const popularLocationCoords = {
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Bhangar: { lat: 22.437, lng: 88.562 },
    Canning: { lat: 22.336, lng: 88.662 },
    Berhampur: { lat: 19.3143, lng: 84.7941 },
    Krishnanagr: { lat: 23.401, lng: 88.501 },
    Jangipur: { lat: 24.470, lng: 88.027 },
  };

  const locationSuggestions = popularLocations.filter((loc) =>
    location ? loc.toLowerCase().includes(location.toLowerCase()) : true
  );

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile drawer on Escape for accessibility
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  // Load session on mount to drive auth-aware drawer
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await loadSession();
        if (!mounted) return;
        setAuthUser(s?.user || null);
      } catch (err) {
        if (!mounted) return;
        setAuthError('Failed to read session');
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Persist and hydrate last chosen location (current or expected)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('isf:lastLocationSelection') || 'null');
      if (saved?.label) setLocation(saved.label);
      if (saved?.coords) setSelectedLocationCoords(saved.coords);
    } catch (e) {
      // ignore
    }
  }, []);

  // Hydrate last blood group selection on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('isf:lastBloodGroupSelection') || 'null');
      if (saved?.bloodGroup != null) setSelectedBloodGroup(saved.bloodGroup || '');
    } catch {}
  }, []);

  // Broadcast blood group changes and persist for cross-tab sync
  useEffect(() => {
    try {
      localStorage.setItem(
        'isf:lastBloodGroupSelection',
        JSON.stringify({ bloodGroup: selectedBloodGroup || '', ts: Date.now() })
      );
      window.dispatchEvent(
        new CustomEvent('isf:bloodGroupSelection', {
          detail: { bloodGroup: selectedBloodGroup || '' }
        })
      );
    } catch {}
  }, [selectedBloodGroup]);

  // Respond to request to open location picker (from Donors page "Change")
  useEffect(() => {
    const onOpenPicker = () => {
      setShowLocationSuggestions(true);
      try {
        locationInputRef.current?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {}
    };
    window.addEventListener('isf:openLocationPicker', onOpenPicker);
    return () => window.removeEventListener('isf:openLocationPicker', onOpenPicker);
  }, []);

  const saveLocationSelection = (label, coords) => {
    try {
      localStorage.setItem(
        'isf:lastLocationSelection',
        JSON.stringify({ label, coords, ts: Date.now() })
      );
      // Notify other components in the same tab immediately
      try {
        window.dispatchEvent(
          new CustomEvent('isf:locationSelection', {
            detail: { label, coords }
          })
        );
      } catch {}
    } catch (e) {
      // ignore
    }
  };

  const useCurrentLocation = async () => {
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation not supported');
      return;
    }
    setGeoDetecting(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setSelectedLocationCoords(coords);
        // Try to reverse-geocode to extract city name
        const reverseGeocodeCity = async (lat, lng) => {
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&format=json&zoom=10&addressdetails=1`;
            const res = await fetch(url, {
              headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error('Reverse geocoding failed');
            const data = await res.json();
            const addr = data?.address || {};
            const cityLike = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || addr.state || addr.county;
            return cityLike || 'Current location';
          } catch {
            return 'Current location';
          }
        };
        (async () => {
          const cityName = await reverseGeocodeCity(coords.lat, coords.lng);
          setLocation(cityName);
          saveLocationSelection(cityName, coords);
        })();
        try {
          console.info('[Header] visitor location', coords);
        } catch {}
        setGeoDetecting(false);
      },
      (err) => {
        setGeoError(err?.message || 'Failed to detect location');
        setGeoDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const useExpectedLocation = (label) => {
    setLocation(label);
    const coords = popularLocationCoords[label] || null;
    setSelectedLocationCoords(coords);
    saveLocationSelection(label, coords);
    setShowLocationSuggestions(false);
  };

  // Auto-detect current location and city on mount if no prior selection
  useEffect(() => {
    const hasSelection = Boolean(location) && Boolean(selectedLocationCoords);
    if (!hasSelection) {
      // Fire and forget; UI will update when detection completes
      useCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      try {
        await api.logout();
      } catch (e) {
        // Ensure local session clears even if API fails
      }
      await clearSession();
      setAuthUser(null);
      setIsMenuOpen(false);
    } catch (err) {
      setAuthError('Logout failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const initials = (name) => {
    if (!name) return 'U';
    const parts = String(name).trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] || '' : '';
    return (first + last).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-white shadow-isf">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-text-primary">
              ISF Blood Donor
            </span>
          </Link>

          {/* Search Inputs - Desktop Only */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 150)}
                ref={locationInputRef}
                className="pl-10 pr-4 py-2 w-40 text-sm border border-gray-200 rounded-isf focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />

              {showLocationSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-isf shadow-isf z-50">
                  {/* Current location quick action */}
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2 border-b border-gray-100"
                    onMouseDown={useCurrentLocation}
                    aria-label="Use current location"
                  >
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700">
                      {geoDetecting ? 'Detecting current location…' : 'Use my current location'}
                    </span>
                  </button>
                  {locationSuggestions.length > 0 ? (
                    locationSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2"
                        onMouseDown={() => useExpectedLocation(s)}
                        aria-label={`Use location ${s}`}
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{s}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                  )}
                  {geoError && (
                    <div className="px-3 py-2 text-xs text-red-600 border-t border-gray-100" role="alert">
                      {geoError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Blood Group Select */}
            <div className="relative">
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2 w-24 text-sm border border-gray-200 rounded-isf focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              >
                <option value="">Blood</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-text-primary hover:text-primary transition-colors duration-200"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/donors"
              className="flex items-center space-x-2 text-text-primary hover:text-primary transition-colors duration-200"
            >
              <Users className="w-4 h-4" />
              <span>Donors</span>
            </Link>
            <Link
              href="/request"
              className="flex items-center space-x-2 text-text-primary hover:text-primary transition-colors duration-200"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Request Blood</span>
            </Link>


            {/* Account Icon with Tooltip */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setIsAccountOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsAccountOpen(true);
                  }
                }}
                className="p-2 rounded-isf text-text-primary bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Open account menu"
                aria-haspopup="dialog"
                aria-expanded={isAccountOpen}
                title="Account"
              >
                {authUser ? (
                  authUser.avatar ? (
                    <img
                      src={authUser.avatar}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      {initials(authUser?.name || authUser?.fullName || authUser?.email)}
                    </div>
                  )
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded-isf opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                Account
              </span>
            </div>

            {/* Notification Bell */}
            <NotificationBell
              count={unreadCount}
              onClick={() => setIsNotifOpen(true)}
              ariaControlsId={notifDialogId}
            />

            {/* Donate Now Button */}
            <Link
              href="/register"
              className="group bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-isf font-medium transition-colors duration-200 flex items-center space-x-2"
              aria-label="Donate Now"
            >
              <Heart className="w-4 h-4" />
              <span>Donate Now</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </nav>

          {/* Mobile: Notification + Menu */}
          <div className="md:hidden flex items-center gap-1">
            <NotificationBell
              count={unreadCount}
              onClick={() => setIsNotifOpen(true)}
              ariaControlsId={notifDialogId}
            />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-isf text-text-primary hover:bg-background"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div>

        </div>

        {/* Mobile Search Inputs - Single Row */}
        <div className="md:hidden px-2 pb-2 bg-background-white border-t border-gray-200">
          <div className="px-1 py-2 flex items-center gap-2">
            {/* Location Input */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 150)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-isf focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />

              {showLocationSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-isf shadow-isf z-50">
                  {/* Current location quick action (mobile) */}
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2 border-b border-gray-100"
                    onMouseDown={useCurrentLocation}
                    aria-label="Use current location"
                  >
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700">
                      {geoDetecting ? 'Detecting current location…' : 'Use my current location'}
                    </span>
                  </button>
                  {locationSuggestions.length > 0 ? (
                    locationSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2"
                        onMouseDown={() => useExpectedLocation(s)}
                        aria-label={`Use location ${s}`}
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{s}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                  )}
                  {geoError && (
                    <div className="px-3 py-2 text-xs text-red-600 border-t border-gray-100" role="alert">
                      {geoError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Blood Group Select */}
            <div className="relative w-28 sm:w-32">
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-isf focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              >
                <option value="">Blood</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation: Left-side drawer */}
        <div className={`fixed inset-0 z-[60] md:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isMenuOpen}>
          {/* Overlay */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            aria-label="Close menu overlay"
          />
          {/* Drawer */}
          <nav
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Menu"
            className={`absolute top-0 left-0 h-full w-4/5 max-w-xs bg-white shadow-isf transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
            tabIndex={-1}
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <span className="text-lg font-heading font-semibold text-text-primary">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-isf text-text-primary hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-2 pt-2 pb-6 space-y-1">
              <Link
                href="/"
                className="flex items-center px-3 py-3 min-h-[48px] text-text-primary hover:text-primary hover:bg-background rounded-isf transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                <span className="text-sm">Home</span>
              </Link>
              <Link
                href="/donors"
                className="flex items-center px-3 py-3 min-h-[48px] text-text-primary hover:text-primary hover:bg-background rounded-isf transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm">Donors</span>
              </Link>
              <Link
                href="/request"
                className="flex items-center px-3 py-3 min-h-[48px] text-text-primary hover:text-primary hover:bg-background rounded-isf transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <LifeBuoy className="w-5 h-5 mr-2" />
                <span className="text-sm">Request Blood</span>
              </Link>
              
              {/* Auth-aware section */}
              {authLoading ? (
                <div className="px-3 py-3 text-sm text-gray-500">Loading account…</div>
              ) : authUser ? (
                <div className="mt-2 mb-4 px-3 py-3 bg-background rounded-isf">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {initials(authUser?.name || authUser?.fullName || authUser?.email)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-text-primary">{authUser?.name || authUser?.fullName || 'Account'}</div>
                      <div className="text-xs text-gray-600">{authUser?.email || '—'}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href="/profile"
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm rounded-isf bg-gray-100 hover:bg-gray-200 text-gray-700 min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span>View Profile</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center px-3 py-2 text-sm rounded-isf bg-red-600 hover:bg-red-700 text-white min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                  {authError && (
                    <div className="mt-2 text-xs text-red-600" role="alert">{authError}</div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center">
                  <Link
                    href="/login"
                    className="flex items-center justify-center mx-3 mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-isf font-medium text-center transition-colors duration-200 space-x-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center mx-3 mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-isf font-medium text-center transition-colors duration-200 space-x-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    <span>Register</span>
                  </Link>
                </div>
              )}

            </div>
            {/* Drawer Footer: Contact & Social */}
            <div className="mt-auto border-t border-gray-200 px-4 py-3 space-y-3">
              <div className="grid grid-cols-1 gap-2" aria-label="Contact information">
                <a href="tel:+8801700000000" aria-label="Call ISF support at +8801700000000" className="flex items-center gap-2 text-text-primary hover:text-primary hover:bg-background rounded-isf px-2 py-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+880 1700-000000</span>
                </a>
                <a href="mailto:support@isf-blood.org" aria-label="Email ISF support" className="flex items-center gap-2 text-text-primary hover:text-primary hover:bg-background rounded-isf px-2 py-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">support@isf-blood.org</span>
                </a>
                <a href="https://maps.google.com/?q=ISF%20Blood%20Donor" target="_blank" rel="noopener noreferrer" aria-label="Open ISF location in maps" className="flex items-center gap-2 text-text-primary hover:text-primary hover:bg-background rounded-isf px-2 py-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Find us on Maps</span>
                </a>
              </div>
              <div className="flex items-center gap-3" aria-label="Social links">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 min-w-10 min-h-10 flex items-center justify-center rounded-full bg-background hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 min-w-10 min-h-10 flex items-center justify-center rounded-full bg-background hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 min-w-10 min-h-10 flex items-center justify-center rounded-full bg-background hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Account Modal */}
      <AccountModal open={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      {/* Notifications Modal */}
      <NotificationModal
        open={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={markAllRead}
        onToggleRead={toggleRead}
        onClearAll={clearAll}
      />

    </header>
  );
}