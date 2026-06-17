import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
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

  // State for dots tracking
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Initialize Embla Carousel with the Autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true, // Switched to true for continuous autoplay loop
      slidesToScroll: 1,
    },
    [
      Autoplay({ 
        delay: 4000, 
        stopOnInteraction: true, // Standard practice: stop auto-playing if user starts dragging manually
        stopOnMouseEnter: true   // Pause when hovering over testimonials
      })
    ]
  );

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  // Handle dot updates when carousel transitions
  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    
    // Read the snapping points to generate the right amount of dots
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, testimonials]);

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
          <div className="relative max-w-5xl mx-auto mb-8">
            {/* Carousel Navigation Arrow Buttons */}
            <div className="absolute -top-16 right-0 flex gap-2 z-20">
              <Button
                size="icon"
                variant="outline"
                onClick={scrollPrev}
                className="rounded-full border-gold/30 text-gold hover:bg-gold/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={scrollNext}
                className="rounded-full border-gold/30 text-gold hover:bg-gold/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Embla Viewport Container */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
              <div className="flex gap-4 md:gap-6 ml-[-1rem]">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial._id} 
                    className="pl-4 min-w-0 flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%]"
                  >
                    <Dialog>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group h-full"
                      >
                        <DialogTrigger asChild>
                          <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300 h-full flex flex-col justify-between active:scale-95 md:active:scale-100 select-none">
                            
                            <div>
                              <div className="hidden md:flex w-10 h-10 bg-gold/20 rounded-xl items-center justify-center mb-4">
                                <Quote className="w-5 h-5 text-gold" />
                              </div>

                              <div className="flex gap-0.5 md:gap-1 mb-3">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-gold text-gold" />
                                ))}
                              </div>

                              <p className="text-xs md:text-sm text-primary-foreground/90 mb-4 leading-relaxed line-clamp-4">
                                "{testimonial.content}"
                              </p>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3 mt-auto">
                              <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                                <span className="font-serif text-xs md:text-sm font-semibold text-chocolate">
                                  {testimonial.name.charAt(0)}
                                </span>
                              </div>
                              <div className="min-w-0 text-left">
                                <p className="font-semibold text-primary-foreground text-xs md:text-sm truncate">
                                  {testimonial.name}
                                </p>
                                <p className="text-[10px] md:text-xs text-primary-foreground/60">
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
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots at the bottom */}
            <div className="flex justify-center gap-2 mt-8">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex 
                      ? "w-6 bg-gold" 
                      : "w-2 bg-gold/30 hover:bg-gold/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* ... Add Yours Button ... */}
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
