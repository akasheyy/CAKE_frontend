import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { getGalleryImages } from "@/api/cakeApi";

type GalleryImage = {
  _id: string;
  url: string; // Assuming your DB stores the image URL
  alt: string;
  category?: string;
};

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch images from your API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGalleryImages();
        console.log("Fetched gallery images:", data); // Debug log
        setImages(data);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold font-medium tracking-wider uppercase text-sm">Our Portfolio</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-primary mt-4 mb-6">
              Cake Gallery
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-gold" size={40} />
            </div>
          ) : (
            /* grid-cols-2 ensures 2 images per row on mobile */
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => setSelectedImage(index)}
                  className="group cursor-pointer relative aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-sm"
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium border border-white/40 px-4 py-2 rounded-full backdrop-blur-md">
                      View
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/98 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 text-foreground hover:text-gold z-[60]"
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons - Hidden or smaller on mobile for better UX */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 p-2 md:p-3 bg-white/10 rounded-full hover:bg-gold transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.div 
              className="relative max-w-5xl w-full h-[70vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                src={images[selectedImage].url}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
              />
              <p className="text-center mt-4 text-muted-foreground font-medium">
                {images[selectedImage].alt}
              </p>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 p-2 md:p-3 bg-white/10 rounded-full hover:bg-gold transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}