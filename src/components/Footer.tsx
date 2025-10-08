'use client';

import Link from 'next/link';
import { Phone, Mail, Facebook, Instagram, Twitter, MessageSquare as WhatsApp, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api'; 
import Image from 'next/image';

// --- Static Data ---
const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Delivery & Returns', href: '/delivery-returns' },
  { name: 'FAQs', href: '/faq' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Contact Us', href: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Shipping Policy', href: '/shipping-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'Refund Policy', href: '/refund-policy' },
];

// --- Type for our settings object ---
interface Settings {
  [key: string]: string;
}

const Footer = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch('/settings');
        if (response.success && Array.isArray(response.data)) {
          const settingsMap = response.data.reduce((acc: { [x: string]: any; }, item: { key: string | number; value: any; }) => {
            acc[item.key] = item.value;
            return acc;
          }, {} as Settings);
          setSettings(settingsMap);
        }
      } catch (error) {
        console.error("Failed to fetch footer settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const socialLinks = [
    { name: 'Facebook', api_key: 'facebook_url', icon: Facebook },
    { name: 'Instagram', api_key: 'instagram_url', icon: Instagram },
    { name: 'Twitter', api_key: 'x_url', icon: Twitter },
    { name: 'WhatsApp', api_key: 'whatsapp_no', icon: WhatsApp, isWhatsApp: true },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-slate-100 w-full text-slate-600">
      <div className="container mx-auto px-6 md:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Company Info & Socials */}
          <div className="md:col-span-2 lg:col-span-1">
             <div className="mb-4">
               {/* Replace with your logo */}
               <Image src="/images/Rounak_pharma_logo.png" alt="Rounak Pharma Logo" width={100} height={20} />
             </div>
             <p className="text-sm mb-6 max-w-sm">
                {settings.footer_text}
             </p>
             <div className="flex items-center space-x-3">
              {isLoading ? (
                <div className="flex space-x-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="w-9 h-9 bg-slate-200 rounded-full animate-pulse"></div>)}
                </div>
              ) : (
                socialLinks.map((social) => {
                  const url = social.isWhatsApp 
                    ? `https://wa.me/91${settings[social.api_key]}` 
                    : settings[social.api_key];

                  if (!settings[social.api_key]) return null;

                  return (
                    <a
                      key={social.name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-slate-500 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-300 shadow-sm"
                      aria-label={social.name}
                    >
                      <social.icon size={20} />
                    </a>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-slate-800">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-indigo-600 hover:underline transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-slate-800">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-indigo-600 hover:underline transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-slate-800">Contact Us</h3>
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
                <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
              </div>
            ) : (
              <ul className="space-y-4">
                {settings.whatsapp_no && (
                   <li className="flex items-start space-x-3">
                     <Phone size={18} className="mt-1 text-indigo-500 flex-shrink-0" />
                     <a href={`tel:+91${settings.whatsapp_no}`} className="hover:text-indigo-600">
                        +91 {settings.whatsapp_no}
                     </a>
                   </li>
                )}
                {/* Static Email - can be made dynamic if added to API */}
                <li className="flex items-start space-x-3">
                  <Mail size={18} className="mt-1 text-indigo-500 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-indigo-600">
                    {settings.email}
                  </a>
                </li>
              </ul>
            )}
          </div>

        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="border-t border-slate-200">
          <div className="container mx-auto px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm">
              <p>&copy; {new Date().getFullYear()} Rounak Pharma. All Rights Reserved.</p>
              <button 
                onClick={scrollToTop} 
                className="mt-4 sm:mt-0 flex items-center gap-2 hover:text-indigo-600 transition-colors"
                aria-label="Back to top"
              >
                Back to Top <ArrowUp size={16} />
              </button>
          </div>
      </div>
    </footer>
  );
};

export default Footer;