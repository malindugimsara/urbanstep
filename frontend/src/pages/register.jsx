import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { VscLoading } from "react-icons/vsc";

function RegisterPage() {
  const location = useLocation();
  const initialEmail = location.state?.email || "";
  const navigate = useNavigate();

  const [showSpinner, setShowSpinner] = useState(false); // ✅ Moved inside component

  const [formData, setFormData] = useState({
    name: "",
    email: initialEmail,
    address: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleRegister() {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setShowSpinner(true); // ✅ Show loading

      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/", {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setShowSpinner(false); // ✅ Hide loading whether success or error
    }
  }

  function handleGoogleRegister() {
    console.log("Google register clicked");
  }

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden relative">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 lg:px-16 py-10 relative">
        <div className="z-10 text-center max-w-md ">
          <div className="flex justify-center mb-6">
            <img src="/logo urban step.png" alt="logo" className="w-60 h-55" />
          </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-[#111111] lg:mb-4">
                Join Urban Step
            </h1>

            <p className="hidden md:flex text-[#6B7280] text-base lg:text-lg mb-8 text-center">
                Create your account and discover premium shoes designed for everyday comfort.
            </p>

            <div className="space-y-3 hidden md:flex flex-col items-center">
            <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#F97316] rounded-full animate-pulse"></div>
                <span className="text-[#111111] text-sm">
                Premium Urban Footwear
                </span>
            </div>

            <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#F97316] rounded-full animate-pulse"></div>
                <span className="text-[#111111] text-sm">
                Comfort for Every Step
                </span>
            </div>

            <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#F97316] rounded-full animate-pulse"></div>
                <span className="text-[#111111] text-sm">
                Fast & Secure Checkout
                </span>
            </div>
            </div>

        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-6 lg:px-10 py-5 md:py-10 relative">
        {/* ✅ Loading Overlay */}
        {showSpinner && (
          <div className="absolute inset-0 bg-[#2C3E50]/60 backdrop-blur-sm rounded-none flex items-center justify-center z-50 ">
            <div className="text-center">
              <VscLoading className="text-white text-4xl animate-spin mx-auto mb-3" />
              <p className="text-white text-sm">Creating your account...</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-[400px] bg-white border border-gray-200 rounded-2xl shadow-lg p-6 relative">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1 text-center">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Sign up to get started with PrintShop
          </p>

          <div className="space-y-3 mb-4">
            {["name", "email", "address", "phoneNumber", "password", "confirmPassword"].map(
              (field, i) => (
                <input
                  key={i}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  type={
                    field.toLowerCase().includes("password")
                      ? "password"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  placeholder={
                    field === "confirmPassword"
                      ? "Confirm Password"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              )
            )}
          </div>

          <button
            onClick={handleRegister}
            disabled={showSpinner}
            className={`w-full h-10 text-white rounded-lg font-semibold transition-transform hover:scale-[1.02] hover:shadow-md ${
              showSpinner
                ? "bg-gray-400 cursor-not-allowed"
                : " bg-gradient-to-r from-[#F97316] to-[#c7db30]"
            }`}
          >
            {showSpinner ? "Registering..." : "Register"}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleRegister}
            className="w-full h-11 bg-gradient-to-r from-green-400 to-[#48CAE4] border border-[#E0E0E0] hover:bg-[#F8F9FA] text-[#2C3E50] text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
          >
            <FcGoogle className="text-2xl" />
            <span>Sign in with Google</span>
          </button>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-pink-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
