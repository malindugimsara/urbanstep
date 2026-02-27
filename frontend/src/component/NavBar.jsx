import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/home", label: "Home" },
    { to: "/shop", label: "Shop" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="container mx-auto flex items-center h-16 px-4 md:px-8 lg:px-12">
        
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="flex items-center gap-1.5 font-black text-xl tracking-tight uppercase"
          >
            <span className="text-orange-500">URBAN</span>
            <span className="text-gray-900">STEP</span>
          </Link>
        </div>

        {/* Center: Desktop nav */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-semibold transition-colors hover:text-orange-500 ${
                isActive(l.to) ? "text-orange-500" : "text-gray-500"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: Icons */}
        <div className="flex-1 flex items-center justify-end gap-5">
          <Link
            to="/shop"
            className="text-gray-900 hover:text-orange-500 transition-colors hidden md:block"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </Link>
          
          <Link
            to="/login"
            className="text-gray-900 hover:text-orange-500 transition-colors hidden md:block"
          >
            <User className="w-5 h-5 stroke-[1.5]" />
          </Link>

          <Link
            to="/cart"
            className="relative text-gray-900 hover:text-orange-500 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {/* Keeping the badge structure here in case you re-add the context later */}
            {/* <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span> */}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-900 p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-semibold ${
                  isActive(l.to)
                    ? "text-orange-500"
                    : "text-gray-600"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {/* Mobile Icon Links */}
            <div className="flex gap-6 mt-2 pt-4 border-t border-gray-100">
              <Link to="/shop" className="text-gray-600 hover:text-orange-500">
                <Search className="w-5 h-5" />
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-orange-500">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;