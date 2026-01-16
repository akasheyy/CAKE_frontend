import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageIcon, X, UploadCloud } from "lucide-react"; // UI Icons

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminAddCake() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    servings: "",
    flavors: "",
    featured: false,
    rating: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // State for preview URL
  const [loading, setLoading] = useState(false);

  // Handle preview generation
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // Clean up memory when component unmounts or image changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, String(value));
    });
    data.append("image", image);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/cakes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) throw new Error("Failed to add cake");

      alert("Cake added successfully 🎉");
      navigate("/admin");
    } catch (error) {
      alert("Error adding cake");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-24 bg-white p-8 rounded-2xl shadow-soft border border-slate-100">

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Add New Cake</h1>
        <p className="text-slate-500">Enter the details and upload a photo for the new menu item.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Image Upload & Preview */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Cake Image</label>
          
          <div className="relative group">
            {preview ? (
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-primary transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-primary mb-3" />
                  <p className="text-sm text-slate-600 font-medium">Click to upload photo</p>
                  <p className="text-xs text-slate-400">PNG, JPG or WebP</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-slate-400 italic">Recommended: 800x800px square image.</p>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Cake Name</label>
            <input
              name="name"
              placeholder="e.g. Belgian Truffle"
              className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
              <input
                name="price"
                type="number"
                placeholder="0"
                className="w-full border border-slate-200 p-2.5 rounded-lg outline-none"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Rating</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                placeholder="4.5"
                className="w-full border border-slate-200 p-2.5 rounded-lg outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
            <input
              name="category"
              placeholder="e.g. Chocolate, Eggless"
              className="w-full border border-slate-200 p-2.5 rounded-lg outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Servings</label>
            <input
              name="servings"
              type="number"
              placeholder="e.g. 8"
              className="w-full border border-slate-200 p-2.5 rounded-lg outline-none"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="md:col-span-2 space-y-4 pt-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe the taste, texture, and ingredients..."
              className="w-full border border-slate-200 p-3 rounded-lg outline-none"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Flavors</label>
            <input
              name="flavors"
              placeholder="Dark Chocolate, Vanilla, Strawberry (comma separated)"
              className="w-full border border-slate-200 p-3 rounded-lg outline-none"
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center p-4 bg-slate-50 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                className="w-5 h-5 accent-primary"
                checked={form.featured}
                onChange={handleChange}
              />
              <span className="font-medium text-slate-700">Feature this cake on the homepage</span>
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Menu Item..." : "Add Cake to Menu"}
          </button>
        </div>
      </form>
    </div>
  );
}