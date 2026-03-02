import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { ArrowRight } from "lucide-react";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    console.log("Stored phone:", phoneNumber);

    if (!phoneNumber) {
      console.log("No phone number in localStorage");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/order1/phone/${phoneNumber}`)
      .then((res) => {
        console.log("Orders from API:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.error("API error:", err));
  }, []);


  // STATUS COLORS
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "In Progress":
      case "Out for Delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FiCheckCircle className="text-green-600" />;
      case "In Progress":
      case "Out for Delivery":
        return <FiTruck className="text-blue-600" />;
      case "Pending":
        return <FiClock className="text-yellow-600" />;
      default:
        return <FiPackage className="text-gray-600" />;
    }
  }
  const getOverallStatus = (items) => {
    const statuses = items.map(item => item.status);

    if (statuses.every(status => status === "Delivered")) {
      return "Delivered";
    }

    if (statuses.includes("In Progress")) {
      return "In Progress";
    }

    return "Pending";
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-5 pb-10">
      <div className="container mx-auto px-4 sm:px-5 max-w-6xl">

        {/* PAGE TITLE */}
        <div className="text-center mb-8 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C3E50] mt-5">
            Your Orders
          </h1>
          <p className="text-base sm:text-lg text-[#2C3E50]/70 mt-2 sm:mt-3">
            Your shoes, your orders, all in one place.
          </p>
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E50]">
              Order Summary
            </h2>
            <p className="text-md sm:text-sm text-orange-600/80">
              {orders.length} total orders 
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-orange-500 hover:bg-orange-600 hover:scale-105 text-white px-6 py-3 rounded-lg transition"
          >
            Shop Now <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl shadow-sm p-4 sm:p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <FiPackage className="text-5xl sm:text-6xl text-[#2C3E50]/40 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-[#2C3E50]">No Orders Yet</h3>
              <p className="text-sm sm:text-base text-[#2C3E50]/60 mt-2">
                Once you place an order, it will appear here.
              </p>

              <button
                onClick={() => navigate("/products")}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg transition text-sm sm:text-base"
              >
                Create Your First Order
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-[#E0E0E0] text-[#2C3E50] font-semibold">
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Tracking #</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 hidden md:table-cell">Customer</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Date</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Status</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Total</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Action</th>
                  
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b border-[#E0E0E0] hover:bg-[#F8F9FA] transition"
                    >
                      <td className="py-3 sm:py-4 px-3 sm:px-4 font-mono text-xs sm:text-sm text-[#1E1E1E]">
                        {order.orderId}
                      </td>

                      <td className="py-3 sm:py-4 px-3 sm:px-4 hidden md:table-cell text-[#2C3E50]">
                        <p className="font-medium text-xs sm:text-sm">{order.customer?.name || "N/A"}</p>
                        
                      </td>

                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-[#2C3E50]/70 md:table-cell text-xs sm:text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span
                          className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs border ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(getOverallStatus(order.items))}
                          <span className="hidden sm:inline">{getOverallStatus(order.items)}</span>
                        </span>
                      </td>

                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-[#2C3E50] font-medium  lg:table-cell text-xs sm:text-sm">
                       Rs. {order.grandTotal}
                      </td>
              
                      <td className="p-2 sm:p-4">
                        {getOverallStatus(order.items) === "Pending" && (
                          <MdOutlineEdit
                            onClick={() => navigate("/editorder", { state: order })}
                            className="text-lg sm:text-[22px] hover:text-blue-600 cursor-pointer transition-all duration-150"
                            title="Edit"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12">

          {/* Pending */}
          <div className="group backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8 text-center border border-pink-400 hover:border-pink-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-pink-500/20">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-pink-400/20 rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiPackage className="text-2xl sm:text-3xl text-pink-300" />
            </div>

            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3">
             {orders.filter(order => (getOverallStatus(order.items)) === 'Pending').length}
            </div>

            <div className="text-[#1E1E1E] text-lg sm:text-xl font-semibold mb-4">Pending</div>

            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="h-2 rounded-full w-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-1000"
              style={{
                  width: `${
                    orders.length > 0
                      ? (orders.filter(order => (getOverallStatus(order.items)) === 'Pending').length / orders.length) * 100
                      : 0
                    }%`
                }}></div>
            </div>

            <div className="mt-4 text-xs sm:text-sm text-[#1E1E1E]">Pending Your Order</div>
          </div>

          {/* In Progress */}
          <div className="group bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8 text-center border border-blue-400 hover:border-blue-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-blue-500/20">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-blue-400/20 rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiTruck className="text-2xl sm:text-3xl text-blue-300" />
            </div>

            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2 sm:mb-3">
              {orders.filter(order =>
                ['In Progress'].includes(getOverallStatus(order.items))
              ).length}
            </div>

            <div className="text-[#1E1E1E] text-lg sm:text-xl font-semibold mb-4">In Progress</div>

            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000"
                style={{
                  width: `${
                    orders.length > 0
                      ? (orders.filter(order =>
                          ['In Progress'].includes(getOverallStatus(order.items))
                        ).length / orders.length) * 100
                      : 0
                    }%`
                }}
              ></div>
            </div>

            <div className="mt-4 text-xs sm:text-sm text-[#1E1E1E]">Currently shipping</div>
          </div>

          {/* Delivered */}
          <div className="group bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8 text-center border border-green-400 hover:border-green-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-green-500/20">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-green-400/20 rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiCheckCircle className="text-2xl sm:text-3xl text-green-300" />
            </div>

            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 sm:mb-3">
              {orders.filter(order => getOverallStatus(order.items) === 'Delivered').length}
            </div>

            <div className="text-[#1E1E1E] text-lg sm:text-xl font-semibold mb-4">Delivered</div>

            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
                style={{
                  width: `${
                    orders.length > 0
                      ? (orders.filter(order => getOverallStatus(order.items) === 'Delivered').length / orders.length) * 100
                      : 0
                    }%`
                }}
              ></div>
            </div>

            <div className="mt-4 text-xs sm:text-sm text-[#1E1E1E]">Successfully Delivered</div>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default MyOrdersPage;
