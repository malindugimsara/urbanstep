import { FaFacebookSquare, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white">
        <div className="max-w-7xl mx-auto px-5 py-7 lg:py-10">

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-12 text-center sm:text-left">
                
                {/* Brand */}
                <div className="sm:col-span-1">
                    <h3 className="text-2xl font-extrabold mb-5 tracking-tight">
                    <span className="text-orange-500">URBAN</span>{" "}
                    <span className="text-white">STEP</span>
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs lg:max-w-md mx-auto sm:mx-0">
                    Premium sneakers for the modern urban lifestyle.
                    Step into your style with comfort and confidence.
                    </p>
                </div>

                
                <div className="grid grid-cols-2">
                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest text-white">
                        Shop
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400 lg:flex lg:gap-10">
                        {["Men", "Women"].map((item) => (
                            <li key={item}>
                            <Link
                                to={`/products`}
                                className="hover:text-orange-500 transition-colors duration-300"
                            >
                                {item}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div >
                        <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest text-white">
                        Contact
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <a
                                href="tel:+94788536767"
                                className="hover:text-orange-500 transition-colors"
                                >
                                +94 78 853 6767
                                </a>
                            </li>

                            {/* Social */}
                            <div className="flex justify-center sm:justify-start gap-5 text-xl uppercase tracking-wider text-gray-400">
                                {[
                                    <Link to={`/`}> <FaWhatsapp /> </Link>,
                                    <Link to={`/`}> <FaFacebookSquare /> </Link>,  
                                ].map((s, index) => (
                                <span
                                    key={index}
                                    className="hover:text-orange-500 transition-colors cursor-pointer"
                                >
                                    {s}
                                </span>
                                ))}
                            </div>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-500 gap-4 text-center sm:text-left">
                <p>© 2026 Urban Step. All rights reserved.</p>

                <div className="flex gap-6">
                    <span className="hover:text-orange-500 cursor-pointer transition">
                    Privacy Policy
                    </span>
                    <span className="hover:text-orange-500 cursor-pointer transition">
                    Terms of Service
                    </span>
                </div>
            </div>

        </div>
    </footer>
  );
};

export default Footer;