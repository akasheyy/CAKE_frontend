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
      {/* ... decorative elements ... */}

      <div className="container mx-auto px-4 relative z-10">
        {/* ... section header ... */}

        {loading ? (
          <div className="text-center text-primary-foreground/60">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-primary-foreground/60 mb-8">
            No testimonials yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <Dialog key={testimonial._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="group"
                >
                  {/* DialogTrigger makes the whole card clickable */}
                  <DialogTrigger asChild>
                    <div className="cursor-pointer bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-gold/20 hover:border-gold/40 transition-all duration-300 h-full flex flex-col active:scale-95 md:active:scale-100">
                      
                      <div className="hidden md:flex w-12 h-12 bg-gold/20 rounded-xl items-center justify-center mb-6">
                        <Quote className="w-6 h-6 text-gold" />
                      </div>

                      <div className="flex gap-0.5 md:gap-1 mb-3 md:mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 md:w-5 md:h-5 fill-gold text-gold" />
                        ))}
                      </div>

                      {/* line-clamp-4 keeps the grid neat on mobile */}
                      <p className="text-xs md:text-base text-primary-foreground/90 mb-4 md:mb-6 leading-relaxed line-clamp-4 md:line-clamp-none flex-grow">
                        "{testimonial.content}"
                      </p>

                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                          <span className="font-serif text-xs md:text-lg font-semibold text-chocolate">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="font-semibold text-primary-foreground text-xs md:text-base truncate">
                            {testimonial.name}
                          </p>
                          <p className="text-[10px] md:text-sm text-primary-foreground/60">
                            {new Date(testimonial.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                </motion.div>

                {/* Expanded Full View Modal */}
                <DialogContent className="sm:max-w-lg bg-primary border-gold/30 text-primary-foreground">
                  <DialogHeader>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                      ))}
                    </div>
                    <DialogTitle className="font-serif text-2xl text-gold">
                      {testimonial.name}'s Experience
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <Quote className="w-8 h-8 text-gold/40 mb-2" />
                    <p className="text-lg leading-relaxed italic text-primary-foreground/90">
                      {testimonial.content}
                    </p>
                    <div className="mt-6 pt-6 border-t border-gold/20 flex items-center gap-4">
                       <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-chocolate font-bold">
                          {testimonial.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold">{testimonial.name}</p>
                         <p className="text-sm opacity-60">Verified Customer • {new Date(testimonial.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
        
        {/* ... Add Yours Button ... */}
      </div>
    </section>
  );
}