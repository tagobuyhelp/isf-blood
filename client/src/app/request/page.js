'use client';

import { useState, useEffect } from 'react';
import { Heart, User, Phone, Droplets, Building, MapPin, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

export default function RequestPage() {
  const [formData, setFormData] = useState({
    patientName: '',
    contactNumber: '',
    bloodGroup: '',
    unitsNeeded: '',
    hospitalName: '',
    area: '',
    urgencyLevel: 'normal'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mobile-first accordion controls
  const [isMobile, setIsMobile] = useState(true);
  const [patientOpen, setPatientOpen] = useState(true);
  const [requestOpen, setRequestOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : true;
      setIsMobile(mobile);
      if (!mobile) {
        setPatientOpen(true);
        setRequestOpen(true);
        setLocationOpen(true);
      }
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    if (!formData.unitsNeeded.trim()) {
      newErrors.unitsNeeded = 'Number of units is required';
    } else if (isNaN(formData.unitsNeeded) || parseInt(formData.unitsNeeded) < 1) {
      newErrors.unitsNeeded = 'Please enter a valid number of units';
    }

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area/District is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    // Reset form
    setFormData({
      patientName: '',
      contactNumber: '',
      bloodGroup: '',
      unitsNeeded: '',
      hospitalName: '',
      area: '',
      urgencyLevel: 'normal'
    });
  };

  return (
    <div className="min-h-screen bg-background py-6 md:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-0 md:mt-0">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full mx-auto mb-3 md:mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-2">
            Request for Blood
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Fill out the form below to request blood from nearby donors
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Patient Name */}
            <details open={!isMobile ? true : patientOpen} className="group">
              <summary
                className="list-none cursor-pointer flex items-center justify-between mb-3 md:mb-4 px-3 py-3 md:px-0 md:py-0 rounded-isf md:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={(e) => { if (!isMobile) return; e.preventDefault(); setPatientOpen(!patientOpen); }}
                aria-expanded={!isMobile ? true : patientOpen}
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Patient Details</h3>
                <ChevronDown className="w-5 h-5 text-gray-500 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>

              {/* Patient Name */}
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Patient Name *
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                    errors.patientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter patient's full name"
                  aria-invalid={!!errors.patientName}
                  aria-describedby={errors.patientName ? 'patientName-error' : undefined}
                />
                {errors.patientName && (
                  <p id="patientName-error" className="mt-1 text-sm text-red-600 flex items-center" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.patientName}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div className="mt-4">
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact number"
                  aria-invalid={!!errors.contactNumber}
                  aria-describedby={errors.contactNumber ? 'contactNumber-error' : undefined}
                />
                {errors.contactNumber && (
                  <p id="contactNumber-error" className="mt-1 text-sm text-red-600 flex items-center" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </details>

            {/* Blood Group and Units Needed */}
            <details open={!isMobile ? true : requestOpen} className="group">
              <summary
                className="list-none cursor-pointer flex items-center justify-between mb-3 md:mb-4 px-3 py-3 md:px-0 md:py-0 rounded-isf md:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={(e) => { if (!isMobile) return; e.preventDefault(); setRequestOpen(!requestOpen); }}
                aria-expanded={!isMobile ? true : requestOpen}
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Request Details</h3>
                <ChevronDown className="w-5 h-5 text-gray-500 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
                    <Droplets className="w-4 h-4 inline mr-2" />
                    Blood Group *
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 min-h-[48px] ${
                      errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={!!errors.bloodGroup}
                    aria-describedby={errors.bloodGroup ? 'bloodGroup-error' : undefined}
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p id="bloodGroup-error" className="mt-1 text-sm text-red-600 flex items-center" role="alert">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.bloodGroup}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="unitsNeeded" className="block text-sm font-medium text-gray-700 mb-2">
                    Units Needed *
                  </label>
                  <input
                    type="number"
                    id="unitsNeeded"
                    name="unitsNeeded"
                    value={formData.unitsNeeded}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                      errors.unitsNeeded ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Number of units"
                    aria-invalid={!!errors.unitsNeeded}
                    aria-describedby={errors.unitsNeeded ? 'unitsNeeded-error' : undefined}
                  />
                  {errors.unitsNeeded && (
                    <p id="unitsNeeded-error" className="mt-1 text-sm text-red-600 flex items-center" role="alert">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.unitsNeeded}
                    </p>
                  )}
                </div>
              </div>

              {/* Urgency Level */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Urgency Level
                </label>
                <div className="flex flex-col sm:flex-row sm:space-x-4 gap-3 sm:gap-0">
                  <label className="flex items-center px-3 py-3 rounded-isf border border-gray-300 cursor-pointer min-h-[48px]">
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value="normal"
                      checked={formData.urgencyLevel === 'normal'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      aria-label="Urgency level normal"
                    />
                    <span className="ml-2 text-gray-700 text-sm md:text-base">Normal</span>
                  </label>
                  <label className="flex items-center px-3 py-3 rounded-isf border border-gray-300 cursor-pointer min-h-[48px]">
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value="emergency"
                      checked={formData.urgencyLevel === 'emergency'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      aria-label="Urgency level emergency"
                    />
                    <span className="ml-2 text-gray-700 text-sm md:text-base">Emergency</span>
                  </label>
                </div>
              </div>
            </details>

            {/* Hospital Name */}
            <details open={!isMobile ? true : locationOpen} className="group">
              <summary
                className="list-none cursor-pointer flex items-center justify-between mb-3 md:mb-4 px-3 py-3 md:px-0 md:py-0 rounded-isf md:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={(e) => { if (!isMobile) return; e.preventDefault(); setLocationOpen(!locationOpen); }}
                aria-expanded={!isMobile ? true : locationOpen}
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Location</h3>
                <ChevronDown className="w-5 h-5 text-gray-500 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>

              {/* Hospital Name */}
              <div>
                <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Hospital Name *
                </label>
                <input
                  type="text"
                  id="hospitalName"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                    errors.hospitalName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter hospital name"
                  aria-invalid={!!errors.hospitalName}
                  aria-describedby={errors.hospitalName ? 'hospitalName-error' : undefined}
                />
                {errors.hospitalName && (
                  <p id="hospitalName-error" className="mt-1 text-sm text-red-600 flex items-center" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.hospitalName}
                  </p>
                )}
              </div>

              {/* Area/District */}
              <div className="mt-4">
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Area / District *
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter area or district"
                  aria-invalid={!!errors.area}
                  aria-describedby={errors.area ? 'area-error' : undefined}
                />
                {errors.area && (
                  <p id="area-error" className="mt-1 text-sm text-red-600 flex items-center" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.area}
                  </p>
                )}
              </div>
            </details>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Urgency Level
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="urgencyLevel"
                    value="normal"
                    checked={formData.urgencyLevel === 'normal'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Normal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="urgencyLevel"
                    value="emergency"
                    checked={formData.urgencyLevel === 'emergency'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Emergency</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 md:py-4 px-6 min-h-[48px] rounded-isf font-semibold text-base md:text-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center" role="status" aria-live="polite">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Request...
                </div>
              ) : (
                'Request Blood'
              )}
            </button>
          </form>
        </div>

        {/* Emergency Notice */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-isf p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Emergency Notice
              </h3>
              <p className="text-sm text-red-700">
                For life-threatening emergencies, please contact emergency services immediately. 
                This platform is designed to supplement, not replace, emergency medical care.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="request-confirmation-title">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-isf-lg">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 id="request-confirmation-title" className="text-base md:text-lg font-medium text-gray-900 mb-2">
                  Request Sent Successfully!
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6">
                  Your blood request has been sent to nearby donors. You will be contacted soon.
                </p>
                <button
                  onClick={handleCloseConfirmation}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 min-h-[48px] rounded-isf font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}