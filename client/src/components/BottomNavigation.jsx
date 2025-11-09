'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Search, User } from 'lucide-react';

export default function BottomNavigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
      active: pathname === '/'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      href: '/messages',
      active: pathname === '/messages'
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      href: '/donors',
      active: pathname === '/donors'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '/profile',
      active: pathname === '/profile'
    }
  ];

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 md:hidden"></div>
      
      {/* Bottom Navigation - Only visible on mobile */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                  item.active
                    ? 'text-primary bg-red-50'
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <IconComponent className={`w-5 h-5 ${item.active ? 'text-primary' : 'text-gray-500'}`} />
                  {item.id === 'messages' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  item.active ? 'text-primary' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}