'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Image as ImageIcon, Video as VideoIcon, Loader2, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';

// --- Type Definitions ---
interface GalleryApiItem {
  id: number;
  type: 'image' | 'video';
  title: string;
  description: string | null;
  path: string; // Original URL (image or YouTube)
  created_at: string;
}

interface FormattedGalleryItem {
  id: number;
  type: 'image' | 'video';
  title: string;
  description: string | null;
  originalPath: string; // Original URL
  displayPath: string; // For images, this is originalPath; for videos, it's the embed URL
}

// --- Helper Functions ---
const getYouTubeEmbedUrl = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    // Autoplay muted for the grid view
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&rel=0`;
  }
  return null;
};

// --- Reusable Skeleton Components ---
const GalleryItemSkeleton = () => (
  <div className="relative w-full h-60 bg-gray-200 rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
      <Loader2 size={48} className="animate-spin" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-800/80 to-transparent">
      <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
    </div>
  </div>
);

// --- Gallery Card Component ---
const GalleryCard: React.FC<{ item: FormattedGalleryItem; onClick: () => void }> = ({ item, onClick }) => {
  return (
    <button onClick={onClick} className="relative w-full h-60 rounded-xl shadow-lg overflow-hidden group text-left cursor-pointer">
      {item.type === 'image' ? (
        <Image
          src={item.displayPath}
          alt={item.title || 'Gallery Image'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized 
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder-image.png';
          }}
        />
      ) : (
        <div className="w-full h-full absolute inset-0 pointer-events-none">
            <iframe
                src={item.displayPath}
                title={item.title || 'Gallery Video'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
      )}

      {/* Overlay for Title and Description */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/50 to-transparent flex flex-col justify-end p-4">
        <h3 className="text-white text-xl font-bold mb-1">{item.title || (item.type === 'image' ? 'Untitled Image' : 'Untitled Video')}</h3>
        {item.description && (
          <p className="text-blue-100 text-sm line-clamp-2">{item.description}</p>
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle size={48} className="drop-shadow-lg" />
        </div>
      </div>
       <div className="absolute top-3 right-3 bg-blue-600/70 backdrop-blur-sm text-white p-2 rounded-full shadow-md">
            {item.type === 'image' ? <ImageIcon size={18} /> : <VideoIcon size={18} />}
       </div>
    </button>
  );
};

// --- Modal Component ---
const Modal: React.FC<{ item: FormattedGalleryItem; onClose: () => void }> = ({ item, onClose }) => {
    // For videos, attempt to autoplay with sound in the modal
    const modalDisplayPath = item.type === 'video' 
        ? item.displayPath.replace('&mute=1', '') 
        : item.displayPath;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-black rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 bg-white text-black rounded-full p-1 z-10 hover:bg-gray-200 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>
                <div className="relative w-full aspect-video">
                    {item.type === 'image' ? (
                        <Image
                            src={modalDisplayPath}
                            alt={item.title || 'Gallery Image'}
                            fill
                            className="object-contain rounded-md"
                            unoptimized
                        />
                    ) : (
                        <iframe
                            src={modalDisplayPath}
                            title={item.title || 'Gallery Video'}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full rounded-md"
                        ></iframe>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- Main Gallery Page Component ---
const GalleryPage: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<FormattedGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<FormattedGalleryItem | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiFetch('/galleries');

        if (response.success && Array.isArray(response.data)) {
          const formattedItems: FormattedGalleryItem[] = response.data.map((item: GalleryApiItem) => {
            if (item.type === 'video') {
              const embedUrl = getYouTubeEmbedUrl(item.path);
              return {
                id: item.id,
                type: 'video',
                title: item.title,
                description: item.description,
                originalPath: item.path,
                displayPath: embedUrl || '',
              };
            }
            return {
              id: item.id,
              type: 'image',
              title: item.title,
              description: item.description,
              originalPath: item.path,
              displayPath: item.path,
            };
          }).filter((item: { displayPath: string; }) => item.displayPath !== '');

          setGalleryItems(formattedItems);
        } else {
          setError(response.message || 'Failed to fetch gallery data.');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredItems = galleryItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="py-12 md:py-20 flex-grow">
        <div className="container mx-auto px-4 md:px-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
              Our Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore moments, events, and insights through our collection of photos and videos.
            </p>
          </header>

          <div className="flex justify-center space-x-4 mb-12">
            <button
              onClick={() => setFilterType('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filterType === 'image'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filterType === 'video'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
              }`}
            >
              Videos
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <GalleryItemSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-600 text-xl py-10">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center text-gray-600 text-xl py-10">No items found for this filter.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <GalleryCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <AnimatePresence>
          {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </main>
  );
};

export default GalleryPage;

