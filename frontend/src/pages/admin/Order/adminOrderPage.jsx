import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../component/loader";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);

  // Filters
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Fetch orders
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${backendUrl}/api/order1`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch orders.");
      })
      .finally(() => setLoaded(true));
  }, []);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchName = o.customer?.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    const matchPhone = o.customer?.phoneNumber
      ?.toLowerCase()
      .includes(searchPhone.toLowerCase());

    const matchDate = searchDate
      ? new Date(o.date).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;

    return matchName && matchPhone && matchDate;
  });

  //delete order
  async function deleteOrder(orderId) {
      const token = localStorage.getItem("token");
      try {
          await axios.delete(import.meta.env.VITE_BACKEND_URL+"/api/order1/"+orderId, {
              headers: {
                  "Authorization": "Bearer "+token
              }
          });
          setLoaded(false); // Reset loaded state to refetch orders
          toast.success("Order deleted successfully!");
      } catch (error) {
          toast.error(error.response.data.message || "Failed to delete order. Please try again.");
      }
  }

  return (
    <div className="w-full h-full mb-10">
      {/* Add Order Button */}
      <Link
        to="/admin/addorder"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 text-3xl rounded-full shadow-xl border-4 border-white z-50"
      >
        <FaPlus />
      </Link>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 bg-white p-5 rounded-xl shadow-lg mt-6 border border-blue-100">
        <input
          type="text"
          placeholder="Search Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Search Phone Number"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        />
        <button
          onClick={() => {
            setSearchName("");
            setSearchPhone("");
            setSearchDate("");
          }}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      {loaded ? (
        filteredOrders.length > 0 ? (
          <div className="overflow-x-auto mt-6">
            <table className="w-full bg-white rounded-xl shadow-lg border border-blue-100">
              <thead>
                <tr className="text-center bg-blue-200">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Phone</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Details</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-center border-b hover:bg-blue-50"
                  >
                    <td className="p-4">{order.orderId}</td>
                    <td className="p-4">{order.customer?.name}</td>
                    <td className="p-4">{order.customer?.phoneNumber}</td>
                    <td className="p-4">
                      Rs.{order.grandTotal?.toFixed(2)}
                    </td>
                    <td className="p-4">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {order.items?.map((item, idx) => (
                        <span
                          key={idx}
                          className={`font-semibold flex flex-col  ${
                            item.status === "Pending"
                              ? "text-red-500"
                              : item.status === "In Progress"
                              ? "text-blue-500"
                              : item.status === "Completed"
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      ))}
                    </td>
                    <td className="p-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded-2xl hover:bg-blue-700"
                        onClick={() => setModalOrder(order)}
                      >
                        View
                      </button>
                    </td>
                    <td className="p-2 sm:p-4">  
                      <div className="w-full h-full flex flex-wrap  justify-center gap-2">
                          
                          <MdOutlineDeleteOutline onClick={() => {
                              if (window.confirm("Are you sure you want to delete this order?")) {
                                  deleteOrder(order._id);
                              }
                          }}
                          className="text-[24px] text-red-500 hover:text-red-700 cursor-pointer"/>

                          <MdOutlineEdit onClick={()=>{
                              navigate(`/admin/editorder/${order._id}`,{
                              state: order})
                          }}
                          className="text-[24px] text-blue-500 hover:text-blue-700 cursor-pointer"/>
                      </div>  
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center mt-10 text-gray-500 text-lg font-semibold">
            No orders found.
          </p>
        )
      ) : (
        <Loader />
      )}

      {/* Order Modal */}
      {modalOrder && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">
            <button
              onClick={() => setModalOrder(null)}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              <IoCloseSharp className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Order Details — {modalOrder.orderId}
            </h2>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p><b>Name:</b> {modalOrder.customer?.name}</p>
              <p><b>Phone:</b> {modalOrder.customer?.phoneNumber}</p>
              <p><b>Address:</b> {modalOrder.customer?.address}</p>
              <p><b>Date:</b> {new Date(modalOrder.date).toLocaleString()}</p>
              <p><b>Total Price:</b> Rs.{modalOrder.grandTotal?.toFixed(2)}</p>
            </div>

            {/* Items */}
            <div className="grid gap-4 max-h-[500px] overflow-y-auto">
              {modalOrder.items?.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold mb-2">
                    {item.data.name} — Qty: {item.data.quantity} — Size: {item.data.size}
                  </h3>
                  <p>Price: Rs.{item.data.price?.toFixed(2)}</p>
                  <p>Delivery Fee: Rs.{item.data.deliveryFee?.toFixed(2)}</p>
                  <p> <b>Total Price:</b> Rs.{item.data.totalFee?.toFixed(2)}</p>
                  <p>Status : 
                    <span
                          className={`px-3 py-1 rounded-full font-semibold ${
                            item.status === "Pending"
                              ? "text-red-500"
                              : item.status === "Completed"
                              ? "text-green-500"
                              : "text-blue-500"
                          }`}
                        >{item.status}
                    </span>
                </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
