import { useEffect, useState } from "react";
import { getCustomOrders, updateCustomOrderStatus } from "@/api/cakeApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Phone, Mail, Cake, MessageSquare, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CustomOrder = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  cakeType: string;
  servingSize: string;
  flavors: string;
  description: string;
  status: string;
  createdAt: string;
};

export default function AdminCustomOrders() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getCustomOrders()
      .then(setOrders)
      .catch((err) => console.error("CUSTOM ORDERS ERROR:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateCustomOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppRedirect = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg font-medium animate-pulse text-slate-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Custom Cake Orders</h1>
            <p className="text-slate-500 mt-1">Manage and review incoming custom requests ({orders.length})</p>
          </div>
          <Badge variant="outline" className="w-fit bg-white px-4 py-1 text-sm shadow-sm">
            Status: Active
          </Badge>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-slate-400">No custom orders found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {orders.map((order) => {
              const status = order.status || 'new';
              return (
                <Card key={order._id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-white border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-800">{order.name}</CardTitle>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {order.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {order.phone}</span>
                        </div>
                      </div>
                      {status === 'new' && (
                        <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50">New</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 bg-white">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Event Date</p>
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <Calendar className="w-4 h-4 text-pink-500" />
                          {new Date(order.eventDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Party Size</p>
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <Users className="w-4 h-4 text-blue-500" />
                          {order.servingSize} Guests
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Cake className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-semibold">{order.cakeType}</span>
                        </div>
                        <p className="text-sm text-slate-600 ml-6 italic">"{order.flavors}"</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <MessageSquare className="w-3 h-3" /> Description
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded">
                          {order.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-between items-center">
                      <p className="text-[11px] text-slate-400 uppercase font-medium">
                        Received {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsAppRedirect(order.phone)}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                        {status === 'new' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order._id, 'in progress')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark as In-Progress →
                          </Button>
                        )}
                        {status === 'in progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order._id, 'completed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark as Completed →
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}