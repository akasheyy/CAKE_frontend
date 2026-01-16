import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllOrders, updateOrderStatus } from "@/api/cakeApi";

/* ---------------- TYPES ---------------- */

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    cake: {
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

/* ---------------- COMPONENT ---------------- */

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /* 🔐 Admin Guard */
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  /* 📦 Fetch Orders */
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  /* 🔄 Update Status */
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  /* 📊 Stats */
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  /* 🎨 Status Badge */
  const getStatusBadge = (status: string) => {
    const map = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={14} />,
      },
      processing: {
        color: "bg-blue-100 text-blue-800",
        icon: <AlertCircle size={14} />,
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={14} />,
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle size={14} />,
      },
    };

    const config = map[status as keyof typeof map] || map.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${config.color}`}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-32 px-6 pb-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order Management
          </h1>
          <p className="text-sm text-slate-500">
            View and manage customer orders
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2">
          <Link to="/admin">
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 shadow-sm">
              <Package size={18} />
              Dashboard
            </button>
          </Link>

          <Link to="/admin/reports">
            <button className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 shadow-sm">
              <FileText size={18} />
              Reports
            </button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Package className="text-blue-500" />}
          label="Total Orders"
          value={orders.length}
        />

        <StatCard
          icon={<IndianRupee className="text-emerald-500" />}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
        />

        <StatCard
          icon={<Clock className="text-orange-500" />}
          label="Pending Orders"
          value={pendingOrders}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold uppercase">Order ID</th>
                <th className="p-4 text-xs font-bold uppercase">Customer</th>
                <th className="p-4 text-xs font-bold uppercase">Items</th>
                <th className="p-4 text-xs font-bold uppercase">Total</th>
                <th className="p-4 text-xs font-bold uppercase">Status</th>
                <th className="p-4 text-xs font-bold uppercase">Date</th>
                <th className="p-4 text-xs font-bold uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono text-sm">
                      #{order._id.slice(-8)}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold">{order.user.name}</p>
                      <p className="text-sm text-slate-500">
                        {order.user.email}
                      </p>
                    </td>

                    <td className="p-4">
                      {order.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <img
                            src={item.cake.image}
                            alt={item.cake.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span className="text-sm">
                            {item.cake.name} × {item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-xs text-slate-400">
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-medium">
                      ₹{order.totalAmount}
                    </td>

                    <td className="p-4">{getStatusBadge(order.status)}</td>

                    <td className="p-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/orders/${order._id}`}>
                          <button className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded text-xs">
                            <Eye size={12} />
                            View
                          </button>
                        </Link>

                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
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

/* ---------------- STAT CARD ---------------- */

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
        <p className="text-xs uppercase text-slate-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
