import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { placeOrder } from "@/api/cakeApi";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to checkout.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to checkout page
    window.location.href = "/checkout";
  };

  /* EMPTY CART */
  if (items.length === 0) {
    return (
      <main className="pt-20 min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="font-serif text-3xl font-semibold text-primary mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any cakes yet.
            </p>
            <Button variant="hero" asChild>
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen">
      {/* HEADER */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
              Your Cart
            </h1>
            <p className="text-muted-foreground">
              Review your selections before checkout
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-card rounded-xl p-4 shadow-soft border border-border flex gap-4"
                >
                  {/* IMAGE → DETAILS */}
                  <Link to={`/cake/${item._id}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg hover:opacity-90 transition"
                    />
                  </Link>

                  {/* DETAILS */}
                  <div className="flex-1">
                    <Link to={`/cake/${item._id}`}>
                      <h3 className="font-serif text-lg font-semibold hover:text-gold transition">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="text-gold font-medium">₹{item.price}</p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item._id, item.quantity - 1);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="font-medium">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item._id, item.quantity + 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item._id);
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-xl p-6 shadow-elegant border border-border h-fit sticky top-24"
            >
              <h2 className="font-serif text-xl font-semibold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-gold text-xl">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                variant="hero"
                className="w-full"
                onClick={handleCheckout}
              >
                {isAuthenticated ? "Place Order" : "Login to Checkout"}
              </Button>

              {!isAuthenticated && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  <Link to="/login" className="text-gold hover:underline">
                    Login
                  </Link>{" "}
                  or{" "}
                  <Link to="/register" className="text-gold hover:underline">
                    Register
                  </Link>{" "}
                  to continue
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
