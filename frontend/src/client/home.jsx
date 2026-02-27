import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "../assets/hero-sneaker.jpg";

const Home = () => {
  return (
    <div>
      <section className="relative bg-[#111111] text-white overflow-hidden">
        <div className="container mx-auto px-5 py-16 sm:py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 text-center md:text-left">
            
            {/* Badge */}
            <span className="inline-block bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              New Collection 2026
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-[4.5rem] lg:text-[6rem] font-black leading-tight tracking-tight">
              Step Into
              <br />
              Your <span className="text-orange-500">Style</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-md mx-auto md:mx-0 leading-relaxed">
              Premium urban sneakers crafted for comfort,
              designed for the streets. Elevate every step.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link
                to="/shop"
                className="inline-flex justify-center items-center gap-2 bg-orange-500 text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-all duration-300 hover:scale-105"
              >
                Shop Now <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex justify-center items-center gap-2 border border-gray-700 text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all duration-300"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-first md:order-none">
            <img
              src={heroImage}
              alt="Urban Step premium sneakers"
              className="w-full max-w-md mx-auto md:max-w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;