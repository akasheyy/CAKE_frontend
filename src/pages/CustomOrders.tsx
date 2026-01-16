import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Cake, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const cakeTypes = [
  "Wedding Cake",
  "Birthday Cake",
  "Anniversary Cake",
  "Baby Shower Cake",
  "Corporate Event",
  "Other",
];

const servingSizes = ["10-15", "15-25", "25-50", "50-100", "100+"];

export default function CustomOrders() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    cakeType: "",
    servingSize: "",
    flavors: "",
    description: "",
  });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await fetch("http://localhost:5000/api/custom-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    toast({
      title: "Request Submitted!",
      description: "We'll contact you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      eventDate: "",
      cakeType: "",
      servingSize: "",
      flavors: "",
      description: "",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  }
};

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
              Your Vision, Our Creation
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-primary mt-4 mb-6">
              Custom Cake Orders
            </h1>
            <p className="text-muted-foreground text-lg">
              Tell us about your dream cake and we'll bring it to life with
              exquisite flavors and stunning design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-3xl shadow-elegant p-8 md:p-12 border border-border"
          >
            {/* Contact Info */}
            <div className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-gold" />
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    required
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91...."
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-gold" />
                Event Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="cakeType">Cake Type</Label>
                  <select
                    id="cakeType"
                    value={formData.cakeType}
                    onChange={(e) =>
                      setFormData({ ...formData, cakeType: e.target.value })
                    }
                    required
                    className="mt-2 w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="">Select cake type</option>
                    {cakeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Cake Details */}
            <div className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Cake className="w-6 h-6 text-gold" />
                Cake Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="servingSize">Number of Guests</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <select
                      id="servingSize"
                      value={formData.servingSize}
                      onChange={(e) =>
                        setFormData({ ...formData, servingSize: e.target.value })
                      }
                      required
                      className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                    >
                      <option value="">Select serving size</option>
                      {servingSizes.map((size) => (
                        <option key={size} value={size}>
                          {size} guests
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="flavors">Preferred Flavors</Label>
                  <Input
                    id="flavors"
                    value={formData.flavors}
                    onChange={(e) =>
                      setFormData({ ...formData, flavors: e.target.value })
                    }
                    placeholder="e.g., Chocolate, Vanilla, Red Velvet"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Design Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your dream cake design, colors, theme, and any special requests..."
                  rows={6}
                  className="mt-2"
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full">
              Submit Custom Order Request
            </Button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
