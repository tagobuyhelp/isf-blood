"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Heart, Users, Clock, UserPlus, LifeBuoy, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const heroImages = [
    { src: '/assets/hero-blood-donation-scene.png', alt: 'Blood donation scene' },
    { src: '/assets/hero-blood-donation-center.png', alt: 'Blood donation center' },
    { src: '/assets/hero-community-donation-camp.png', alt: 'Volunteer donating blood' },
    { src: '/assets/hero-doctor-holding-blood-bag.png', alt: 'Doctor holding a blood bag' },
    { src: '/assets/hero-nurse-assisting-donor.png', alt: 'Nurse assisting a donor' },
    { src: '/assets/hero-young-volunteers-group.png', alt: 'Young volunteers group' },

  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isPaused, heroImages.length]);

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-dark overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-5 w-20 h-20 bg-white rounded-full blur-2xl lg:top-20 lg:left-10 lg:w-32 lg:h-32 lg:blur-3xl"></div>
        <div className="absolute bottom-10 right-5 w-24 h-24 bg-white rounded-full blur-2xl lg:bottom-20 lg:right-10 lg:w-48 lg:h-48 lg:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl lg:left-1/3 lg:w-24 lg:h-24 lg:blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 lg:py-12">
        {/* Ultra Compact Mobile Card */}
        <div className="lg:hidden mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-3 max-w-sm mx-auto">
            {/* Compact Image Carousel */}
            <div
              className="relative rounded-xl overflow-hidden mb-3 h-48"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {heroImages.map((img, idx) => (
                <Image
                  key={img.src + idx}
                  src={img.src}
                  alt={img.alt}
                  width={280}
                  height={192}
                  priority={idx === 0}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    idx === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              {/* Soft gradient overlay for readability */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              {/* Indicators */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {heroImages.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>
            </div>
            
            {/* Compact Title */}
            <h1 className="text-lg font-heading font-bold text-gray-900 mb-1 text-center">
              Save Lives Today
            </h1>
            
            {/* Inline Stats */}
            <div className="flex justify-center items-center gap-4 mb-3 text-xs">
              <div className="flex items-center text-primary">
                <Users className="w-3 h-3 mr-1" />
                <span className="font-semibold">1000+</span>
              </div>
              <div className="flex items-center text-primary">
                <Heart className="w-3 h-3 mr-1" />
                <span className="font-semibold">500+</span>
              </div>
              <div className="flex items-center text-primary">
                <Clock className="w-3 h-3 mr-1" />
                <span className="font-semibold">24/7</span>
              </div>
            </div>
            
            {/* Compact Action Buttons */}
            <div className="flex gap-2">
              <Link
                href="/register"
                className="flex-1 flex items-center justify-center bg-primary text-white py-2.5 rounded-xl font-semibold text-sm shadow-md"
                aria-label="Register as Donor"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Join Now
              </Link>
              <Link
                href="/request"
                className="flex-1 flex items-center justify-center border-2 border-primary text-primary py-2.5 rounded-xl font-semibold text-sm"
                aria-label="Request Blood"
              >
                <LifeBuoy className="w-4 h-4 mr-1" />
                Request
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop/Large Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
          {/* Text Content */}
          <div className="mb-6 lg:mb-0">
            {/* Mobile Hero Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-isf-lg p-4 mb-4 lg:bg-transparent lg:backdrop-blur-none lg:p-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white leading-tight mb-3">
                A Single Click Can{' '}
                <br className="hidden sm:block" />
                <span className="relative">
                  Save a Life
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white opacity-30 rounded-full lg:hidden"></div>
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6">
                Join ISF's life-saving network of verified blood donors today.
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link 
                  href="/register"
                  className="group bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-isf-lg font-semibold text-base transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  aria-label="Become a Donor"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Become a Donor</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link 
                  href="/request"
                  className="group border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-3 rounded-isf-lg font-semibold text-base transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                  aria-label="Request Blood"
                >
                  <LifeBuoy className="w-4 h-4" />
                  <span>Request Blood</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Stats - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 lg:mt-12 lg:pt-8 lg:border-t lg:border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full mb-2 lg:mb-3 mx-auto">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="text-lg lg:text-2xl font-bold text-white">1000+</div>
                <div className="text-white/80 text-xs lg:text-sm">Active Donors</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full mb-2 lg:mb-3 mx-auto">
                  <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="text-lg lg:text-2xl font-bold text-white">500+</div>
                <div className="text-white/80 text-xs lg:text-sm">Lives Saved</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full mb-2 lg:mb-3 mx-auto">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="text-lg lg:text-2xl font-bold text-white">24/7</div>
                <div className="text-white/80 text-xs lg:text-sm">Available</div>
              </div>
            </div>
          </div>

          {/* Illustration - Desktop side visual */}
          <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative">
              {/* Main Illustration Container using provided asset */}
              <div className="bg-white/10 rounded-isf-lg backdrop-blur-sm shadow-2xl overflow-hidden w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[420px]">
                <Image
                  src="/assets/hero-blood-donation-scene.png"
                  alt="Doctor assisting a donor during blood donation"
                  priority
                  width={420}
                  height={315}
                  className="w-full h-auto object-cover"
                  style={{ height: 'auto' }}
                />
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-white/30 rounded-full"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}