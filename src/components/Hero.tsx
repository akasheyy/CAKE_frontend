import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroCake from "@/assets/hero-cake.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blush rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blush text-secondary-foreground rounded-full text-sm font-medium mb-6"
            >
              ✨ Handcrafted with Love
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-primary leading-tight mb-6"
            >
              Where Every Cake{" "}
              <span className="italic text-gold">Tells a Story</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Artisan cakes crafted with the finest ingredients, designed to
              make your celebrations unforgettable. From elegant weddings to
              intimate gatherings.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/custom-orders">Order Your Dream Cake</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/menu">Explore Our Menu</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { number: "500+", label: "Happy Couples" },
                { number: "15+", label: "Years Experience" },
                { number: "50+", label: "Cake Designs" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-serif text-2xl md:text-3xl font-semibold text-gold">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 via-blush/30 to-gold/20 rounded-[2rem] blur-sm" />
              <div className="absolute -inset-2 border-2 border-gold/30 rounded-[2rem]" />
              
              <img
                src={heroCake}
                alt="Elegant wedding cake with gold leaf and sugar flowers"
                className="relative rounded-[1.5rem] shadow-elegant w-full object-cover"
              />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 md:left-6 bg-background p-4 rounded-xl shadow-elegant border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎂</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Made Fresh</p>
                  <p className="text-sm text-muted-foreground">Premium Ingredients</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
