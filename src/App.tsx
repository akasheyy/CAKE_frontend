import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

import Index from "./pages/Index";
import About from "./pages/About";
import Menu from "./pages/Menu";
import CakeDetails from "./pages/CakeDetails";
import CustomOrders from "./pages/CustomOrders";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAddCake from "./pages/admin/AdminAddCake";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminReports from "./pages/admin/AdminReports";

import AdminContacts from "./pages/admin/AdminContacts";
import AdminCustomOrders from "./pages/admin/AdminCustomOrders";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminReviews from "./pages/admin/AdminReviews";

import UserOrders from "./pages/MyOrders";

import AdminRoute from "./routes/AdminRoute";

const queryClient = new QueryClient();

/* 🌐 PUBLIC LAYOUT */
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

/* 🔐 ADMIN LAYOUT */
function AdminLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <ScrollToTop />

            <Routes>
              {/* 🌐 PUBLIC ROUTES */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cake/:id" element={<CakeDetails />} />
                <Route path="/custom-orders" element={<CustomOrders />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<UserOrders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
              </Route>

              {/* 🔐 PROTECTED ADMIN ROUTES (NO ADMIN LOGIN) */}
              <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="add-cake" element={<AdminAddCake />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="orders/:id" element={<AdminOrderDetails />} />

  {/* ✅ CUSTOM ORDERS */}
  <Route path="custom-orders" element={<AdminCustomOrders />} />

  <Route path="contacts" element={<AdminContacts />} />

  <Route path="gallery" element={<AdminGallery />} />

  <Route path="reviews" element={<AdminReviews />} />

  <Route path="reports" element={<AdminReports />} />
</Route>


              {/* ❌ 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
