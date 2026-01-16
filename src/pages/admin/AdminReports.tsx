import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDailyReport,
  getMonthlyReport,
  downloadReportPDF,
} from "@/api/cakeApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

/* ---------------- TYPES ---------------- */

interface Order {
  _id: string;
  user?: {
    name?: string;
    email?: string;
  };
  items: Array<{
    cake?: {
      name?: string;
    };
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface ReportData {
  statistics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    completedOrders: number;
  };
  orders: Order[];
}

/* ---------------- HELPERS ---------------- */

const getToday = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const getCurrentMonth = () => new Date().toISOString().slice(0, 7); // YYYY-MM

/* ---------------- COMPONENT ---------------- */

export default function AdminReports() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [reportType, setReportType] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  /* 🔐 Auth Guard */
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  /* 🔄 Reset date when report type changes */
  useEffect(() => {
    setSelectedDate(reportType === "daily" ? getToday() : getCurrentMonth());
  }, [reportType]);

  /* 📊 Load Report */
  const loadReport = useCallback(async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const data =
        reportType === "daily"
          ? await getDailyReport(selectedDate)
          : await getMonthlyReport(selectedDate);

      setReportData(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [reportType, selectedDate]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  /* 📄 Download PDF */
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadReportPDF(reportType, selectedDate);
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  /* ---------------- FORMATTERS ---------------- */

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-32 px-6 pb-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Reports & Analytics
        </h1>
        <p className="text-sm text-slate-500">
          Generate daily and monthly reports with PDF download
        </p>
      </div>

      {/* CONTROLS */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value as "daily" | "monthly")
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="daily">Daily Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {reportType === "daily" ? "Select Date" : "Select Month"}
            </label>
            <input
              type={reportType === "daily" ? "date" : "month"}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Download */}
          <div className="flex items-end">
            <Button
              className="w-full"
              variant="hero"
              disabled={downloading || loading || !reportData}
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? "Downloading..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </div>

      {/* STATS */}
      {reportData && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={reportData.statistics.totalOrders}
            icon={<Package />}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(reportData.statistics.totalRevenue)}
            icon={<DollarSign />}
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(reportData.statistics.averageOrderValue)}
            icon={<TrendingUp />}
          />
          <StatCard
            title="Completed Orders"
            value={reportData.statistics.completedOrders}
            icon={<CheckCircle />}
          />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">
            {reportType === "daily" ? "Daily" : "Monthly"} Orders
          </h2>
          <p className="text-sm text-slate-500">
            {reportData
              ? `${reportData.orders.length} orders found`
              : "Select a date"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-xs uppercase">Order ID</th>
                <th className="p-4 text-xs uppercase">Customer</th>
                <th className="p-4 text-xs uppercase">Items</th>
                <th className="p-4 text-xs uppercase">Date</th>
                <th className="p-4 text-xs uppercase">Status</th>
                <th className="p-4 text-xs uppercase">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : !reportData || reportData.orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                reportData.orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono">
                      {order._id.slice(-8)}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">
                        {order.user?.name || "N/A"}
                      </div>
                      <div className="text-sm text-slate-500">
                        {order.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {order.items.map((item, i) => (
                        <div key={i}>
                          {item.cake?.name || "Unknown"} × {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-100">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      {formatCurrency(order.totalAmount)}
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
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
