'use client';

import { useEffect, useState } from 'react';
import { MapPin, Search, List, LayoutGrid } from 'lucide-react';
import DonorCard from '@/components/DonorCard';
import DonorProfileModal from '@/components/DonorProfileModal';
import api from '@/lib/api';

export default function NearbyDonorsWidget() {
  const [location, setLocation] = useState('');
  const [radiusKm, setRadiusKm] = useState(25);
  const [showResults, setShowResults] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [donors, setDonors] = useState([]);
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'list'

  // Client-side haversine distance in km (rounded to 0.1km)
  const haversineKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Derive a distance value for sorting; prefer server distance, fallback to client-side
  const deriveDistance = (d) => {
    const val = d?.distance;
    if (typeof val === 'number' && !Number.isNaN(val)) return val;
    if (coords && d?.coords?.lat != null && d?.coords?.lng != null) {
      return haversineKm(coords.lat, coords.lng, d.coords.lat, d.coords.lng);
    }
    return Number.POSITIVE_INFINITY;
  };
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        // Hydrate last location selection from header
        const saved = JSON.parse(localStorage.getItem('isf:lastLocationSelection') || 'null');
        if (saved?.label) setLocation(saved.label);
        if (saved?.coords) setCoords(saved.coords);
        // If we have coords, prefer nearby search; else load top donors
        if (saved?.coords) {
          const params = { lat: saved.coords.lat, lng: saved.coords.lng, radiusKm };
          const data = await api.get('/donors/search', { params });
          const results = data?.data?.results || [];
          if (results.length > 0) {
            setDonors(results);
            setShowResults(true);
          } else {
            // Fallback: load top donors and compute client-side distance
            const top = await api.get('/donors/top');
            const base = top?.data?.donors || [];
            const withDist = base.map((d) => {
              if (d?.coords?.lat != null && d?.coords?.lng != null) {
                return { ...d, distance: haversineKm(saved.coords.lat, saved.coords.lng, d.coords.lat, d.coords.lng) };
              }
              return d;
            });
            setDonors(withDist);
            setShowResults(true);
          }
        } else {
          const data = await api.get('/donors/top');
          setDonors(data?.data?.donors || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load donors');
      } finally { setLoading(false); }
    };
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to location changes emitted by Header in the same tab
  useEffect(() => {
    const onLocationSelection = (e) => {
      try {
        const detail = e?.detail || {};
        if (detail.label) setLocation(detail.label);
        if (detail.coords) setCoords(detail.coords);
      } catch {}
    };
    window.addEventListener('isf:locationSelection', onLocationSelection);
    return () => window.removeEventListener('isf:locationSelection', onLocationSelection);
  }, []);

  // Fallback: react to storage changes (cross-tab updates)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== 'isf:lastLocationSelection') return;
      try {
        const saved = JSON.parse(e.newValue || 'null');
        if (saved?.label) setLocation(saved.label);
        if (saved?.coords) setCoords(saved.coords);
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  


  const allDonors = donors;

  const filteredDonors = allDonors
    .slice()
    .sort((a, b) => deriveDistance(a) - deriveDistance(b));

  const handleUseLocation = () => {};

  // Popular location presets
  const popularLocations = ['Kolkata', 'Bhangar', 'Canning', 'Berhampur', 'Krishnanagr', 'Jangipur'];
  const popularLocationCoords = {
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Bhangar: { lat: 22.437, lng: 88.562 },
    Canning: { lat: 22.336, lng: 88.662 },
    Berhampur: { lat: 19.3143, lng: 84.7941 },
    Krishnanagr: { lat: 23.401, lng: 88.501 },
    Jangipur: { lat: 24.47, lng: 88.027 },
  };
  const usePresetLocation = () => {};

  const resetFilters = () => {};

  const handleSearch = async () => {
    if (!coords && !location) { setShowResults(false); return; }
    setShowResults(true);
    setLoading(true);
    setError(null);
    try {
      if (coords) {
        const params = { lat: coords.lat, lng: coords.lng, radiusKm };
        const data = await api.get('/donors/search', { params });
        const results = data?.data?.results || [];
        if (results.length > 0) {
          setDonors(results);
        } else {
          const top = await api.get('/donors/top');
          const base = top?.data?.donors || [];
          const withDist = base.map((d) => {
            if (d?.coords?.lat != null && d?.coords?.lng != null) {
              return { ...d, distance: haversineKm(coords.lat, coords.lng, d.coords.lat, d.coords.lng) };
            }
            return d;
          });
          setDonors(withDist);
        }
      } else {
        const data = await api.get('/donors/top');
        setDonors(data?.data?.donors || []);
      }
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally { setLoading(false); }
  };

  // Auto-search when coords are available or location changes
  useEffect(() => {
    if (coords || location) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, location]);

  const handleViewDetails = (donor) => {
    setSelectedDonor(donor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
  };

  const getBloodGroupColor = (group) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-red-100 text-red-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-100 text-purple-800',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-orange-100 text-orange-800',
    };
    return colors[group] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gray-50" aria-labelledby="nearby-donors-heading">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Donors content only; header removed */}
        <div className=" mx-auto">

          {/* Results Preview removed; showing only donors list below */}

          {/* Donors List (always visible) */}
          <div className="mt-6 sm:mt-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-gray-900">Donors List</h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-gray-500">{filteredDonors.length} found</span>
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center rounded-isf bg-primary px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  disabled={loading}
                  title="Refresh proximity results"
                >
                  <Search className="mr-1.5 h-3.5 w-3.5" />
                  {loading ? 'Refreshing…' : 'Refresh'}
                </button>
                <div className="flex items-center border border-gray-200 rounded-isf overflow-hidden">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`px-2.5 py-1.5 text-xs sm:text-sm flex items-center gap-1 ${viewMode === 'card' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                    aria-pressed={viewMode === 'card'}
                    title="Card view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Card
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 py-1.5 text-xs sm:text-sm flex items-center gap-1 border-l border-gray-200 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                    aria-pressed={viewMode === 'list'}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                </div>
              </div>
            </div>

            {filteredDonors.length === 0 ? (
              <div className="bg-white rounded-isf-lg shadow-isf p-6 text-center text-gray-600">
                No donors found near your location.
              </div>
            ) : viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
                {filteredDonors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} onViewDetails={() => handleViewDetails(donor)} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-isf-lg shadow-isf overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {filteredDonors.map((donor) => (
                    <li key={donor.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-gray-900">{donor.name}</div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{donor.bloodGroup}</span>
                        {typeof donor.distance === 'number' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{Math.round(donor.distance)} km</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(donor)}
                          className="px-2.5 py-1.5 text-xs sm:text-sm bg-primary hover:bg-primary-dark text-white rounded-isf"
                        >
                          View
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Donor Profile Modal */}
      <DonorProfileModal donor={selectedDonor} isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
}