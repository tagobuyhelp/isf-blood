import { Heart, Shield, Users, Clock } from 'lucide-react';

export default function WhyDonateSection() {
  const benefits = [
    {
      icon: Heart,
      title: 'Saves up to 3 lives per donation',
      description: 'Each blood donation can be separated into components to help multiple patients'
    },
    {
      icon: Clock,
      title: 'Fast and safe process',
      description: 'Donation takes only 10-15 minutes with trained medical professionals'
    },
    {
      icon: Shield,
      title: 'Verified ISF network',
      description: 'All donors and recipients are verified through our secure platform'
    }
  ];

  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-gray-900 mb-4 sm:mb-6">
              Why Your Blood Donation Matters
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              The Indian Secular Front (ISF) connects voluntary blood donors with patients and hospitals in real-time. 
              Your donation through our verified network can make the difference between life and death for someone in need.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 sm:space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-full">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="mt-6 sm:mt-8">
              <a
                href="/register"
                className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-isf-lg font-semibold text-sm sm:text-base transition-colors duration-200 transform hover:scale-105"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Donating Today
              </a>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative">
            {/* Main Illustration Container */}
            <div className="relative bg-gradient-to-br from-red-50 to-pink-50 rounded-isf-lg p-6 sm:p-8 lg:p-12">
              {/* Central Blood Drop */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg">
                    <svg 
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8 6 8 10 8 12c0 2.21 1.79 4 4 4s4-1.79 4-4c0-2-0-6-4-10z"/>
                    </svg>
                  </div>
                  
                  {/* Floating Hearts */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-5 h-5 sm:w-6 sm:h-6 bg-red-400 rounded-full flex items-center justify-center animate-pulse delay-300">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Surrounding Elements */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="bg-white rounded-isf p-3 sm:p-4 shadow-sm">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-[11px] sm:text-xs text-gray-600">Donors</div>
                </div>
                <div className="bg-white rounded-isf p-3 sm:p-4 shadow-sm">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-[11px] sm:text-xs text-gray-600">Lives Saved</div>
                </div>
                <div className="bg-white rounded-isf p-3 sm:p-4 shadow-sm">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-[11px] sm:text-xs text-gray-600">Verified</div>
                </div>
              </div>

              {/* Heartbeat Line */}
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 opacity-20">
                <svg className="w-full h-6 sm:h-8" viewBox="0 0 400 40" fill="none">
                  <path 
                    d="M0 20 L50 20 L60 10 L70 30 L80 5 L90 35 L100 20 L400 20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary/20 rounded-full"></div>
            <div className="absolute -bottom-6 -right-6 w-10 h-10 sm:w-12 sm:h-12 bg-red-200/50 rounded-full"></div>
            <div className="absolute top-1/4 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-pink-300/40 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}