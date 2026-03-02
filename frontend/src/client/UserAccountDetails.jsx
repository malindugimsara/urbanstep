import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function UsersAccountDetails() {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const email = localStorage.getItem("email")?.toLowerCase() || "";
    
  // 1️⃣ If user NOT logged in → show login message
    if (!localStorage.getItem("token")) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="bg-white shadow-2xl rounded-lg p-10 flex flex-col items-center gap-8 max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800">Login Required</h2>
                    <p className="text-gray-600 text-center text-sm">
                        You need to login to access your account details.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/user/",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setUser(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-b-white border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
          <section>
            <h1 className="text-3xl font-extrabold text-center mb-2 text-[#388e3c] tracking-wide">
              Accounts Details
            </h1>
            <hr className="mb-8 border-[#1976d2]" />
            <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
              {user.filter((u) => u.email.toLowerCase() === email)
                .map((customer) => (
                  <form key={customer._id} className="flex flex-col gap-6 pt-5">
                    <div className="flex justify-between ">
                      <Link
                        to="/home"
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold transition"
                      >
                        <IoMdArrowRoundBack className="text-lg" />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/editaccount", { state: customer })
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <MdOutlineEdit />
                      </button>
                    </div>

                    {/* Profile Image */}
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                      <img
                        src="/user.png"
                        alt="User"
                        className="w-20 h-20 rounded-full border-2 border-green-500 shadow-md"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-lg text-green-700">
                          {customer.name}
                        </span>
                        <span className="text-gray-500">{customer.email}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        defaultValue={customer.name}
                        className="w-full h-10 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={customer.email}
                        className="w-full h-10 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        defaultValue={customer.phoneNumber}
                        className="w-full h-10 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        defaultValue={customer.address}
                        className="w-full h-10 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                  </form>
                ))}
            </section>
          </section>
        </div>
      )}
    </>
  );
}

export default UsersAccountDetails;
