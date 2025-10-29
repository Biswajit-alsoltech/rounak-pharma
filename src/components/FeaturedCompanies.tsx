'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion'; 


interface Manufacturer {
  id: number; 
  m_name: string;
  logo_image: string;
}

interface ManufacturerApiResponse {
  ma_id?: number;
  id?: number;
  m_name: string;
  logo_image: string;
}


const sectionVariants: Variants = { 
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const gridContainerVariants: Variants = { 
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// --- Reusable Skeleton Component ---
const LogoSkeleton = () => (
  <div className="bg-gray-200 h-24 w-full rounded-lg animate-pulse"></div>
);

// --- NEW Logo Item Component with Fallback ---
const LogoItem = ({ company }: { company: Manufacturer }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-24"
      variants={gridItemVariants}
      whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative h-16 w-full">
        {imageError ? (
          // Fallback UI: Display company name
          <div className="w-full h-full flex items-center justify-center text-center text-gray-500 text-sm font-semibold p-2">
            {company.m_name}
          </div>
        ) : (
          // Next.js Image
          <Image
            src={company.logo_image}
            alt={`${company.m_name} Logo`}
            fill
            className="object-contain"
            sizes="150px"
            unoptimized
            onError={() => {
              console.warn(`Failed to load image: ${company.logo_image}`);
              setImageError(true);
            }}
          />
        )}
      </div>
    </motion.div>
  );
};


// --- Main FeaturedCompanies Component ---
const FeaturedCompanies = () => {
  const [companies, setCompanies] = useState<Manufacturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch('/manufactures');

        if (response.success && Array.isArray(response.data)) {
          // Assuming the API response items have a unique 'ma_id' or 'id'
          // We map it to 'id' for our component's type
          const formattedData = response.data.map((item: ManufacturerApiResponse) => ({
            id: item.ma_id || item.id, 
            m_name: item.m_name,
            logo_image: item.logo_image,
          }));
          setCompanies(formattedData.slice(0, 6));

        } else {
          throw new Error('Failed to fetch company data.');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedCompanies();
  }, []);

  // Small update to ensure 'id' is present for the key
  useEffect(() => {
    if (!isLoading && companies.length > 0 && companies[0].id === undefined) {
      console.warn("Company data is missing a unique 'id' or 'ma_id'. Using index as key, but a unique ID is preferred.");
    }
  }, [isLoading, companies]);


  return (
    <motion.section
      className="bg-gray-50 py-16 md:py-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Trusted Partners We Deal With
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          We collaborate with the most reputable names in the pharmaceutical industry.
        </p>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto"
          variants={gridContainerVariants}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <LogoSkeleton key={index} />
              ))
            : error
            ? <div className="col-span-full text-red-500">
                <p>Could not load company logos at this time.</p>
              </div>
            : companies.map((company, index) => (
                // Use new LogoItem component
                <LogoItem 
                  key={company.id !== undefined ? company.id : index} // Use unique ID, fall back to index
                  company={company} 
                />
              ))}
        </motion.div>

        <div className="mt-12">
          <Link href="/we-deal-with" passHref>
            <motion.a
              className="inline-flex items-center bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Partners
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedCompanies;