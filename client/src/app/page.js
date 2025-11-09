import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import NearbyDonorsWidget from '@/components/NearbyDonorsWidget';
import WhyDonateSection from '@/components/WhyDonateSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import JoinCTABanner from '@/components/JoinCTABanner';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <NearbyDonorsWidget />
      <WhyDonateSection />
      <TestimonialsSection />
      <JoinCTABanner />
    </div>
  );
}
