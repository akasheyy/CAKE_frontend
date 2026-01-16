import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Plus } from "lucide-react";
import { getTestimonials, createTestimonial } from "@/api/cakeApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  _id: string;
  name: string;
  content: string;
  rating: number;
  createdAt: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createTestimonial(formData);
      toast({
        title: "Success",
        description: "Thank you for your testimonial!",
      });
      setFormData({ name: "", content: "", rating: 5 });
      setIsDialogOpen(false);
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold/20 rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-gold/10 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-gold font-medium tracking-wider uppercase text-xs md:text-sm">
            Sweet Words
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground mt-4 mb-6">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="text-center text-primary-foreground/60">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-primary-foreground/60 mb-8">
            No testimonials yet. Be the first to share your experience!
          </div>
        ) : (
          /* Updated Grid: 2 columns on mobile, 3 on medium screens+ */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group"
              >
                {/* Updated Padding for mobile */}
                <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-gold/20 hover:border-gold/40 transition-all duration-300 h-full flex flex-col">
                  {/* Quote Icon - Hidden on mobile to save vertical space */}
                  <div className="hidden md:flex w-12 h-12 bg-gold/20 rounded-xl items-center justify-center mb-6">
                    <Quote className="w-6 h-6 text-gold" />
                  </div>

                  {/* Stars - Smaller on mobile */}
                  <div className="flex gap-0.5 md:gap-1 mb-3 md:mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 md:w-5 md:h-5 fill-gold text-gold"
                      />
                    ))}
                  </div>

                  {/* Content - Smaller text on mobile with line clamping to keep grid even */}
                  <p className="text-xs md:text-base text-primary-foreground/90 mb-4 md:mb-6 leading-relaxed line-clamp-4 md:line-clamp-none flex-grow">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                      <span className="font-serif text-xs md:text-lg font-semibold text-chocolate">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-primary-foreground text-xs md:text-base truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-[10px] md:text-sm text-primary-foreground/60">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Testimonial Button */}
        <div className="text-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold/90 text-chocolate font-semibold px-6 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base">
                <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Add Yours
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formData.rating
                              ? "fill-gold text-gold"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Review</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-gold hover:bg-gold/90 text-chocolate">
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}