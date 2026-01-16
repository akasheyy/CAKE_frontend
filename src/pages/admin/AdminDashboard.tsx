import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Package, IndianRupee, LayoutGrid, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCakes } from "@/api/cakeApi";

const API_URL = import.meta.env.VITE_API_URL;

interface Cake {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export default function AdminDashboard() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /* 🔐 Frontend guard (UX only) */
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  /* 📦 Load cakes */
  useEffect(() => {
    const loadCakes = async () => {
      try {
        const data = await getCakes();
        setCakes(data);
      } catch (error) {
        console.error("Failed to load cakes");
      } finally {
        setLoading(false);
      }
    };
    loadCakes();
  }, []);

  /* 🗑 Delete cake */
  const deleteCake = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/cakes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setCakes((prev) => prev.filter((cake) => cake._id !== id));
    } catch (err) {
      alert("Error deleting cake");
    }
  };

  /* 📊 Stats */
  const avgPrice =
    cakes.reduce((sum, c) => sum + c.price, 0) / (cakes.length || 1);

  const categories = [...new Set(cakes.map((c) => c.category || "General"))];

  return (
 <div className="min-h-screen bg-[#f8f9fa] pt-24 px-6 pb-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Manage cakes, pricing and inventory
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/add-cake">
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 shadow-sm">
              <Plus size={18} />
              Add Cake
            </button>
          </Link>

          <Link to="/admin/reviews">
            <button className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 shadow-sm">
              <MessageSquare size={18} />
              Reviews
            </button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Package className="text-blue-500" />}
          label="Total Cakes"
          value={cakes.length}
        />

        <StatCard
          icon={<IndianRupee className="text-emerald-500" />}
          label="Average Price"
          value={`₹${avgPrice.toFixed(0)}`}
        />

        <StatCard
          icon={<LayoutGrid className="text-purple-500" />}
          label="Categories"
          value={categories.length}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Product
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Category
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Price
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-400"
                  >
                    Loading inventory...
                  </td>
                </tr>
              ) : cakes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-400"
                  >
                    No cakes found
                  </td>
                </tr>
              ) : (
                cakes.map((cake) => (
                  <tr key={cake._id} className="hover:bg-slate-50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                      />
                      <span className="font-semibold text-slate-700">
                        {cake.name}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600 uppercase">
                        {cake.category || "General"}
                      </span>
                    </td>

                    <td className="p-4 font-medium">
                      ₹{cake.price}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteCake(cake._id, cake.name)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
