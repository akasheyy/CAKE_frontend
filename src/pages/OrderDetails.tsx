import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders } from "@/api/cakeApi";

interface Order {
  _id: string;
  items: Array<{
    cake: {
      name: string;
      image: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryDetails: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    specialInstructions?: string;
  };
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        const orders = await getUserOrders();
        const foundOrder = orders.find((o: Order) => o._id === id);

        if (!foundOrder) {
          navigate("/orders");
          return;
        }

        setOrder(foundOrder);
      } catch (error) {
        console.error("Failed to load order details");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [id, isAuthenticated, navigate]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock size={16} />,
        label: "Pending"
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <AlertCircle size={16} />,
        label: "Processing"
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle size={16} />,
        label: "Completed"
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle size={16} />,
        label: "Cancelled"
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full border ${config.color}`}>
        {config.icon}
        {config.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Order Not Found</h2>
          <p className="text-slate-500 mb-4">The order you're looking for doesn't exist.</p>
          <Link to="/orders" className="text-primary hover:underline">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/orders"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </Link>
        </div>

        {/* ORDER HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge(order.status)}
              <div className="text-right">
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="text-2xl font-bold text-slate-900">₹{order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ORDER ITEMS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Package size={20} />
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                  >
                    <img
                      src={item.cake.image}
                      alt={item.cake.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.cake.name}</h3>
                      <p className="text-sm text-slate-500">
                        Quantity: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ORDER SUMMARY */}
              <div className="border-t border-slate-200 mt-6 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* DELIVERY & PAYMENT DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* DELIVERY DETAILS */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Delivery Details
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="font-medium text-slate-900">{order.deliveryDetails.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">{order.deliveryDetails.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-900">
                      {order.deliveryDetails.address}<br />
                      {order.deliveryDetails.city} - {order.deliveryDetails.pincode}
                    </p>
                  </div>
                </div>

                {order.deliveryDetails.specialInstructions && (
                  <div className="flex items-start gap-3">
                    <AlertCircle size={16} className="text-slate-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Special Instructions</p>
                      <p className="font-medium text-slate-900">{order.deliveryDetails.specialInstructions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PAYMENT INFO */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Information
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Method</span>
                  <span className="font-medium text-slate-900">UPI Payment</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Status</span>
                  <span className="font-medium text-green-600">Paid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Order Status</span>
                  <span className="font-medium text-slate-900 capitalize">{order.status}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
