'use client';

import { useState } from 'react';
import { 
  Users, 
  Heart, 
  Building, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  MapPin,
  Search,
  Filter,
  Check,
  X,
  Eye
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const stats = {
    totalDonors: 1247,
    activeRequests: 23,
    verifiedHospitals: 45,
    fulfilledRequests: 892
  };

  const bloodGroupData = [
    { group: 'O+', requests: 45, donors: 234 },
    { group: 'A+', requests: 32, donors: 189 },
    { group: 'B+', requests: 28, donors: 156 },
    { group: 'AB+', requests: 15, donors: 98 },
    { group: 'O-', requests: 38, donors: 145 },
    { group: 'A-', requests: 22, donors: 123 },
    { group: 'B-', requests: 18, donors: 87 },
    { group: 'AB-', requests: 12, donors: 65 }
  ];

  const pendingVerifications = [
    {
      id: 1,
      name: 'John Smith',
      bloodGroup: 'O+',
      city: 'New York',
      status: 'pending',
      submittedDate: '2024-12-20',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      bloodGroup: 'A-',
      city: 'Los Angeles',
      status: 'pending',
      submittedDate: '2024-12-19',
      phone: '+1 (555) 987-6543',
      email: 'maria.garcia@email.com'
    },
    {
      id: 3,
      name: 'David Chen',
      bloodGroup: 'B+',
      city: 'Chicago',
      status: 'pending',
      submittedDate: '2024-12-18',
      phone: '+1 (555) 456-7890',
      email: 'david.chen@email.com'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      bloodGroup: 'AB+',
      city: 'Houston',
      status: 'reviewing',
      submittedDate: '2024-12-17',
      phone: '+1 (555) 321-0987',
      email: 'sarah.johnson@email.com'
    }
  ];

  const recentRequests = [
    {
      id: 1,
      patientName: 'Emergency Patient',
      bloodGroup: 'O-',
      units: 2,
      hospital: 'City General Hospital',
      urgency: 'emergency',
      status: 'active',
      requestedDate: '2024-12-20'
    },
    {
      id: 2,
      patientName: 'Alice Brown',
      bloodGroup: 'A+',
      units: 1,
      hospital: 'Regional Medical Center',
      urgency: 'normal',
      status: 'fulfilled',
      requestedDate: '2024-12-19'
    },
    {
      id: 3,
      patientName: 'Robert Wilson',
      bloodGroup: 'B-',
      units: 3,
      hospital: 'Community Health Center',
      urgency: 'normal',
      status: 'active',
      requestedDate: '2024-12-18'
    }
  ];

  const handleApprove = (donorId) => {
    console.log('Approving donor:', donorId);
    // Handle approval logic
  };

  const handleReject = (donorId) => {
    console.log('Rejecting donor:', donorId);
    // Handle rejection logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    return urgency === 'emergency' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'fulfilled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage donors, requests, and monitor platform activity
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'verification'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Donor Verification
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'requests'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Blood Requests
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-isf-lg shadow-isf p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Donors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDonors.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-isf-lg shadow-isf p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeRequests}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-isf-lg shadow-isf p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Verified Hospitals</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.verifiedHospitals}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-isf-lg shadow-isf p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Fulfilled Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.fulfilledRequests.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Blood Group Requests Chart */}
              <div className="bg-white rounded-isf-lg shadow-isf p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Requests by Blood Group
                </h3>
                <div className="space-y-3">
                  {bloodGroupData.map((item) => (
                    <div key={item.group} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {item.group}
                        </span>
                        <span className="text-gray-700">{item.group}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Requests</div>
                          <div className="font-semibold">{item.requests}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Donors</div>
                          <div className="font-semibold">{item.donors}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="bg-white rounded-isf-lg shadow-isf p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Donors by Region
                </h3>
                <div className="bg-gray-100 rounded-isf h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Regional heatmap visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-isf-lg shadow-isf p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search donors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Verification Table */}
            <div className="bg-white rounded-isf-lg shadow-isf overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Donor Verification Queue
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Group
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingVerifications.map((donor) => (
                      <tr key={donor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {donor.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {donor.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            {donor.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donor.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(donor.status)}`}>
                            {donor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donor.submittedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(donor.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(donor.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Recent Requests */}
            <div className="bg-white rounded-isf-lg shadow-isf overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Blood Requests
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Group
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hospital
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Urgency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.patientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            {request.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.units}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.hospital}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRequestStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.requestedDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}