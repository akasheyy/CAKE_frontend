import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CakeCard } from "@/components/CakeCard";
import { getCakes } from "@/api/cakeApi";
import { flavors } from "@/data/cakes";

export default function Menu() {
  const [cakes, setCakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        setLoading(true);
        const data = await getCakes();
        setCakes(data);
      } catch (err) {
        setError("Failed to load cakes");
      } finally {
        setLoading(false);
      }
    };
    fetchCakes();
  }, []);

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold font-medium tracking-wider uppercase text-xs md:text-sm">
              Our Collection
            </span>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold text-primary mt-4 mb-6">
              Cake Menu
            </h1>
            <p className="text-muted-foreground text-base md:text-lg px-4">
              Explore our signature handcrafted cakes, each a masterpiece of flavor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cakes Grid Section */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          {loading && <p className="text-center text-muted-foreground">Loading cakes...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && cakes.length === 0 && (
            <p className="text-center text-muted-foreground">No cakes available</p>
          )}

          {/* GRID UPDATE: 
            'grid-cols-2' forces 2 columns on mobile. 
            'gap-4' is smaller for mobile to save space.
          */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {cakes.map((cake, index) => (
              <CakeCard key={cake._id} cake={cake} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Flavors Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 px-4">
            <span className="text-gold font-medium tracking-wider uppercase text-xs md:text-sm">
              Taste Profiles
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-semibold text-primary mt-4 mb-4">
              Available Flavors
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              All our cakes can be customized with your choice of flavors.
            </p>
          </div>

          {/* Small scrollable or grid for flavors on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {flavors.map((flavor, index) => (
              <motion.div
                key={flavor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-background p-5 md:p-6 rounded-xl shadow-sm border border-border/50"
              >
                <h3 className="font-serif text-base md:text-lg font-semibold">
                  {flavor.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  {flavor.description}
                </p>
              </motion.div>
              
            ))}
            
          </div>
        </div>
      </section>
    </main>
  );
}