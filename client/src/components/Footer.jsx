import Link from 'next/link';
import { Droplets, ChevronDown, Info, ShieldCheck, FileText, Phone, Users, Github, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white" aria-labelledby="site-footer-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Brand + Mission */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-10">
          {/* Branding */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span id="site-footer-heading" className="text-lg md:text-xl font-heading font-bold">
                ISF Blood Donor
              </span>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-md">
              Empowering humanity through life-saving technology.
              Connecting voluntary blood donors with patients and hospitals in real time.
            </p>
          </div>

          {/* Quick Links - Accordion on mobile */}
          <div className="md:col-span-1">
            <details className="group md:open" open>
              <summary className="list-none cursor-pointer flex items-center justify-between md:cursor-default md:pointer-events-none mb-2 md:mb-4">
                <h3 className="text-base md:text-lg font-heading font-semibold">Quick Links</h3>
                <ChevronDown className="w-5 h-5 text-gray-300 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="flex flex-col divide-y divide-gray-700/50 border border-gray-700/40 rounded-isf overflow-hidden">
                <Link href="/about" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <Info className="w-4 h-4" />
                  <span className="text-sm md:text-base">About</span>
                </Link>
                <Link href="/privacy" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm md:text-base">Privacy Policy</span>
                </Link>
                <Link href="/terms" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm md:text-base">Terms of Use</span>
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm md:text-base">Contact</span>
                </Link>
              </div>
            </details>
          </div>

          {/* Services - Accordion on mobile */}
          <div className="md:col-span-1">
            <details className="group md:open" open>
              <summary className="list-none cursor-pointer flex items-center justify-between md:cursor-default md:pointer-events-none mb-2 md:mb-4">
                <h3 className="text-base md:text-lg font-heading font-semibold">Services</h3>
                <ChevronDown className="w-5 h-5 text-gray-300 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="flex flex-col divide-y divide-gray-700/50 border border-gray-700/40 rounded-isf overflow-hidden">
                <Link href="/donors" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <Users className="w-4 h-4" />
                  <span className="text-sm md:text-base">Find Donors</span>
                </Link>
                <Link href="/request" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <Droplets className="w-4 h-4" />
                  <span className="text-sm md:text-base">Request Blood</span>
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm md:text-base">Become a Donor</span>
                </Link>
                <Link href="/emergency" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm md:text-base">Emergency</span>
                </Link>
              </div>
            </details>
          </div>

          {/* Contact & Social - Accordion on mobile */}
          <div className="md:col-span-1">
            <details className="group md:open" open>
              <summary className="list-none cursor-pointer flex items-center justify-between md:cursor-default md:pointer-events-none mb-2 md:mb-4">
                <h3 className="text-base md:text-lg font-heading font-semibold">Contact & Social</h3>
                <ChevronDown className="w-5 h-5 text-gray-300 md:hidden transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="flex flex-col divide-y divide-gray-700/50 border border-gray-700/40 rounded-isf overflow-hidden">
                <a href="tel:+8801700000000" aria-label="Call ISF support at +8801700000000" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm md:text-base">+880 1700-000000</span>
                </a>
                <a href="mailto:support@isf-blood.org" aria-label="Email ISF support" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm md:text-base">support@isf-blood.org</span>
                </a>
                <a href="https://maps.google.com/?q=ISF%20Blood%20Donor" target="_blank" rel="noopener noreferrer" aria-label="Open ISF location in maps" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-3 md:px-0 md:py-2 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm md:text-base">Find us on Maps</span>
                </a>
                
              </div>
            </details>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="border-t border-gray-700 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Social icons */}
            <div className="flex items-center gap-3" aria-label="Social links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-12 h-12 min-w-12 min-h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-12 h-12 min-w-12 min-h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-12 h-12 min-w-12 min-h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2025 International Social Forum (ISF). All rights reserved.</p>
              <p className="text-gray-400 text-sm">
                Developed by <span className="text-primary font-medium">Tarik Aziz</span> — Full Stack Software Engineer
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}