'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Leaf, Users, Building, Store } from 'lucide-react';

// --- Animation Variants (No changes) ---
const containerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const getItemVariants = (isLeft: boolean): Variants => ({
  hidden: {
    x: isLeft ? -100 : 100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 12,
    },
  },
});

const imageVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
};

// --- Data for Feature Cards (No changes) ---
const featureData = [
    {
      icon: Leaf,
      title: 'Started with 6 Authorized Stockists',
      subtitle: 'Serving with integrity from Day 1.',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: Users,
      title: 'Now Working with 200+ Marketers',
      subtitle: 'Trusted by leading pharma brands.',
      color: 'text-sky-500',
      bgColor: 'bg-sky-100',
    },
    {
      icon: Building,
      title: 'Serving Pharmacies, Hospitals & NGOs',
      subtitle: 'End-to-end healthcare support.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
    },
    {
      icon: Store,
      title: 'Available on Pharmarack & Play Store',
      subtitle: 'Seamless digital integration.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
  ];


// --- The Main Component ---
const CompactFeatureSection = () => {
  return (
    <motion.section
      className="container mx-auto px-4 py-10 md:py-10 " // UPDATED: Reduced vertical padding
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="text-center mb-8"> {/* UPDATED: Reduced margin-bottom */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Our Growth Journey</h2> {/* UPDATED: Scaled down text */}
          <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto"> {/* UPDATED: Scaled down text */}
              From humble beginnings to a trusted partner in the pharmaceutical supply chain.
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 "> {/* UPDATED: Reduced gap */}
        
        {/* Left Side: Image */}
        <motion.div variants={imageVariants} className="flex justify-center items-center">
          <div className="relative rounded-3xl"> 
            <Image
              src="/images/rounak-style.jpg"
              alt="Rounak Pharma Innovation"
              width={550} // UPDATED: Reduced image width
              height={400} // UPDATED: Reduced image height
              className="rounded-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Right Side: Indented Stacked Cards */}
        <motion.div
          variants={containerVariants}
          className="relative flex flex-col gap-6" // UPDATED: Reduced gap between cards
        >
            <div className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-0.5 bg-blue-100 hidden lg:block rounded-full z-0"></div>

            {featureData.map((feature, index) => {
                const isLeft = index % 2 === 0;
                return (
                <motion.div
                    key={index}
                    variants={getItemVariants(isLeft)}
                    className={`w-full flex z-10 ${isLeft ? 'justify-start' : 'justify-end'}`}
                >
                    <div
                    className={`
                        bg-gray-50 backdrop-blur-sm rounded-xl shadow-lg p-5 // UPDATED: Reduced padding
                        hover:shadow-indigo-100 hover:bg-white
                        transition-all duration-300 ease-in-out
                        flex items-center gap-5 w-full max-w-md // UPDATED: Reduced gap
                        ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}
                    `}
                    >
                    <div className="flex-shrink-0">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${feature.bgColor}`}> {/* UPDATED: Reduced icon container size */}
                          <feature.icon className={`w-7 h-7 ${feature.color}`} /> {/* UPDATED: Reduced icon size */}
                        </div>
                    </div>
                    <div className={`flex-grow text-center ${isLeft ? 'md:text-left' : 'md:text-right'}`}>
                        <h3 className="text-lg font-bold text-slate-800"> {/* UPDATED: Scaled down text */}
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{feature.subtitle}</p> {/* UPDATED: Scaled down text */}
                    </div>
                    </div>
                </motion.div>
                );
            })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CompactFeatureSection;