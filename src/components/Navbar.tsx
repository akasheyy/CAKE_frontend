import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getContacts } from "@/api/cakeApi";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Menu", path: "/menu" },
  { name: "Custom Orders", path: "/custom-orders" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const adminNavLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Menu", path: "/menu" },
  { name: "Gallery", path: "/admin/gallery" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      const fetchUnreadContacts = async () => {
        try {
          const contacts = await getContacts();
          const unreadCount = contacts.filter((contact: any) => !contact.read).length;
          setUnreadContacts(unreadCount);
        } catch (error) {
          console.error("Failed to fetch unread contacts", error);
        }
      };
      fetchUnreadContacts();
    }
  }, [isAdmin]);

  const filteredNavLinks = isAdmin
    ? adminNavLinks
    : navLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-semibold text-primary">
              La Belle
            </span>
            <span className="font-serif text-lg italic text-gold">
              Pâtisserie
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium hover:text-gold ${
                  location.pathname === link.path
                    ? "text-gold"
                    : "text-foreground"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                  />
                )}
              </Link>
            ))}

            {/* USER ORDERS */}
            {isAuthenticated && !isAdmin && (
              <Link
                to="/orders"
                className="text-sm font-medium hover:text-gold"
              >
                My Orders
              </Link>
            )}

            {/* ADMIN LINKS */}
            {isAdmin && (
  <>
    <Link to="/admin" className="text-sm font-medium hover:text-gold">
      Dashboard
    </Link>

    <Link
      to="/admin/orders"
      className="text-sm font-medium hover:text-gold"
    >
      Orders
    </Link>

    <Link
      to="/admin/custom-orders"
      className="text-sm font-medium hover:text-gold"
    >
      Custom Orders
    </Link>

    <Link
      to="/admin/contacts"
      className="relative text-sm font-medium hover:text-gold"
    >
      Contacts
      {unreadContacts > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {unreadContacts}
        </span>
      )}
    </Link>

    <Link
      to="/admin/add-cake"
      className="text-sm font-medium hover:text-gold"
    >
      Add Cake
    </Link>
  </>
)}

          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAdmin && (
              <Link to="/cart" className="relative p-2 hover:text-gold">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* MOBILE */}
          <div className="lg:hidden flex items-center gap-3">
            {!isAdmin && (
              <Link to="/cart" className="relative p-2 hover:text-gold">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:text-gold">
                  <Menu size={24} />
                </button>
              </SheetTrigger>

              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-6">
                  {filteredNavLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium hover:text-gold"
                    >
                      {link.name}
                    </Link>
                  ))}

                  {isAuthenticated && !isAdmin && (
                    <Link
                       to="/orders"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium hover:text-gold"
                    >
                      My Orders
                    </Link>
                  )}

                  {isAdmin && (
  <>
    <Link to="/admin" onClick={() => setIsOpen(false)}>
      Admin Dashboard
    </Link>

    <Link
      to="/admin/orders"
      onClick={() => setIsOpen(false)}
    >
      Orders
    </Link>

    <Link
      to="/admin/custom-orders"
      onClick={() => setIsOpen(false)}
    >
      Custom Orders
    </Link>

    <Link
      to="/admin/contacts"
      onClick={() => setIsOpen(false)}
      className="relative"
    >
      Contacts
      {unreadContacts > 0 && (
        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {unreadContacts}
        </span>
      )}
    </Link>

    <Link
      to="/admin/add-cake"
      onClick={() => setIsOpen(false)}
    >
      Add Cake
    </Link>
  </>
)}


                  <div className="pt-4 border-t">
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button asChild className="flex-1">
                          <Link to="/login">Login</Link>
                        </Button>
                        <Button asChild className="flex-1" variant="hero">
                          <Link to="/register">Register</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
