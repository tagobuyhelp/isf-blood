import { Heart, Users, ArrowRight, LifeBuoy } from 'lucide-react';

export default function JoinCTABanner() {
  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-gradient-to-r from-primary via-primary-dark to-primary relative overflow-hidden" aria-labelledby="join-cta-heading">
      {/* Background Illustration */}
      <div className="absolute inset-0 opacity-10">
        {/* Reduce decorative noise on mobile */}
        <div className="absolute top-10 left-10 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full blur-2xl hidden sm:block"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full blur-xl hidden sm:block"></div>
        
        {/* Subtle People Donating Illustration */}
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div className="flex items-center space-x-4">
            {/* Donor Silhouettes */}
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white/40" />
            </div>
            <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white/40" />
            </div>
            <div className="w-14 h-14 bg-white/25 rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-white/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Content */}
          <div className="max-w-3xl mx-auto">
            <h2 id="join-cta-heading" className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight">
              Join our community of{' '}
              <span className="relative">
                life-savers
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white opacity-30 rounded-full"></div>
              </span>
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed">
              Every donation counts. Every donor matters. Be part of something bigger than yourself 
              and help save lives in your community today.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">1000+</div>
                <div className="text-white/80 text-sm sm:text-base">Active Donors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">500+</div>
                <div className="text-white/80 text-sm sm:text-base">Lives Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                <div className="text-white/80 text-sm sm:text-base">Support Available</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a
                href="/register"
                className="group bg-white text-primary hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 rounded-isf-lg font-semibold text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                aria-label="Register as donor"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Register as Donor</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              
              <a
                href="/request"
                className="group border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-isf-lg font-semibold text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                aria-label="Request Blood Now"
              >
                <LifeBuoy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Request Blood Now</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>

            {/* Trust Indicators: Mobile accordion + desktop section */}
            {/* Mobile Accordion */}
            <div className="mt-8 md:hidden">
              <details className="rounded-isf-lg bg-white/10 p-3">
                <summary className="cursor-pointer text-white/90 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-isf">
                  Why trust ISF?
                </summary>
                <div className="mt-3 text-white/80">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">100% Verified</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Secure Platform</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">Life-Saving Network</span>
                  </div>
                </div>
              </details>
            </div>

            {/* Desktop Trust Indicators */}
            <div className="mt-10 pt-8 border-t border-white/20 hidden md:block" aria-label="Trust indicators">
              <p className="text-white/70 text-sm mb-4">
                Trusted by hospitals and medical centers worldwide
              </p>
              <div className="flex items-center justify-center space-x-6 text-white/60">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">100% Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Secure Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm">Life-Saving Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full h-10 sm:h-12 text-white" 
          fill="currentColor" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
          opacity=".25"
          ></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
          opacity=".5"
          ></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}