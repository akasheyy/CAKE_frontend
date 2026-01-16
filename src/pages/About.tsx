import { motion } from "framer-motion";
import bakeryInterior from "@/assets/bakery-interior.jpg";

export default function About() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-gold font-medium tracking-wider uppercase text-sm">
              Our Story
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-primary mt-4 mb-6">
              About La Belle Pâtisserie
            </h1>
            <p className="text-muted-foreground text-lg">
              Where passion meets precision, and every creation is a testament
              to the art of French pastry making.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={bakeryInterior}
                alt="La Belle Pâtisserie interior"
                className="rounded-2xl shadow-elegant"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-6">
                A Legacy of Sweet Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2009 by master pastry chef Marie Laurent, La Belle
                  Pâtisserie was born from a simple dream: to bring the elegance
                  of French pastry to every celebration.
                </p>
                <p>
                  Marie trained at the prestigious Le Cordon Bleu in Paris before
                  bringing her craft across the Atlantic. Her vision was clear –
                  create cakes that are not just desserts, but edible works of art
                  that capture the essence of life's most precious moments.
                </p>
                <p>
                  Today, our team of skilled pastry chefs continues this legacy,
                  combining time-honored French techniques with innovative designs.
                  We source the finest ingredients – Belgian chocolate, Madagascar
                  vanilla, and locally grown fruits – to ensure every bite is
                  extraordinary.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-4">
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Craftsmanship",
                description:
                  "Every cake is handcrafted with meticulous attention to detail, honoring traditional techniques passed down through generations.",
              },
              {
                title: "Quality",
                description:
                  "We use only the finest ingredients sourced from trusted suppliers, ensuring exceptional taste in every creation.",
              },
              {
                title: "Passion",
                description:
                  "Our love for baking shines through in every cake. We believe that food made with passion tastes infinitely better.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background p-8 rounded-2xl shadow-soft text-center"
              >
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
