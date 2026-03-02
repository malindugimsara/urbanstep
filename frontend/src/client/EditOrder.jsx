import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    toast.error("No order data found.");
    navigate("/myorder");
  }

  const orderData = location.state;

  const [name, setName] = useState(orderData.customer.name);
  const [phoneNumber, setPhoneNumber] = useState(
    orderData.customer.phoneNumber
  );
  const [address, setAddress] = useState(orderData.customer.address);
  const [needDate, setNeedDate] = useState(
    orderData.date?.split("T")[0]
  );
  const [items, setItems] = useState(orderData.items);
  const [loading, setLoading] = useState(false);

  // Update item status
  const handleStatusChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].status = value;
    setItems(updatedItems);
  };

  const handleUpdateOrder = async () => {
    try {
      setLoading(true);

      const updatedOrder = {
        customer: {
          name,
          phoneNumber,
          address,
        },
        date: needDate,
        items,
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/order1/${orderData._id}`,
        updatedOrder
      );

      toast.success("Order updated successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-20 pb-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-[#2C3E50] mb-6">
          Edit Order
        </h1>

        {/* Customer Info */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-semibold mb-1">Customer Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Order Date</label>
            <input
              type="date"
              value={needDate}
              onChange={(e) => setNeedDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>

          {items.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl mb-4 bg-gray-50"
            >
              <p className="font-semibold">
                {item.data.name} (Size {item.data.size})
              </p>
              <p>Qty: {item.data.quantity}</p>
              <p>Price: Rs. {item.data.price}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleUpdateOrder}
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl"
          >
            {loading ? "Updating..." : "Update Order"}
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}