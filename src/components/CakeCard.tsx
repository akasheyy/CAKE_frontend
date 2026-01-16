import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface CakeCardProps {
  cake: any;
  index?: number;
}

export function CakeCard({ cake, index = 0 }: CakeCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(cake);
    toast({
      title: "Added to cart",
      description: cake.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card rounded-xl shadow-soft hover:shadow-elegant transition border border-border flex flex-col"
    >
      {/* IMAGE */}
      <Link to={`/cake/${cake._id}`}>
        <div className="aspect-square overflow-hidden rounded-t-xl">
          <img
            src={cake.image}
            alt={cake.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/cake/${cake._id}`}>
          <h3 className="font-medium text-base mb-1 line-clamp-1 hover:text-gold">
            {cake.name}
          </h3>
        </Link>

        <span className="text-gold font-semibold text-lg mb-3">
          ₹{cake.price}
        </span>

        <Button
          variant="hero"
          size="sm"
          className="mt-auto"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
