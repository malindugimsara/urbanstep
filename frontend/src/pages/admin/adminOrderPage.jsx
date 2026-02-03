import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Loader from "../../component/loader";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);

  // Filters
  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch orders
  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");
      axios
        .get(`${backendUrl}/api/order1`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          setOrders(res.data.sort((a, b) => b.orderId.localeCompare(a.orderId)));
          setLoaded(true);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Failed to fetch orders.");
          setLoaded(true);
        });
    }
  }, [loaded]);

  // Update status
  const handleStatusChange = (orderId, status) => {
    const token = localStorage.getItem("token");
    axios
      .put(`${backendUrl}/api/order1/${orderId}`, { status }, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        toast.success("Order status updated");
        setLoaded(false); // refetch
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to update status");
      });
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchName = o.name?.toLowerCase().includes(searchName.toLowerCase());
    const matchEmail = o.email?.toLowerCase().includes(searchEmail.toLowerCase());
    const matchStatus = searchStatus ? o.status === searchStatus : true;
    const matchDate = searchDate ? new Date(o.date).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true;
    return matchName && matchEmail && matchStatus && matchDate;
  });

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
          placeholder="Search Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        />
        <button
          onClick={() => {
            setSearchName("");
            setSearchEmail("");
            setSearchStatus("");
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
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="text-center border-b hover:bg-blue-50">
                    <td className="p-4">{order.orderId}</td>
                    <td className="p-4">{order.name}</td>
                    <td className="p-4">{order.email}</td>
                    <td className="p-4">Rs.{order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => setModalOrder(order)}
                      >
                        Details
                      </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">
            <button
              onClick={() => setModalOrder(null)}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              <IoCloseSharp className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details — {modalOrder.orderId}</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p><b>Name:</b> {modalOrder.name}</p>
              <p><b>Email:</b> {modalOrder.email}</p>
              <p><b>Phone:</b> {modalOrder.phoneNumber}</p>
              <p><b>Total:</b> Rs.{modalOrder.totalPrice.toFixed(2)}</p>
              <p><b>Date:</b> {new Date(modalOrder.date).toLocaleString()}</p>
              <p><b>Status:</b> {modalOrder.status}</p>
            </div>

            {/* Items */}
            <div className="grid gap-4 max-h-[500px] overflow-y-auto">
              {modalOrder.billItem?.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold mb-2">
                    {item.productName} — Qty: {item.quantity}
                  </h3>
                  <p>Price: Rs.{item.price.toFixed(2)}</p>
                  {item.images && <img src={item.images} alt={item.productName} className="h-32 mt-2 object-cover" />}
                  {item.description && <p className="mt-2">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
