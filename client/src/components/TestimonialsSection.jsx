'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, MessageCircle, Search, ArrowRight } from 'lucide-react';

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Verma',
      location: 'Delhi',
      bloodGroup: 'O+',
      quote: 'Thanks to ISF, I found an O+ donor in under 20 minutes. The platform saved my father\'s life during his emergency surgery.',
      rating: 5,
      avatar: 'RV'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      location: 'Mumbai',
      bloodGroup: 'A-',
      quote: 'Being a donor through ISF has been incredibly rewarding. I\'ve helped save 8 lives so far and the process is always smooth and professional.',
      rating: 5,
      avatar: 'PS'
    },
    {
      id: 3,
      name: 'Dr. Arjun Iyer',
      location: 'Bengaluru',
      bloodGroup: 'B+',
      quote: 'As a hospital administrator, ISF has revolutionized how we connect with blood donors. The verification system gives us complete confidence.',
      rating: 5,
      avatar: 'AI'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Collapse quote when slide changes (mobile UX)
  useEffect(() => {
    setIsExpanded(false);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gray-50" role="region" aria-label="Testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-3 sm:mb-4">
            Stories That Inspire
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from our community of donors and recipients
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto" aria-roledescription="carousel" aria-live="polite">
          <div className="overflow-hidden rounded-isf-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-isf-lg shadow-isf p-5 sm:p-8 lg:p-12 mx-2">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <div className="text-center mb-6 sm:mb-8">
                      <blockquote className={`text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mx-auto ${isExpanded ? '' : 'max-h-24 overflow-hidden'}`}>
                        "{testimonial.quote}"
                      </blockquote>
                      {/* Expand/Collapse for mobile */}
                      <button
                        type="button"
                        className="md:hidden mt-3 inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-isf"
                        aria-expanded={isExpanded}
                        onClick={() => setIsExpanded((v) => !v)}
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-5 sm:mb-6" aria-label={`Rating ${testimonial.rating} out of 5`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-center space-x-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                        {testimonial.avatar}
                      </div>
                      
                      {/* Details */}
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2">
                          {testimonial.location}
                        </p>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getBloodGroupColor(testimonial.bloodGroup)}`}>
                          {testimonial.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full w-12 h-12 sm:w-auto sm:h-auto p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 text-gray-600 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 mx-auto" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full w-12 h-12 sm:w-auto sm:h-auto p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 text-gray-600 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 mx-auto" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <p className="text-gray-600 text-sm sm:text-base mb-5 sm:mb-6">
            Join thousands of satisfied users in our life-saving community
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/register"
              className="group bg-primary hover:bg-primary-dark text-white px-6 py-3 sm:px-8 sm:py-3 rounded-isf-lg font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center space-x-2 min-h-[48px]"
              aria-label="Share your testimonial"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Share Your Story</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href="/donors"
              className="group border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 sm:px-8 sm:py-3 rounded-isf-lg font-semibold text-sm sm:text-base transition-all duration-200 flex items-center space-x-2 min-h-[48px]"
              aria-label="Find donors near you"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Find Donors</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}