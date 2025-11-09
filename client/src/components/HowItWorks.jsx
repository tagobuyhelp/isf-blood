import { UserCheck, MapPin, Heart, UserPlus, Search, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: UserCheck,
      title: 'Register / Verify',
      description: 'Become a donor',
      details: 'Sign up and get verified as a trusted blood donor in our network'
    },
    {
      id: 2,
      icon: MapPin,
      title: 'Search & Match',
      description: 'Location-based donor matching',
      details: 'Find nearby donors or patients based on blood type and location'
    },
    {
      id: 3,
      icon: Heart,
      title: 'Donate & Save Lives',
      description: 'Confirm donation and receive certificate',
      details: 'Complete the donation process and get recognition for saving lives'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Join our life-saving network in three simple steps
          </p>
        </div>

        {/* Mobile: Horizontal Scroll Steps */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory">
          <div className="flex gap-4 items-stretch">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="snap-center min-w-[260px]">
                  <div className="bg-white rounded-isf-lg shadow-isf p-4 text-left border border-gray-100 min-h-[220px] flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {step.id}
                      </div>
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-primary text-sm font-medium mb-1">{step.description}</p>
                    <p className="text-gray-600 text-sm leading-snug">{step.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop/Tablet: Redesigned 3-card horizontal layout with CTA below */}
        <div className="hidden md:block">
          {/* Horizontal steps (3-column grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.id}
                  className="group bg-white rounded-isf-lg shadow-isf hover:shadow-lg transition-all duration-300 p-6 text-left border border-gray-100 hover:border-primary/20 min-h-[220px]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.id}
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-primary font-medium mb-2">{step.description}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.details}</p>
                </div>
              );
            })}
          </div>

          {/* CTA below the grid (desktop/tablet only) */}
          <div className="mt-10 flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 mb-4">Ready to start saving lives?</p>
            <div className="flex flex-row gap-3 justify-center">
              <a
                href="/register"
                className="group bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-isf-lg font-semibold text-sm transition-colors duration-200 inline-flex items-center space-x-1.5 whitespace-nowrap"
                aria-label="Get Started"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="shrink-0">Get Started</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="/donors"
                className="group border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-isf-lg font-semibold text-sm transition-all duration-200 inline-flex items-center space-x-1.5 whitespace-nowrap"
                aria-label="Find Donors"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="shrink-0">Find Donors</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden text-center mt-8">
          <p className="text-gray-600 mb-4">Ready to start saving lives?</p>
          <div className="flex gap-3 justify-center">
            <a
              href="/register"
              className="group bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-isf-lg font-semibold text-sm transition-colors duration-200 inline-flex items-center space-x-1.5 whitespace-nowrap"
              aria-label="Get Started"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span className="shrink-0">Get Started</span>
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href="/donors"
              className="group border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-isf-lg font-semibold text-sm transition-all duration-200 inline-flex items-center space-x-1.5 whitespace-nowrap"
              aria-label="Find Donors"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="shrink-0">Find Donors</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}