import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const location = useLocation();
  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const loginWithGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: (res) => {
        setShowSpinner(true);

        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/google", {
            accessToken: res.access_token,   // NOW it exists
        })
        .then((response) => {
            toast.success("Login successful!");

            localStorage.setItem("token", response.data.token);

            const user = response.data.user;
            console.log(user.email)

            localStorage.setItem("email", response.data.user.email);
            // Persist same user object as regular login so other components can read it
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: user.email,
                name: user.name,
                address: user.address || "",
                role: user.role || "user",
              })
            );
            localStorage.setItem("name", user.name);

            if (user.role === "admin") navigate("/admin");
            else navigate("/home");
        })
        .catch((error) => {
            console.error("Login failed:", error);
            toast.error(error.response?.data?.message || "Login failed.");
            setShowSpinner(false);
        });
    }
});


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleLogin() {
    setShowSpinner(true);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        const token = response.data.token;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            name: user.name,
            address: user.address,
            role: user.role,
          })
        );

        switch (user.role?.toLowerCase()) {
          case "admin":
            navigate("/admin");
            toast.success("Login successful!");
            break;
          case "user":
            navigate("/home");
            toast.success("Login successful!");
            break;
          default:
            toast.error("Unknown role: " + user.role);
            setShowSpinner(false);
            break;
        }
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("email", response.data.user.email);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
        setPassword("");
        setShowSpinner(false);
      });
  }

  const handleClick = () => {
    setShowSpinner(true);
    handleLogin();
  };
  

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row relative overflow-hidden bg-[#F8F9FA]">
      {/* Left Side - Logo Section */}
      <div className="w-full lg:w-1/2 min-h-[25vh] lg:min-h-[40vh] lg:h-screen flex lg:flex-col items-center justify-center gap-4">
        <img src="/logo urban step.png" alt="logo" className="w-40 md:w-40 lg:w-90 lg:h-85 ml-5" />
        <h1 className="text-3xl lg:text-5xl mt-5 font-bold text-[#2C3E50]">URBAN STEP</h1>
        <p className="hidden lg:flex mt-1 text-[#1E1E1E]/80 md:text-lg">Designed For Movement. Built For Everyday Life.</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-4 py-6 lg:py-0">
        <div className="w-full max-w-[400px] bg-white shadow-lg rounded-2xl flex flex-col justify-center items-center p-6 relative border border-[#E0E0E0]">
          
          {/* Loading Overlay */}
          {showSpinner && (
            <div className="absolute inset-0 bg-[#2C3E50]/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
              <div className="text-center">
                <VscLoading className="text-white text-4xl animate-spin mx-auto mb-3" />
                <p className="text-white text-sm">Signing you in...</p>
              </div>
            </div>
          )}

          <div className="w-full text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-2">Welcome back!</h1>
            <p className="text-[#2C3E50]/70 text-sm">Please sign in to continue</p>
          </div>

          <div className="w-full space-y-4">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              value={email}
              placeholder="Email"
              className="w-full h-11 px-4 bg-[#F8F9FA] border border-[#E0E0E0] rounded-lg text-sm text-[#2C3E50] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#48CAE4] transition-all"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              placeholder="Password"
              className="w-full h-11 px-4 bg-[#F8F9FA] border border-[#E0E0E0] rounded-lg text-sm text-[#2C3E50] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D16BA5] transition-all"
            />
          </div>

          <div className="w-full text-right mb-4">
            <button
              className="text-[#2C3E50] hover:text-[#F97316] text-sm font-semibold transition-colors duration-300"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot password?
            </button>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={handleClick}
              className="w-full h-11 bg-gradient-to-r from-[#F97316] to-[#c7db30] text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center ">
              <div className="flex-1 border-t border-[#E0E0E0]"></div>
              <span className="px-4 text-[#2C3E50]/70 text-sm">or</span>
              <div className="flex-1 border-t border-[#E0E0E0]"></div>
            </div>

            {/* Google Sign In Button */}
            <button className="w-full h-11 bg-gradient-to-r from-green-400 to-[#48CAE4] border border-[#E0E0E0] hover:bg-[#F8F9FA] text-[#2C3E50] text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
            onClick={loginWithGoogle}>
              <FcGoogle className="text-2xl" />
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-[#2C3E50]/80 text-sm">
              Don’t have an account?
              <Link
                to={"/register"}
                className="ml-2 text-[#F97316] hover:text-[#EA580C] font-semibold transition-colors duration-300 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
