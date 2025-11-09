'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Filter, Sliders, Users, Map } from 'lucide-react';
import DonorCard from '@/components/DonorCard';
import DonorProfileModal from '@/components/DonorProfileModal';
import Image from 'next/image';
import api from '@/lib/api';
import DonorMap from '@/components/DonorMap';

export default function DonorsPage() {
  const [mounted, setMounted] = useState(false);
  const bannerImages = [
    '/assets/hero-blood-donation-scene.png',
    '/assets/hero-blood-donation-center.png',
  ];
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerPaused, setBannerPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (bannerPaused) return;
    const id = setInterval(() => {
      setBannerIndex((i) => (i + 1) % bannerImages.length);
    }, 3500);
    return () => clearInterval(id);
  }, [bannerPaused, bannerImages.length]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  const [locationLabel, setLocationLabel] = useState('');

  // Initial load: top donors
  useEffect(() => {
    const loadTopDonors = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get('/donors/top', { params: selectedBloodGroup ? { bloodType: selectedBloodGroup } : undefined });
        setDonors(data?.data?.donors || []);
      } catch (err) {
        setError(err.message || 'Failed to load donors');
      } finally {
        setLoading(false);
      }
    };
    loadTopDonors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBloodGroup]);

  // Hydrate saved location on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('isf:lastLocationSelection') || 'null');
      if (saved?.coords) setCoords(saved.coords);
      if (saved?.label) setLocationLabel(saved.label);
    } catch {}
  }, []);

  // Hydrate saved blood group on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('isf:lastBloodGroupSelection') || 'null');
      if (saved?.bloodGroup != null) setSelectedBloodGroup(saved.bloodGroup || '');
    } catch {}
  }, []);

  // React to header location changes within the same tab
  useEffect(() => {
    const onLocationSelection = (e) => {
      try {
        const detail = e?.detail || {};
        if (detail.coords) setCoords(detail.coords);
        if (detail.label) setLocationLabel(detail.label);
      } catch {}
    };
    window.addEventListener('isf:locationSelection', onLocationSelection);
    return () => window.removeEventListener('isf:locationSelection', onLocationSelection);
  }, []);

  // React to header blood group changes within the same tab
  useEffect(() => {
    const onBloodGroupSelection = (e) => {
      try {
        const bg = e?.detail?.bloodGroup;
        setSelectedBloodGroup(bg || '');
      } catch {}
    };
    window.addEventListener('isf:bloodGroupSelection', onBloodGroupSelection);
    return () => window.removeEventListener('isf:bloodGroupSelection', onBloodGroupSelection);
  }, []);

  // Fallback: cross-tab storage changes
  useEffect(() => {
    const onStorage = (e) => {
      try {
        if (e.key === 'isf:lastLocationSelection') {
          const saved = JSON.parse(e.newValue || 'null');
          if (saved?.coords) setCoords(saved.coords);
          if (saved?.label) setLocationLabel(saved.label);
        } else if (e.key === 'isf:lastBloodGroupSelection') {
          const bgSaved = JSON.parse(e.newValue || 'null');
          if (bgSaved?.bloodGroup != null) setSelectedBloodGroup(bgSaved.bloodGroup || '');
        }
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      if (coords) {
        const data = await api.get('/donors/search', {
          params: {
            lat: coords.lat,
            lng: coords.lng,
            radiusKm: maxDistance,
            bloodType: selectedBloodGroup || undefined,
            availability: availabilityFilter !== 'all' ? availabilityFilter : undefined,
          },
        });
        setDonors(data?.data?.results || []);
      } else {
        const data = await api.get('/donors/top', { params: selectedBloodGroup ? { bloodType: selectedBloodGroup } : undefined });
        setDonors(data?.data?.donors || []);
      }
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when coords or filters change
  useEffect(() => {
    if (coords) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, maxDistance, selectedBloodGroup, availabilityFilter]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (donor.address || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodGroup = !selectedBloodGroup || donor.bloodGroup === selectedBloodGroup;
    const matchesDistance = donor.distance == null ? true : donor.distance <= maxDistance;
    const matchesAvailability = availabilityFilter === 'all' || donor.availability === availabilityFilter;
    
    return matchesSearch && matchesBloodGroup && matchesDistance && matchesAvailability;
  });

  const handleViewDetails = (donor) => {
    setSelectedDonor(donor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className={`max-w-7xl mx-auto mt-14 md:mt-0 lg:mt-0 px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
      >
        {/* Header */}
        <div className={`mb-8 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Find Blood Donors
          </h1>
          <p className="text-gray-600">
            Connect with verified blood donors in your area
          </p>
        </div>

        {/* Donors Banner - Auto Slider */}
        <div className="mb-8">
          <div
            className="relative rounded-isf-lg overflow-hidden shadow-isf bg-white h-40 sm:h-52 lg:h-64"
            onMouseEnter={() => setBannerPaused(true)}
            onMouseLeave={() => setBannerPaused(false)}
          >
            {bannerImages.map((src, idx) => (
              <Image
                key={`${src}-${idx}`}
                src={src}
                alt="Join the community of blood donors"
                width={1600}
                height={400}
                priority={idx === 0}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out transform will-change-transform ${
                  idx === bannerIndex ? 'opacity-100 scale-[1.03]' : 'opacity-0 scale-100'
                }`}
              />
            ))}
            {/* Subtle gradient for legibility */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {bannerImages.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 ease-out ${
                    idx === bannerIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => setBannerIndex(idx)}
                  style={{ transform: idx === bannerIndex ? 'scale(1.4)' : 'scale(1)' }}
                />
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-isf text-sm font-medium transition-colors duration-200"
            >
              Search Donors
            </button>
            <button
              onClick={handleUseLocation}
              className="border border-gray-300 hover:border-primary hover:text-primary px-4 py-2 rounded-isf text-sm font-medium transition-colors duration-200"
            >
              Use my location
            </button>
            {loading && (
              <span className="text-sm text-gray-500">Loading…</span>
            )}
            {error && (
              <span className="text-sm text-red-600">{error}</span>
            )}
          </div>
        </div>

        {/* Location Bar */}
        <div className={`bg-white rounded-isf-lg shadow-isf p-4 mb-6 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium text-text-primary">{locationLabel || 'Location'}</span>
              <button
                onClick={() => {
                  try {
                    window.dispatchEvent(new CustomEvent('isf:openLocationPicker'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } catch {}
                }}
                className="text-primary hover:text-primary-dark text-sm font-medium transition-transform duration-200 hover:scale-105"
              >
                Change
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {filteredDonors.length} donors found
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`bg-white rounded-isf-lg shadow-isf p-6 mb-6 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors by location or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow duration-200 focus:shadow-isf"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Blood Group Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Distance Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance: {maxDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="emergency">Emergency Only</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex rounded-isf border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 hover:scale-[1.02] ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 hover:scale-[1.02] ${
                    viewMode === 'map' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          {/* Donor List */}
          <div className="lg:col-span-2">
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-4 bg-white rounded-isf-lg shadow-isf text-gray-600">Loading donors…</div>
                )}
                {error && (
                  <div className="text-center py-4 bg-white rounded-isf-lg shadow-isf text-red-600">{error}</div>
                )}
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((donor, idx) => (
                    <div
                      key={donor.id}
                      className={`transition-all duration-300 ease-out hover:translate-y-0.5 hover:shadow-isf rounded-isf`}
                      style={{ transitionDelay: `${idx * 40}ms` }}
                    >
                      <DonorCard
                        donor={donor}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-isf-lg shadow-isf">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No donors found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or expanding the distance range.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-isf-lg shadow-isf p-0 h-96">
                <DonorMap donors={filteredDonors} center={coords} radiusKm={maxDistance} onMarkerClick={handleViewDetails} heightClass="h-96" />
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-isf-lg shadow-isf p-6 sticky top-24 transition-all duration-500 ease-out hover:shadow-lg">
              <h3 className="font-semibold text-lg mb-4">Donor Locations</h3>
              <DonorMap donors={filteredDonors} center={coords} radiusKm={maxDistance} onMarkerClick={handleViewDetails} heightClass="h-64" />
              
              {/* Quick Stats */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Donors</span>
                  <span className="font-semibold text-green-600">
                    {filteredDonors.filter(d => d.availability === 'available').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Emergency Only</span>
                  <span className="font-semibold text-red-600">
                    {filteredDonors.filter(d => d.availability === 'emergency').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verified Donors</span>
                  <span className="font-semibold text-blue-600">
                    {filteredDonors.filter(d => d.verified).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}