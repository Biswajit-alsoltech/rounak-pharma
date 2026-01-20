'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { apiFetch } from "@/lib/api";

// --- Type Definitions ---
interface Button {
  text: string;
  link: string;
}



interface Banner {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  buttons?: Button[] | null; // Updated to handle multiple buttons
}

interface ApiBanner {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  button_text?: string | null;
  button_link?: string | null;
}

// --- Fallback Data ---
const fallbackBanners: Banner[] = [
  {
    id: 0,
    title: "Your Trusted Partner in Health Since 1989",
    subtitle: "From 6 authorized stockists on Day 1 to over 200+ marketers today, we deliver excellence.",
    image_url: "/images/hero-fallback.jpg",
    buttons: [
        { text: "Explore Products", link: "/products" },
        { text: "About Us", link: "/about" },
    ],
  },
];

// --- Main Hero Section Component ---
const HeroSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch("/banners");
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Map API response to our new Banner interface
          const formattedBanners = res.data.map((banner: ApiBanner) => {
            const bannerButtons: Button[] = [];
            // Create a button only if both text and a valid link are provided
            if (banner.button_text && typeof banner.button_link === 'string' && banner.button_link.trim() !== '') {
              bannerButtons.push({ text: banner.button_text, link: banner.button_link });
            }
            return {
              id: banner.id,
              title: banner.title,
              subtitle: banner.subtitle,
              image_url: banner.image_url,
              buttons: bannerButtons,
            };
          });
          setBanners(formattedBanners);
        } else {
          setBanners(fallbackBanners);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        setBanners(fallbackBanners);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full h-[60vh] md:h-[85vh] bg-slate-200 animate-pulse"></section>
    );
  }

  const activeBanners = banners.length > 0 ? banners : fallbackBanners;
// text sujit
  return (
    <section className="w-full relative overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {activeBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative flex-[0_0_100%] h-[60vh] md:h-[85vh] flex items-center justify-start text-white"
          >
            <Image
              src={banner.image_url}
              alt={banner.title}
              fill
              className="object-cover"
              priority={banner.id === activeBanners[0]?.id}
            />
            {/* UPDATED: Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
            
            <motion.div
              key={banner.id} // Animate content when banner ID changes
              className="relative z-10 text-left px-8 sm:px-12 md:px-24 max-w-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="text-lg md:text-xl mb-8 drop-shadow-md max-w-2xl">
                  {banner.subtitle}
                </p>
              )}
              {/* --- DYNAMIC BUTTONS --- */}
              {banner.buttons && banner.buttons.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-8">
                  {banner.buttons.map((button, index) => (
                    <Link
                      key={index}
                      href={button.link}
                      className={`font-semibold px-6 py-2 rounded-full text-lg transition-all transform hover:scale-105 inline-block shadow-lg ${
                        index === 0
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-white/20 text-white backdrop-blur-sm border border-white/40 hover:bg-white/30'
                      }`}
                    >
                      {button.text}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
      
      {/* --- Upgraded Navigation Dots --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;