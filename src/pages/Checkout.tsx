import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { placeOrder } from "@/api/cakeApi";

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  specialInstructions: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState<CheckoutForm>({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    specialInstructions: "",
  });

  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generate UPI QR Code URL
  const generateQRCodeUrl = () => {
    const upiId = 'merchant@upi';
    const merchantName = 'FoodHub';
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalPrice}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentConfirm = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          cake: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
        deliveryDetails: formData,
      };

      await placeOrder(orderData);

      toast({
        title: "Order Confirmed!",
        description: "Thank you for your order. We'll prepare it right away!",
      });

      clearCart();
      navigate("/orders");
    } catch (error: any) {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  if (showPayment) {
    return (
      <main className="pt-20 min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card rounded-xl p-8 shadow-elegant border border-border">
              <div className="text-center mb-8">
                <CreditCard className="w-16 h-16 mx-auto text-gold mb-4" />
                <h1 className="font-serif text-3xl font-semibold text-primary mb-2">
                  Payment
                </h1>
                <p className="text-muted-foreground">
                  Scan the QR code below to complete your payment
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gold/30 mb-6">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto">
                    <img
                      src={generateQRCodeUrl()}
                      alt="UPI Payment QR Code"
                      className="w-full h-full rounded-lg shadow-sm"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    UPI ID: merchant@upi
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scan with any UPI app to pay
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-lg font-semibold mb-2">Total Amount</p>
                <p className="text-3xl font-bold text-gold">₹{totalPrice.toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handlePaymentConfirm}
                  disabled={loading}
                >
                  {loading ? "Confirming Order..." : "I Have Paid - Confirm Order"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPayment(false)}
                  disabled={loading}
                >
                  Back to Details
                </Button>
              </div>
            </div>
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
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your order details
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* DELIVERY FORM */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl p-6 shadow-soft border border-border"
              >
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Details
                </h2>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, building, landmark"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6-digit pincode"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      placeholder="Any special delivery instructions..."
                      rows={2}
                    />
                  </div>

                  <Button type="submit" variant="hero" className="w-full">
                    Proceed to Payment
                  </Button>
                </form>
              </motion.div>
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
                variant="outline"
                className="w-full"
                onClick={() => navigate("/cart")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
