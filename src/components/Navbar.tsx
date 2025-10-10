'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  MapPin,
  Mail,
  ShoppingCart,
  MessageCircle,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';


interface Settings {
  [key: string]: string;
}

interface ApiSetting {
  key: string;
  value: string;
}

const Navbar = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch('/settings');
        if (response.success && Array.isArray(response.data)) {
          const settingsMap = response.data.reduce((acc: Settings, item: ApiSetting) => {
            acc[item.key] = item.value;
            return acc;
          }, {} as Settings);
          setSettings(settingsMap);
        }
      } catch (error) {
        console.error("Failed to fetch navbar settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'We Deal With', href: '/we-deal-with' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      {/* === Top Contact Bar === */}
      <div className="bg-slate-700 text-white text-xs md:text-sm py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <>
                <div className="h-4 w-24 bg-slate-600 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-600 rounded animate-pulse hidden md:block"></div>
              </>
            ) : (
              <>
                {settings.contact_no && (
                  <a href={`tel:${settings.contact_no}`} className="flex items-center hover:text-gray-300 transition">
                    <Phone size={15} className="mr-2" />
                    <span>{settings.contact_no}</span>
                  </a>
                )}
                {settings.address && (
                  <div className="hidden md:flex items-center">
                    <MapPin size={15} className="mr-2" />
                    <span>{settings.address}</span>
                  </div>
                )}
              </>
            )}
          </div>
          {isLoading ? (
            <div className="h-4 w-40 bg-slate-600 rounded animate-pulse"></div>
          ) : (
            settings.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center hover:text-gray-300 transition">
                <Mail size={15} className="mr-2" />
                <span>{settings.email}</span>
              </a>
            )
          )}
        </div>
      </div>

      {/* === Main Navigation === */}
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 relative">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/Rounak_pharma_logo.png"
              alt="Rounak Pharma Logo"
              width={80}
              height={25}
              priority
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 text-slate-700 font-medium">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="hover:text-indigo-600 transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href={`${settings.place_order_url || '#'}`} aria-label="Place your order">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold flex items-center hover:bg-indigo-700 transition cursor-pointer">
              <ShoppingCart size={18} className="mr-2" />
              Place Order
            </button>
            </Link>
            <Link href={`https://wa.me/91${settings.whatsapp_no}`} target="_blank" rel="noopener noreferrer">
              <button className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center hover:bg-green-600 transition cursor-pointer">
                <MessageCircle size={18} className="mr-2" />
                Get in Touch
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 hover:text-indigo-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl mt-2 rounded-b-lg p-6 border-t border-slate-100"
            >
              <nav className="flex flex-col space-y-5">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-slate-700 font-medium text-lg hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t border-slate-200 pt-5 flex flex-col space-y-3">
                  <Link href={settings.place_order_url || '#'} aria-label="Place your order">
                    <button className="bg-indigo-600 text-white w-full px-4 py-3 rounded-full font-semibold flex items-center justify-center hover:bg-indigo-700 transition">
                      <ShoppingCart size={18} className="mr-2" />
                      Place Order
                    </button>
                  </Link>

                  <Link href={`https://wa.me/91${settings.whatsapp_no}`} target="_blank" rel="noopener noreferrer">
                    <button className="bg-green-500 text-white w-full px-4 py-3 rounded-full font-semibold flex items-center justify-center hover:bg-green-600 transition">
                      <MessageCircle size={18} className="mr-2" />
                      Get in Touch
                    </button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </header>
  );
};

export default Navbar;