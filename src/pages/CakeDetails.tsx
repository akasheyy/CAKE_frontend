import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCakeById } from "@/api/cakeApi";
import { useCart } from "@/contexts/CartContext";

export default function CakeDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [cake, setCake] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchCake = async () => {
      try {
        const data = await getCakeById(id);
        setCake(data);
      } catch (err) {
        setError("Failed to load cake details");
      } finally {
        setLoading(false);
      }
    };
    fetchCake();
  }, [id]);

  if (loading) return <div className="pt-40 text-center">Loading...</div>;

  if (error || !cake) {
    return (
      <div className="pt-40 text-center">
        <p className="text-red-500 mb-4">{error || "Cake not found"}</p>
        <Link to="/menu" className="text-primary hover:underline">Back to Menu</Link>
      </div>
    );
  }

  return (
    <main className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Navigation */}
        <Link to="/menu" className="text-sm text-gray-500 hover:text-black mb-8 inline-block transition-colors">
          ← Back to Menu
        </Link>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left: Standard Image */}
          <div className="w-full md:w-1/2">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={cake.image}
              alt={cake.name}
              className="w-full aspect-square object-cover rounded-2xl shadow-sm border border-gray-100"
            />
          </div>

          {/* Right: Clean Info Block */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-xs uppercase tracking-widest text-primary font-bold">
                {cake.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              {cake.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-semibold text-gray-900">₹{cake.price}</span>
              {cake.rating && (
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  ★ {cake.rating}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {cake.description}
            </p>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-6 border-t border-b border-gray-100 py-6 mb-8 text-sm">
              {cake.servings && (
                <div>
                  <p className="text-gray-400 mb-1">Servings</p>
                  <p className="font-medium text-gray-900">{cake.servings} People</p>
                </div>
              )}
              {cake.category && (
                <div>
                  <p className="text-gray-400 mb-1">Type</p>
                  <p className="font-medium text-gray-900">{cake.category}</p>
                </div>
              )}
            </div>

            {/* Flavor Pills */}
            {cake.flavors?.length > 0 && (
              <div className="mb-10">
                <p className="text-sm font-semibold mb-3">Choice of Flavors</p>
                <div className="flex flex-wrap gap-2">
                  {cake.flavors.map((flavor: string) => (
                    <span 
                      key={flavor} 
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action */}
            <button
              onClick={() => addToCart(cake)}
              className="w-full md:w-max bg-primary text-white px-12 py-4 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10"
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}