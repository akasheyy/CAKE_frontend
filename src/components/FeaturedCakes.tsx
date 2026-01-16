import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CakeCard } from "@/components/CakeCard";
import { useEffect, useState } from "react";
import { getFeaturedCakes } from "@/api/cakeApi";

export function FeaturedCakes() {
  const [cakes, setCakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedCakes();
        setCakes(data);
      } catch (error) {
        console.error("Failed to load featured cakes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-24 text-center">
        <p className="text-muted-foreground animate-pulse">Loading featured cakes...</p>
      </section>
    );
  }

  if (cakes.length === 0) {
    return null; 
  }

  return (
    <section className="py-24 bg-gradient-warm overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-gold font-medium tracking-wider uppercase text-xs md:text-sm">
            Our Signature Collection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary mt-4 mb-4 md:mb-6">
            Featured Creations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg px-4">
            Handpicked favorites loved by our customers.
          </p>
        </motion.div>

        {/* Cakes Grid 
            grid-cols-2: Sets 2 columns on mobile (default)
            lg:grid-cols-4: Sets 4 columns on desktop
            gap-4: Smaller gap for mobile
            md:gap-8: Normal gap for tablets and desktop
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {cakes.map((cake, index) => (
            <CakeCard key={cake._id} cake={cake} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild className="rounded-full shadow-sm hover:shadow-md transition-all">
            <Link to="/menu" className="gap-2">
              View Full Menu
              <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}