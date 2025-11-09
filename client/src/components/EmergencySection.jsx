import Link from 'next/link';
import { AlertTriangle, MapPin, Clock, Phone } from 'lucide-react';

export default function EmergencySection() {
  const emergencyRequests = [
    {
      id: 1,
      hospital: 'Cedars-Sinai Medical Center',
      bloodType: 'O-',
      urgency: 'Critical',
      location: 'West Hollywood, CA',
      timeAgo: '5 min ago',
      unitsNeeded: 3,
      image: '/hospital-1.jpg'
    },
    {
      id: 2,
      hospital: 'UCLA Medical Center',
      bloodType: 'A+',
      urgency: 'Urgent',
      location: 'Westwood, CA',
      timeAgo: '12 min ago',
      unitsNeeded: 2,
      image: '/hospital-2.jpg'
    },
    {
      id: 3,
      hospital: 'City General Hospital',
      bloodType: 'B-',
      urgency: 'Emergency',
      location: 'Downtown, CA',
      timeAgo: '18 min ago',
      unitsNeeded: 1,
      image: '/hospital-3.jpg'
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Emergency':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Urgent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'O-': 'bg-red-500',
      'O+': 'bg-red-400',
      'A-': 'bg-blue-500',
      'A+': 'bg-blue-400',
      'B-': 'bg-green-500',
      'B+': 'bg-green-400',
      'AB-': 'bg-purple-500',
      'AB+': 'bg-purple-400',
    };
    return colors[bloodType] || 'bg-gray-500';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Emergency Blood</h2>
          </div>
          <Link 
            href="/emergency" 
            className="text-primary hover:text-primary-dark text-sm font-medium transition-colors duration-200"
          >
            See All
          </Link>
        </div>

        {/* Emergency Requests */}
        <div className="space-y-4">
          {emergencyRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-isf-lg shadow-isf border border-gray-100 p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4">
                {/* Hospital Icon/Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-isf flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {request.hospital}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{request.timeAgo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 ${getBloodTypeColor(request.bloodType)} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{request.bloodType}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'} needed
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-primary transition-colors duration-200">
                        <Phone className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/emergency/${request.id}`}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-isf text-xs font-medium transition-colors duration-200"
                      >
                        Respond
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Hotline */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-isf-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900">Emergency Hotline</h3>
              <p className="text-xs text-red-700">Call for immediate blood donation assistance</p>
            </div>
            <a
              href="tel:911"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-isf text-sm font-medium transition-colors duration-200"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}