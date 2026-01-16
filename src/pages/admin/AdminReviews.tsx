import { useEffect, useState } from "react";
import { Trash2, Star, MessageSquare } from "lucide-react";
import { getTestimonials, deleteTestimonial } from "@/api/cakeApi";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  _id: string;
  name: string;
  content: string;
  rating: number;
  createdAt: string;
}

export default function AdminReviews() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
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
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"? This action cannot be undone.`)) return;

    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 px-6 pb-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Customer Reviews
            </h1>
            <p className="text-sm text-slate-500">
              Manage customer testimonials and feedback
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<MessageSquare className="text-blue-500" />}
            label="Total Reviews"
            value={testimonials.length}
          />
          <StatCard
            icon={<Star className="text-yellow-500" />}
            label="Average Rating"
            value={
              testimonials.length > 0
                ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                : "0.0"
            }
          />
          <StatCard
            icon={<Trash2 className="text-red-500" />}
            label="Actions Available"
            value="Delete"
          />
        </div>

        {/* TESTIMONIALS LIST */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading testimonials...
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No testimonials found
            </div>
          ) : (
            <div className="divide-y">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="p-6 hover:bg-slate-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                          <span className="font-serif text-lg font-semibold text-chocolate">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {testimonial.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-gold text-gold"
                                />
                              ))}
                            </div>
                            <span className="text-sm text-slate-500">
                              {new Date(testimonial.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed ml-13">
                        "{testimonial.content}"
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(testimonial._id, testimonial.name)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition ml-4"
                      title="Delete testimonial"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* 🔹 Stat Card */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 uppercase">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
