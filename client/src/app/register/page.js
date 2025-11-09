'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, Droplets, MapPin, Calendar, Heart, CheckCircle, ChevronDown } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    emergencyContact: '',
    medicalConditions: '',
    lastDonation: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mobile-first responsive state and accordions
  const [isMobile, setIsMobile] = useState(true);
  const [personalOpen, setPersonalOpen] = useState(true);
  const [addressOpen, setAddressOpen] = useState(false);
  const [medicalOpen, setMedicalOpen] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      const isM = typeof window !== 'undefined' ? window.innerWidth < 768 : true;
      setIsMobile(isM);
      if (!isM) {
        // On desktop/tablet keep all sections expanded
        setPersonalOpen(true);
        setAddressOpen(true);
        setMedicalOpen(true);
      }
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      setShowSuccess(true);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-6 md:py-8" aria-live="polite">
        <div className="max-w-md mx-auto px-4 ">
          <div className="bg-white rounded-isf-lg shadow-isf p-6 md:p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              Registration Successful!
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6">
              Thank you for joining our life-saving network. Your application is under review and you'll be notified once verified.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 min-h-[48px] rounded-isf font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 md:py-8  mt-14 sm:mt-0 md:mt-0">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full mx-auto mb-3 md:mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-2">
            Become a Blood Donor
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Join our network of life-saving heroes and help save lives in your community
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6" aria-describedby="form-instructions">
            {/* Personal Information */}
            <details open={!isMobile ? true : personalOpen} className="group">
              <summary
                className="list-none cursor-pointer flex items-center justify-between mb-3 md:mb-4 px-3 py-3 md:px-0 md:py-0 rounded-isf md:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={(e) => { if (!isMobile) return; e.preventDefault(); setPersonalOpen(!personalOpen); }}
                aria-expanded={!isMobile ? true : personalOpen}
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Personal Information</h3>
                <ChevronDown className="w-5 h-5 text-gray-500 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">{errors.phone}</p>
                  )}
                </div>

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
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent min-h-[48px] ${
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
                    <p id="bloodGroup-error" className="mt-1 text-sm text-red-600" role="alert">{errors.bloodGroup}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent min-h-[48px] ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={!!errors.dateOfBirth}
                    aria-describedby={errors.dateOfBirth ? 'dob-error' : undefined}
                  />
                  {errors.dateOfBirth && (
                    <p id="dob-error" className="mt-1 text-sm text-red-600" role="alert">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent min-h-[48px] ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={!!errors.gender}
                    aria-describedby={errors.gender ? 'gender-error' : undefined}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p id="gender-error" className="mt-1 text-sm text-red-600" role="alert">{errors.gender}</p>
                  )}
                </div>
              </div>
            </details>

            {/* Address Information */}
            <details open={!isMobile ? true : addressOpen} className="group">
              <summary
                className="list-none cursor-pointer flex items-center justify-between mb-3 md:mb-4 px-3 py-3 md:px-0 md:py-0 rounded-isf md:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={(e) => { if (!isMobile) return; e.preventDefault(); setAddressOpen(!addressOpen); }}
                aria-expanded={!isMobile ? true : addressOpen}
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Address Information</h3>
                <ChevronDown className="w-5 h-5 text-gray-500 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full address"
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? 'address-error' : undefined}
                  />
                  {errors.address && (
                    <p id="address-error" className="mt-1 text-sm text-red-600" role="alert">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your city"
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                  />
                  {errors.city && (
                    <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">{errors.city}</p>
                  )}
                </div>
              </div>
            </details>

            {/* Medical Information */}
            <details open={!isMobile ? true : medicalOpen} className="group">
              <summary
                className="list-none cursor-pointer flex items-center justify-between mb-3 md:mb-4 px-3 py-3 md:px-0 md:py-0 rounded-isf md:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={(e) => { if (!isMobile) return; e.preventDefault(); setMedicalOpen(!medicalOpen); }}
                aria-expanded={!isMobile ? true : medicalOpen}
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Medical Information</h3>
                <ChevronDown className="w-5 h-5 text-gray-500 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Emergency contact number"
                  />
                </div>

                <div>
                  <label htmlFor="lastDonation" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Donation Date
                  </label>
                  <input
                    type="date"
                    id="lastDonation"
                    name="lastDonation"
                    value={formData.lastDonation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent min-h-[48px]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions (Optional)
                </label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-isf focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Please list any medical conditions or medications"
                />
              </div>
            </details>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start space-x-3 py-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                  aria-invalid={!!errors.agreeToTerms}
                  aria-describedby={errors.agreeToTerms ? 'terms-error' : undefined}
                />
                <span className="text-sm md:text-base text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary hover:text-primary-dark">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </a>
                  . I confirm that the information provided is accurate and I am eligible to donate blood.
                </span>
              </label>
              {errors.agreeToTerms && (
                <p id="terms-error" className="mt-1 text-sm text-red-600" role="alert">{errors.agreeToTerms}</p>
              )}
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
                  Submitting Registration...
                </div>
              ) : (
                'Register as Donor'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}