"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, ArrowRight, ArrowLeft, Download } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

// --- Type Definitions ---
interface Testimonial {
  id: number;
  name: string;
  designation?: string;
  message: string;
  image_url?: string;
  rating: number;
}

interface ApiSetting {
  key: string;
  value: string;
}
interface Settings {
  [key: string]: string;
}

// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

// --- Reusable Components (No Changes) ---
const TestimonialCard = ({ name, designation, message, rating, image_url }: Testimonial) => (
  <motion.div
    className="bg-green-100 p-6 rounded-xl shadow-lg flex-shrink-0 w-80 sm:w-96 flex flex-col text-left min-h-[300px]"
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
  >
    <div className="flex-grow">
      <div className="flex items-center mb-4">
        {image_url ? (
          <Image src={image_url} alt={name} width={50} height={50} className="rounded-full object-cover mr-4 border-2 border-slate-100" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-200 mr-4 border-2 border-slate-100" />
        )}
        <div>
          <h4 className="font-semibold text-slate-800 text-lg">{name}</h4>
          {designation && <p className="text-sm text-slate-500">{designation}</p>}
        </div>
      </div>
      <p className="text-slate-600 text-[15px] leading-relaxed line-clamp-6">&quot;{message}&quot;</p>
    </div>
    <div className="flex mt-4 pt-4 border-t border-green-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? "text-green-500" : "text-slate-300"} fill-current`} />
      ))}
    </div>
  </motion.div>
);

const TestimonialCardSkeleton = () => (
    <div className="bg-green-100 p-6 rounded-xl shadow-lg flex-shrink-0 w-80 sm:w-96 min-h-[300px] animate-pulse">
        <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 mr-4"></div>
            <div className="flex-grow">
                <div className="h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            </div>
        </div>
        <div className="space-y-2 mt-4">
            <div className="h-4 w-full bg-slate-200 rounded"></div>
            <div className="h-4 w-full bg-slate-200 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
        </div>
    </div>
);

// --- Main Component ---
const UpgradedTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  
  // FIXED: Separate loading states for each API call
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsSettingsLoading(false);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const res = await apiFetch("/testimonials");
        if (res.status && Array.isArray(res.data) && res.data.length) {
          setTestimonials(res.data);
        } else {
          throw new Error("No testimonials found.");
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setIsTestimonialsLoading(false);
      }
    };

    fetchSettings();
    fetchTestimonials();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.section
      className="py-10 md:py-10 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800">
            Trusted by Our Partners
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            We&apos;re proud to have earned the trust of over 1,000 happy customers across the industry.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <div
            ref={scrollContainerRef}
            // FIXED: Use `scrollbar-hide` class (see CSS snippet below)
            className="flex items-stretch gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
          >
            {isTestimonialsLoading ? (
              <>
                <TestimonialCardSkeleton />
                <TestimonialCardSkeleton />
                <TestimonialCardSkeleton />
              </>
            ) : (
              testimonials.map((t) => <TestimonialCard key={t.id} {...t} />)
            )}
          </div>
          
          {/* --- FIXED: Upgraded Navigation (No Overlap) --- */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center pointer-events-none z-20 left-0 right-0">
                <motion.button
                    onClick={() => handleScroll('left')}
                    aria-label="Scroll to previous testimonial"
                    // FIXED: Positioned outside the content flow on larger screens
                    className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors pointer-events-auto disabled:opacity-50 -ml-4 md:-ml-6"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowLeft className="w-6 h-6 text-green-500" />
                </motion.button>
                <motion.button
                    onClick={() => handleScroll('right')}
                    aria-label="Scroll to next testimonial"
                    // FIXED: Positioned outside the content flow on larger screens
                    className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors pointer-events-auto disabled:opacity-50 -mr-4 md:-mr-6"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowRight className="w-6 h-6 text-green-500" />
                </motion.button>
          </div>

        </motion.div>

        {/* --- Redesigned CTA Banner --- */}
        <motion.div
          variants={itemVariants}
          className="mt-12 bg-gradient-to-r from-green-800 to-green-500 text-white rounded-2xl shadow-2xl px-4 md:px-8 flex flex-wrap items-center"
        >
            <div className="col">
              <div className="relative bottom-0 left-0 h-48 w-48 md:h-64 md:w-64 lg:h-64 lg:w-72 opacity-80 lg:opacity-100">
                <Image
                    src="/images/download.png"
                    alt="Rounak Pharma app on a phone"
                    fill
                    className="object-contain"
                />
              </div>
            </div>
            <div className="col md:w-3/5">
              <div className="mb-5 mx-5">
                  <h3 className="text-3xl md:text-4xl font-bold mb-3">
                      Download Our App
                  </h3>
                  <p className="text-lg md:text-xl text-green-200 mb-6">
                      Available on Play Store & Live Connect for seamless access.
                  </p>
                  <Link href={isSettingsLoading ? '#' : settings.play_store_link || '#'} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-70"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSettingsLoading}
                  >
                    <Download className="w-5 h-5" />
                    Download Now
                  </motion.button>
                  </Link>
              </div>
            </div>
            
        </motion.div>
      </div>
    </motion.section>
  );
};

export default UpgradedTestimonials;