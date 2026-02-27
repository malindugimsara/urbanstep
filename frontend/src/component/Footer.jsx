import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white mt-10">
      <div className="container mx-auto px-4 py-16 md:px-8 lg:px-12 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="pr-4">
            <h3 className="text-xl font-black mb-6 tracking-tight">
              <span className="text-orange-500">URBAN</span>{" "}
              <span className="text-white">STEP</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium sneakers for the modern urban lifestyle. 
              Step into your style with comfort and confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/shop?category=men" className="hover:text-orange-500 transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/shop?category=women" className="hover:text-orange-500 transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/shop?category=kids" className="hover:text-orange-500 transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sports" className="hover:text-orange-500 transition-colors">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <span className="hover:text-orange-500 transition-colors cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="hover:text-orange-500 transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
              <li>
                <span className="hover:text-orange-500 transition-colors cursor-pointer">
                  Contact
                </span>
              </li>
              <li>
                <span className="hover:text-orange-500 transition-colors cursor-pointer">
                  FAQ
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:urbanstep@gmail.com" className="hover:text-orange-500 transition-colors">
                  urbanstep@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+94788536767" className="hover:text-orange-500 transition-colors">
                  +94 78 853 6767
                </a>
              </li>
              <li className="flex gap-4 pt-4">
                {["Instagram", "Twitter", "Facebook"].map((s) => (
                  <span
                    key={s}
                    className="hover:text-orange-500 transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider text-gray-300"
                  >
                    {s}
                  </span>
                ))}
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright section */}
        <div className="border-t border-[#2a2a2a] mt-16 pt-8 text-center text-sm text-gray-500">
          © 2026 Urban Step. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;