'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/api";
import { Search, AlertTriangle, ArrowRight } from "lucide-react";

// --- Type Definition ---
interface Manufacturer {
  ma_id: number;
  m_name: string;
  logo_image: string;
}

// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

// --- Reusable Skeleton Component ---
const LogoCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center border border-gray-100 animate-pulse h-full">
    <div className="w-24 h-24 mb-4 bg-gray-200 rounded-lg"></div>
    <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
  </div>
);

// --- Reusable Logo Card with Fallback ---
const LogoCard = ({ company }: { company: Manufacturer }) => {
  const [imageError, setImageError] = useState(false);

  // Get first two letters for fallback
  const fallbackText = company.m_name ? company.m_name.substring(0, 2).toUpperCase() : '??';

  return (
    <motion.div variants={gridItemVariants}>
      <Link href={`/we-deal-with/${company.m_name}`} passHref>
        <div className="block bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center border-t-4 border-transparent hover:border-blue-500 h-full transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
          
          {/* Image container with fallback logic */}
          <div className="relative w-24 h-24 mb-4 transition-transform duration-300 group-hover:scale-110">
            {imageError ? (
              // Fallback UI: First two letters
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg text-3xl font-bold">
                {fallbackText}
              </div>
            ) : (
              // Next.js Image
              <Image
                src={company.logo_image}
                alt={`${company.m_name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, 20vw"
                unoptimized
                onError={() => {
                  console.warn(`Failed to load image: ${company.logo_image}`);
                  setImageError(true);
                }}
              />
            )}
          </div>

          <h3 className="text-gray-800 font-semibold text-lg text-center">
            {company.m_name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};


// --- Main Page Component ---
const WeDealWith = () => {
  const [companies, setCompanies] = useState<Manufacturer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiFetch('/manufactures');

        if (response.success && Array.isArray(response.data)) {
          setCompanies(response.data);
        } else {
          throw new Error("Failed to fetch manufacturer data.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchManufacturers();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.m_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* --- Hero and Search Section --- */}
      <motion.section 
        className="py-20 text-center"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6 md:px-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
                Our Trusted Partners
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                We proudly collaborate with India’s leading pharmaceutical companies to ensure reliable and quality healthcare distribution.
            </p>
            <div className="max-w-xl mx-auto relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a company..."
                    className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>
            
            {/* --- Styled Button --- */}
            <Link href="/products" passHref>
                <motion.button
                    className="inline-flex items-center bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View All Products
                    <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
            </Link>
        </div>
      </motion.section>

      {/* --- Companies Grid Section --- */}
      <section className="pb-20">
        <div className="container mx-auto px-6 md:px-12">
            <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
            >
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, index) => <LogoCardSkeleton key={index} />)
                ) : error ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-red-600 bg-red-50 p-8 rounded-lg">
                        <AlertTriangle className="w-12 h-12 mb-4" />
                        <p className="font-semibold text-xl">Error Loading Data</p>
                        <p>{error}</p>
                    </div>
                ) : filteredCompanies.length > 0 ? (
                    // --- UPDATED to use new LogoCard component ---
                    filteredCompanies.map((company) => (
                      <LogoCard key={company.ma_id} company={company} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-16">
                        <p className="text-xl font-medium">No manufacturers found for &quot;{searchTerm}&quot;</p>
                        <p>Try adjusting your search.</p>
                    </div>
                )}
            </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default WeDealWith;