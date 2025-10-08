'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/api";
import { motion, Variants } from "framer-motion";
import { Target, Eye } from "lucide-react"; // Icons for sections

// --- Configuration ---
// IMPORTANT: Replace with the actual base URL where your images are stored.
const BASE_IMAGE_URL = "https://rounak.alsoltech.in/public/about/"; 

// --- Type Definition for API Data ---
interface AboutData {
  history_content: string;
  vision: string;
  mission: string;
  image: string; // Added image field
}

// --- Fallback Content ---
const fallbackData: AboutData = {
  history_content: "Since 1992, Rounak Pharma has grown from 6 stockists to partnering with 200+ pharma marketers. We are committed to delivering trusted healthcare support to pharmacies, hospitals, and NGOs with integrity and care.",
  vision: "To become India’s most reliable pharma distributor, delivering health and care with transparency, innovation, and unwavering commitment to quality.",
  mission: "To ensure the seamless and timely delivery of quality pharmaceutical products across the nation, leveraging technology and a robust, efficient supply chain.",
  image: "ronak_group_building.jpg" // Fallback image filename
};

// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const gridItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// --- Reusable Skeleton Components ---
const HeroSkeleton = () => (
    <div className="text-center animate-pulse">
        <div className="h-12 w-3/4 bg-gray-200 rounded-md mx-auto mb-6"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded-md mx-auto"></div>
    </div>
);

const LegacySkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center animate-pulse">
        <div className="w-full h-[400px] bg-gray-200 rounded-xl"></div>
        <div className="space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded-md"></div>
            <div className="h-5 w-full bg-gray-200 rounded-md"></div>
            <div className="h-5 w-full bg-gray-200 rounded-md"></div>
            <div className="h-5 w-4/5 bg-gray-200 rounded-md"></div>
        </div>
    </div>
);

const PrinciplesSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        {Array.from({ length: 2 }).map((_, i) => (
             <div key={i} className="bg-white p-8 rounded-xl shadow-md space-y-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-1/2 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
            </div>
        ))}
    </div>
);

// --- Main About Us Component ---
const AboutUs = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch("/about");
        if (response.success && response.data && response.data.length > 0) {
          setAboutData(response.data[0]);
        } else {
          setAboutData(fallbackData); // Use fallback if API returns empty
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err);
        setAboutData(fallbackData); // Use fallback on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  // Use fetched data if available, otherwise use fallback
  const displayData = aboutData || fallbackData;
  
  // Construct image URL safely
  const imageUrl = displayData.image.startsWith('http') 
    ? displayData.image 
    : (aboutData ? `${BASE_IMAGE_URL}${displayData.image}` : `/images/${fallbackData.image}`);

  return (
    <main>
      <Navbar />
      {/* --- Hero Section --- */}
      <section className="bg-blue-50 py-20 md:py-24">
          <div className="container mx-auto px-6 md:px-12 text-center">
            {isLoading ? <HeroSkeleton /> : (
                <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
                        About Rounak Pharma
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Delivering Health and Trust Since 1992
                    </p>
                </motion.div>
            )}
          </div>
      </section>

      {isLoading ? (
        // --- Combined Loading State UI ---
        <div className="py-16 md:py-20 container mx-auto px-6 md:px-12 space-y-16">
            <LegacySkeleton />
            <PrinciplesSkeleton />
        </div>
      ) : (
        <>
        {/* --- Legacy Section --- */}
        <motion.section 
            className="bg-white py-16 md:py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
        >
            <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div className="flex justify-center" variants={gridItemVariants}>
                  <Image
                    src={imageUrl}
                    alt="Rounak Pharma Building"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg object-cover w-full h-full"
                  />
                </motion.div>
                <motion.div className="text-center lg:text-left" variants={gridItemVariants}>
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
                    Our Legacy of Trust
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {displayData.history_content}
                  </p>
                </motion.div>
              </div>
            </div>
        </motion.section>

        {/* --- Guiding Principles (Mission & Vision) --- */}
        <motion.section 
            className="bg-gray-50 py-16 md:py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
        >
            <div className="container mx-auto px-6 md:px-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-12">
                  Our Guiding Principles
                </h2>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                    variants={gridContainerVariants}
                >
                    {/* Vision Card */}
                    <motion.div className="bg-white p-8 rounded-xl shadow-md text-center flex flex-col items-center" variants={gridItemVariants}>
                        <div className="bg-blue-100 text-blue-800 rounded-full p-4 mb-5">
                            <Eye size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">{displayData.vision}</p>
                    </motion.div>
                    
                    {/* Mission Card */}
                     <motion.div className="bg-white p-8 rounded-xl shadow-md text-center flex flex-col items-center" variants={gridItemVariants}>
                        <div className="bg-blue-100 text-blue-800 rounded-full p-4 mb-5">
                            <Target size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed">{displayData.mission}</p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
        </>
      )}
      <Footer />
    </main>
  );
};

export default AboutUs;