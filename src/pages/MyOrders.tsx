import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders } from "@/api/cakeApi";

interface Order {
  _id: string;
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
  deliveryDetails?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    specialInstructions?: string;
  };
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();

  /* 📦 Load user orders */
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  /* 🎨 Status badge */
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock size={14} /> },
      processing: { color: "bg-blue-100 text-blue-800", icon: <AlertCircle size={14} /> },
      completed: { color: "bg-green-100 text-green-800", icon: <CheckCircle size={14} /> },
      cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle size={14} /> },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Orders
            </h1>
            <p className="text-slate-500 mt-1">
              Track your cake orders and their status
            </p>
          </div>

          <Link to="/">
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 shadow-sm">
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </Link>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-xl border shadow-sm p-8">
              <div className="text-center text-slate-400">
                Loading your orders...
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl border shadow-sm p-8">
              <div className="text-center">
                <Package size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-slate-500 mb-4">
                  You haven't placed any orders yet. Start exploring our delicious cakes!
                </p>
                <Link to="/menu">
                  <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">
                    Browse Cakes
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(order.status)}
                      <span className="text-lg font-bold text-slate-900">
                        ₹{order.totalAmount}
                      </span>
                      <Link to={`/orders/${order._id}`}>
                        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 text-sm">
                          <Eye size={16} />
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                        <img
                          src={item.cake.image}
                          alt={item.cake.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">
                            {item.cake.name}
                          </h4>
                          <p className="text-sm text-slate-500">
                            Quantity: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <span className="font-semibold text-slate-900">
                          ₹{item.quantity * item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Details */}
                  {order.deliveryDetails && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Delivery Details</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p><strong>Name:</strong> {order.deliveryDetails.name}</p>
                        <p><strong>Phone:</strong> {order.deliveryDetails.phone}</p>
                        <p><strong>Address:</strong> {order.deliveryDetails.address}, {order.deliveryDetails.city} - {order.deliveryDetails.pincode}</p>
                        {order.deliveryDetails.specialInstructions && (
                          <p><strong>Instructions:</strong> {order.deliveryDetails.specialInstructions}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
