'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, CheckCircle, Phone, Mail, Navigation, MapPin, Calendar, User, Heart } from 'lucide-react';
import api from '@/lib/api';

export default function DonorProfileModal({ donor, isOpen, onClose }) {
  const [showContact, setShowContact] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  // Fetch donor details (including donation history) when modal opens
  useEffect(() => {
    let mounted = true;
    async function fetchDetails() {
      if (!isOpen || !donor?.id) { if (mounted) setDetails(null); return; }
      setLoadingDetails(true);
      setDetailsError('');
      try {
        // Try to obtain viewer geolocation for distance/requestCount
        let coords = null;
        try {
          if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
            coords = await new Promise((resolve) => {
              navigator.geolocation.getCurrentPosition(
                (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
                () => resolve(null),
                { enableHighAccuracy: true, timeout: 3000 }
              );
            });
          }
        } catch {}
        const params = coords ? { lat: coords.lat, lng: coords.lng, radiusKm: 25 } : undefined;
        const res = await api.getDonor(donor.id, params);
        const payload = res?.donor || res?.data?.donor || null;
        console.info('[DonorProfileModal] fetched details', {
          id: donor?.id,
          name: donor?.name,
          gender: payload?.gender,
          age: payload?.age,
          distance: payload?.distance ?? donor?.distance,
          requestCount: payload?.requestCount,
          phone: payload?.phone,
          source: payload ? 'api' : 'none'
        });
        if (mounted) setDetails(payload);
      } catch (e) {
        if (mounted) setDetailsError(e?.data?.message || e?.message || 'Failed to load donor details');
      } finally {
        if (mounted) setLoadingDetails(false);
      }
    }
    fetchDetails();
    return () => { mounted = false; };
  }, [isOpen, donor?.id]);

  // Log donor + merged details when modal opens or data changes
  useEffect(() => {
    if (!isOpen || !donor) return;
    const merged = {
      id: donor?.id,
      name: donor?.name,
      gender: (details?.gender ?? donor?.gender) ?? null,
      age: (details?.age ?? donor?.age) ?? null,
      distance: donor?.distance ?? null,
      phone: (details?.phone ?? donor?.phone) ?? null,
      email: (details?.email ?? donor?.email) ?? null,
    };
    console.debug('[DonorProfileModal] donor view', merged);
  }, [isOpen, donor, details]);

  if (!isOpen || !donor) return null;

  const getBloodGroupColor = (bloodGroup) => {
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
    return colors[bloodGroup] || 'bg-gray-100 text-gray-800';
  };

  const handleRevealContact = () => {
    setShowConfirmation(true);
  };

  const confirmRevealContact = () => {
    setShowContact(true);
    setShowConfirmation(false);
    try {
      const phoneLogged = (details?.phone ?? donor?.phone) || '—';
      console.log('[DonorProfileModal] contact revealed', { id: donor?.id, name: donor?.name, phone: phoneLogged });
    } catch {}
  };


  // Use donation history from fetched details first, fallback to donor prop
  const donationHistory = (details?.donationHistory) || (donor.donationHistory || []);
  const totalDonations = Array.isArray(donationHistory) ? donationHistory.length : 0;
  const lastDonation = (details?.lastDonation) || donor.lastDonation || '—';
  const gender = (details?.gender ?? donor.gender) || '—';
  const ageSource = details?.age ?? donor.age;
  const age = typeof ageSource === 'number' ? ageSource : (ageSource || '—');
  const distanceVal = (details?.distance ?? donor.distance);
  const distance = distanceVal == null ? '—' : distanceVal;
  const address = donor.address || details?.address || '—';
  const contactPhone = (details?.phone ?? donor.phone) || '—';
  const contactEmail = (details?.email ?? donor.email) || '—';
  const requestCountVal = (details?.requestCount ?? donor.requestCount);
  const requestCount = requestCountVal == null ? '—' : requestCountVal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-4 sm:p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-isf-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Large Profile Photo */}
              <div className="relative">
                {donor.image ? (
                  <Image
                    src={donor.image}
                    alt={donor.name}
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                    priority={false}
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                    {donor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                {donor.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{donor.name}</h2>
                  {donor.verified && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <span className={`px-3 py-1.5 rounded-full text-base sm:text-lg font-medium ${getBloodGroupColor(donor.bloodGroup)}`}>
                  {donor.bloodGroup}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="font-medium">{gender}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Age</div>
                  <div className="font-medium">{age} years</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Distance</div>
                  <div className="font-medium">{distance} km away</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Last Donation</div>
                  <div className="font-medium">{lastDonation}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Total Donations</div>
                  <div className="font-medium">{totalDonations} times</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium">{address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
            <div className="bg-red-50 rounded-isf p-3 sm:p-4 text-center">
              <div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 ${getBloodGroupColor(donor.bloodGroup).replace('bg-', 'text-').replace('-100', '-600')}`}>
                {donor.bloodGroup}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-600">Blood Type</div>
            </div>
            <div className="bg-blue-50 rounded-isf p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-1">{totalDonations}</div>
              <div className="text-[11px] sm:text-xs text-gray-600">Donate</div>
            </div>
            <div className="bg-green-50 rounded-isf p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">{requestCount}</div>
              <div className="text-[11px] sm:text-xs text-gray-600">Request</div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="hidden sm:block bg-gradient-to-r from-primary to-primary-dark rounded-isf-lg p-6 text-center text-white mb-6">
            <h3 className="text-lg font-semibold mb-2">One Drop Can Save a Life</h3>
            <p className="text-sm opacity-90">Easily save lives and connect with nearby drives instantly.</p>
          </div>

          {/* Contact Section */}
          <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-isf">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Contact Information</h3>
            {!showContact ? (
              <div className="text-center">
                <p className="text-gray-600 mb-3">
                  Contact information is protected for privacy. Click below to reveal.
                </p>
                <button
                  onClick={handleRevealContact}
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-isf font-medium transition-colors duration-200"
                >
                  Reveal Contact
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">Phone</div>
                    <div className="text-sm sm:text-base font-medium">{contactPhone}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">Email</div>
                    <div className="text-sm sm:text-base font-medium">{contactEmail}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-4">
            <button className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 sm:px-6 sm:py-3 rounded-isf font-medium transition-colors duration-200">
              Request Donation
            </button>
            <button className="px-3 py-2 sm:px-6 sm:py-3 border border-gray-300 hover:border-primary hover:text-primary rounded-isf font-medium transition-colors duration-200 flex items-center space-x-2" onClick={() => { if (contactPhone && contactPhone !== '—') { window.location.href = `tel:${contactPhone}`; } }}>
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
            <button className="px-3 py-2 sm:px-6 sm:py-3 border border-gray-300 hover:border-primary hover:text-primary rounded-isf font-medium transition-colors duration-200 flex items-center space-x-2" onClick={() => { if (address && address !== '—') { const q = encodeURIComponent(address); window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank'); } }}>
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </button>
          </div>

          {/* Donation History */}
          <div className="hidden md:block">
            <h3 className="font-semibold text-base sm:text-lg mb-4">Donation History</h3>
            {loadingDetails ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-isf">Loading donation history...</div>
            ) : detailsError ? (
              <div className="text-center py-8 text-red-600 bg-red-50 rounded-isf">{detailsError}</div>
            ) : donationHistory.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-isf">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hospital
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donationHistory.map((donation, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {donation.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {donation.hospital}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {donation.units}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-isf">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No donation history available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-isf-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Contact Reveal</h3>
              <p className="text-gray-600 mb-6">
                I confirm this request is for genuine medical purposes and I will use the contact information responsibly.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={confirmRevealContact}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-isf font-medium transition-colors duration-200"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-isf font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}