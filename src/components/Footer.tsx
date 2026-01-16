import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-serif text-2xl font-semibold">
                La Belle
              </span>
              <span className="font-serif text-lg italic text-gold ml-2">
                Pâtisserie
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6">
              Crafting edible art since 2009. Every cake tells a story of love,
              celebration, and exquisite taste.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-chocolate transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-chocolate transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Our Menu", path: "/menu" },
                { name: "Custom Orders", path: "/custom-orders" },
                { name: "Gallery", path: "/gallery" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gold flex-shrink-0 mt-1" />
                <span className="text-primary-foreground/70">
                  pandikkad
                  <br />
                  malappuram
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-gold flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  7510707228
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-gold flex-shrink-0" />
                <span className="text-primary-foreground/70">
                 vadakkangarakash@gmail.com
                </span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">
              Opening Hours
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock size={20} className="text-gold flex-shrink-0 mt-1" />
                <div className="text-primary-foreground/70">
                  <p>Mon - Fri: 8am - 7pm</p>
                  <p>Saturday: 9am - 6pm</p>
                  <p>Sunday: 10am - 4pm</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2024 La Belle Pâtisserie. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <Link to="#" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
