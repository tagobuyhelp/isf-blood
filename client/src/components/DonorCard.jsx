'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Phone, MessageCircle, Navigation, MapPin, Calendar } from 'lucide-react';

export default function DonorCard({ donor, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDistanceCity = () => {
    const hasDistance = typeof donor?.distance === 'number' && !Number.isNaN(donor.distance);
    const distanceStr = hasDistance ? `${Math.round(donor.distance)} km` : null;
    const city = donor?.address || donor?.city || undefined;
    if (distanceStr && city) return `${distanceStr} — ${city}`;
    if (distanceStr) return distanceStr;
    if (city) return city;
    return 'Location unavailable';
  };

  const handleDirections = () => {
    try {
      const coords = donor?.coords;
      const addr = donor?.address || donor?.city || '';
      let url = '';
      if (coords?.lat && coords?.lng) {
        url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
      } else if (addr) {
        url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
      } else {
        return; // no destination available
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      // fail-safe: do nothing
    }
  };

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

  const getAvailabilityStatus = (availability) => {
    switch (availability) {
      case 'available':
        return { color: 'bg-green-100 text-green-800', text: 'Available' };
      case 'emergency':
        return { color: 'bg-red-100 text-red-800', text: 'Emergency Only' };
      case 'unavailable':
        return { color: 'bg-gray-100 text-gray-800', text: 'Unavailable' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    }
  };

  const availabilityStatus = getAvailabilityStatus(donor.availability);

  return (
    <div 
      className={`bg-white rounded-isf-lg shadow-isf hover:shadow-lg transition-all duration-300 p-6 border ${
        donor.availability === 'emergency' ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'
      } ${isHovered ? 'transform -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Photo and Basic Info */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Profile Photo */}
        <div className="relative">
          {donor.image ? (
            <Image
              src={donor.image}
              alt={donor.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
              priority={false}
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
              {donor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          )}
          {donor.verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Name and Blood Group */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-lg text-text-primary">{donor.name}</h3>
            {donor.verified && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBloodGroupColor(donor.bloodGroup)}`}>
              {donor.bloodGroup}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${availabilityStatus.color}`}>
              {availabilityStatus.text}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{formatDistanceCity()}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Last donated: {donor.lastDonation}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onViewDetails(donor)}
          className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-isf text-sm font-medium transition-colors duration-200"
        >
          View Details
        </button>
        <button className="p-2 border border-gray-300 hover:border-primary hover:text-primary rounded-isf transition-colors duration-200">
          <MessageCircle className="w-4 h-4" />
        </button>
        <button className="p-2 border border-gray-300 hover:border-primary hover:text-primary rounded-isf transition-colors duration-200">
          <Phone className="w-4 h-4" />
        </button>
        <button
          onClick={handleDirections}
          disabled={!donor?.coords && !donor?.address && !donor?.city}
          aria-label="Open directions in Google Maps"
          className="p-2 border border-gray-300 hover:border-primary hover:text-primary rounded-isf transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}