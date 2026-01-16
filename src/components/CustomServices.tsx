import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cake, Heart, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Heart,
    title: "Wedding Cakes",
    description:
      "Elegant multi-tiered masterpieces designed to complement your special day. Custom flavors and designs available.",
  },
  {
    icon: Cake,
    title: "Birthday Celebrations",
    description:
      "From whimsical children's cakes to sophisticated adult designs. Make every birthday unforgettable.",
  },
  {
    icon: Crown,
    title: "Corporate Events",
    description:
      "Professional presentation for product launches, milestones, and company celebrations.",
  },
  {
    icon: Sparkles,
    title: "Special Occasions",
    description:
      "Anniversaries, baby showers, graduations – we create the perfect centerpiece for any celebration.",
  },
];

export function CustomServices() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blush/30 -skew-x-12 transform origin-top-right" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold font-medium tracking-wider uppercase text-sm">
              Tailored to Perfection
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary mt-4 mb-6">
              Custom Cake Services
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Every celebration deserves a cake as unique as the moment itself.
              Our expert pastry chefs work closely with you to bring your vision
              to life with exquisite flavors and stunning designs.
            </p>

            <div className="space-y-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blush flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors duration-300">
                    <service.icon className="w-6 h-6 text-secondary-foreground group-hover:text-chocolate transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10"
            >
              <Button variant="hero" size="lg" asChild>
                <Link to="/custom-orders">Start Your Custom Order</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blush via-cream to-gold/20 rounded-3xl p-8 md:p-12">
              <div className="bg-background rounded-2xl p-8 shadow-elegant">
                <h3 className="font-serif text-2xl font-semibold text-primary mb-6">
                  How It Works
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      step: "01",
                      title: "Consultation",
                      desc: "Share your vision and preferences",
                    },
                    {
                      step: "02",
                      title: "Design",
                      desc: "We create a custom design just for you",
                    },
                    {
                      step: "03",
                      title: "Tasting",
                      desc: "Sample our delicious flavors",
                    },
                    {
                      step: "04",
                      title: "Delivery",
                      desc: "Your masterpiece arrives fresh",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <span className="font-serif text-3xl font-bold text-gold">
                        {item.step}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
