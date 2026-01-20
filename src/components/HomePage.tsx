'use client';

import Image from 'next/image';
import { Leaf, Users, Building, Store, ArrowRight } from 'lucide-react';
import Testimonials from './Testimonlials';
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import FeaturedCompanies from './FeaturedCompanies';
import { motion,Variants } from 'framer-motion'; 
import CoolTimelineSection from './CoolTimelineSection';
import Link from 'next/link';



interface ApiSetting {
  key: string;
  value: string;
}

interface Cater {
  id: number;
  title: string;
  image_url?: string | null;
  icon?: string | null;
}

const sectionVariants: Variants = { 
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

interface Settings {
  [key: string]: string;
}

const gridContainerVariants: Variants = { 
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const gridItemVariants: Variants = { 
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// --- Skeleton Component for "We Serve" ---
const CaterCardSkeleton = () => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
    <div className="mt-4 h-5 w-3/4 bg-gray-200 rounded"></div>
  </div>
);

const HomePage = () => {
  const [caters, setCaters] = useState<Cater[]>([]);
  const [isLoadingCaters, setIsLoadingCaters] = useState(true);
    const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    apiFetch('/caters')
      .then((res) => {
        if (res?.status && Array.isArray(res.data)) {
          setCaters(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingCaters(false));
  }, []);

    useEffect(() => {
    const fetchSettings = async () => {
      try {

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
      }
    };
    fetchSettings();
  }, []);

  const fallbackIcons: Record<string, string> = {
    Pharmacies: '/images/we_serve/pharmacies.png',
    NGOs: '/images/we_serve/ngos.png',
    'Retail Chain': '/images/we_serve/retail-chain.png',
    Distributers: '/images/we_serve/distributers.png',
    'PM-JAY': '/images/we_serve/pm-jay.png',
  };

  return (
    <main className="bg-white">
      {/* Section 1: Intro */}
      {/* <motion.section
        className="container mx-auto px-4 py-12 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <Image
              src="/images/doctor_art.png"
              alt="Pharmacist at counter"
              width={450}
              height={450}
              className="rounded-lg"
              priority
            />
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            variants={gridContainerVariants}
          >
            {[
              {
                icon: Leaf,
                title: 'Started with 6 Authorized Stockists',
                subtitle: 'Serving with integrity from Day 1.',
              },
              {
                icon: Users,
                title: 'Now Working with 200+ Marketers',
                subtitle: 'Trusted by leading pharma brands',
              },
              {
                icon: Building,
                title: 'Serving Pharmacies, Hospitals & NGOs',
                subtitle: 'End-to-end healthcare support.',
              },
              {
                icon: Store,
                title: 'Available on Pharmarack & Play Store',
                subtitle: 'Seamless digital integration.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center md:text-left p-4"
                variants={gridItemVariants}
              >
                <feature.icon className="w-10 h-10 text-blue-600 mx-auto md:mx-0 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section> */}

      <CoolTimelineSection/>

      {/* Section 2: We Serve (Dynamic) */}
      <motion.section
        className="relative bg-gray-50 py-10 md:py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Image
            src="/images/medicine-background.jpg"
            alt="Medicine Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-gray-800">We Serve</h2>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto"
            variants={gridContainerVariants}
          >
            {isLoadingCaters
              ? Array.from({ length: 5 }).map((_, i) => (
                  <CaterCardSkeleton key={i} />
                ))
              : caters.map((item) => {
                  const imageSrc =
                    item.image_url && item.image_url.includes('http')
                      ? item.image_url
                      : item.icon
                      ? `https://rounak.alsoltech.in/storage/${item.icon}`
                      : fallbackIcons[item.title] ||
                        '/images/we_serve/default.png';

                  return (
                    <motion.div
                      key={item.id}
                      className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                      variants={gridItemVariants}
                    >
                      <div className="w-20 h-20 relative">
                        <Image
                          src={imageSrc}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <p className="mt-4 font-semibold text-gray-700">
                        {item.title}
                      </p>
                    </motion.div>
                  );
                })}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Pharma rack Process */}
      <motion.section
        className="py-10 md:py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-3">
            We&apos;re Available on Pharmarack
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Seamless ordering and tracking through India’s trusted pharma platform.
          </p>
          <motion.div
            className="mt-8 flex flex-col md:flex-row items-center justify-center flex-wrap gap-y-8 md:gap-x-4 lg:gap-x-8"
            variants={gridContainerVariants}
          >
            {[
              { name: 'Login to Pharmarack', icon: 'login.png' },
              { name: 'Search for "Rounak Pharma"', icon: 'search.png' },
              { name: 'Map to Rounak Pharma', icon: 'mapping.png' },
              { name: 'Place order', icon: 'place-order.png' },
              { name: 'Delivery', icon: 'delivery.png' },
              
            ].map((step, index, arr) => (
              <React.Fragment key={step.name}>
                <motion.div
                  className="flex flex-col items-center w-40 text-center"
                  variants={gridItemVariants}
                >
                  <Image
                    src={`/images/process_new/${step.icon}`}
                    alt={step.name}
                    width={120}
                    height={120}
                  />
                  <p className="mt-3 font-medium text-gray-700">{step.name}</p>
                </motion.div>
                {index < arr.length - 1 && (
                  <motion.div variants={gridItemVariants}>
                    <ArrowRight className="text-gray-300 w-10 h-10 hidden md:block" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
          <div className="mt-12">
          <Link href={`${settings.connect_now_url}`} passHref>
            <motion.a
              className="inline-flex items-center bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Connect Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </Link>
        </div>
        </div>
      </motion.section>

      <FeaturedCompanies />
      <Testimonials />
    </main>
  );
};

export default HomePage;