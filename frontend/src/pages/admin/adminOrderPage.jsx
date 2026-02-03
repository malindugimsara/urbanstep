import { useEffect, useState } from "react";
import Loader from "../../component/loader";
import axios from "axios";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

export default function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [modalIsDisplay, setModalIsDisplay] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    
    useEffect(() => {
        if (!loaded) {
            const token = localStorage.getItem("token");
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((response) => {
                    setOrders(response.data);
                    setLoaded(true);
                })
                .catch((error) => {
                    toast.error(
                        error.response?.data?.message ||
                            "Failed to fetch orders. Please try again."
                    );
                });
        }
    }, [loaded]);

    function handleStatusChange(orderId, status) {
        const token = localStorage.getItem("token");
        axios.put(import.meta.env.VITE_BACKEND_URL+ "/api/order/" +orderId,
            { status: status },
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        ).then((response) => {
            toast.success("Order status updated successfully");
            setLoaded(false); // Trigger re-fetching of orders
        }).catch((error) => {   
            toast.error(
                error.response?.data?.message ||
                    "Failed to update order status. Please try again."
            );
            console.error("Error updating order status:", error);
        });
    }

    return (
        <div className="w-full h-full">
            {loaded ? (
                <div>
                    <table className="w-full">
                        <thead>
                            <tr className="text-center ">
                                <th className="p-2">Order ID</th>
                                <th className="p-2">Customer Email</th>
                                <th className="p-2">Customer Name</th>
                                <th className="p-2">Address</th>
                                <th className="p-2">Phone Number</th>
                                <th className="p-2">Total Amount</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.orderId}
                                    className="text-center border-t cursor-pointer hover:bg-gray-100"
                                    
                                >
                                    <td className="p-2">{order.orderId}</td>
                                    <td className="p-2">{order.email}</td>
                                    <td className="p-2">{order.name}</td>
                                    <td className="p-2">{order.address}</td>
                                    <td className="p-2">{order.phoneNumber}</td>
                                    <td className="p-2">Rs.{order.totalPrice.toFixed(2)}</td>
                                    <td className="p-2">
                                        <select value={order.status} onChange={(e) => 
                                            handleStatusChange(order.orderId, e.target.value)} className="border rounded px-2 py-1">
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-2">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                                            onClick={() => {
                                        setSelectedOrder(order);
                                        setModalIsDisplay(true);
                                        }}>
                                            Details
                                        </button>                                           
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {modalIsDisplay && (
                        <div className="bg-[#00000070] w-full h-full fixed top-0 left-0 flex justify-center items-center">
                            <div className="w-[600px] max-w-[600px] max-h-[600px] h-[600px] bg-white relative">
                                <div className="w-full h-[150px] max-h-[150px] bg-pink-100">
                                    {/* <h2 className="text-lg font-bold p-2">Order Details</h2> */}
                                    <p className="p-2 text-sm"><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                                    <p className="p-2 text-sm"><strong>Customer:</strong> {selectedOrder.name}</p>
                                    <p className="p-2 text-sm"><strong>Total:</strong> Rs.{selectedOrder.totalPrice.toFixed(2)}</p>
                                    <p className="p-2 text-sm"><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>

                                </div>
                                <div className="w-full h-[450px] max-h-[450px] overflow-y-scroll">
                                    
                                    {
                                        selectedOrder.billItem.map((item, index) => {
                                            return (
                                                
                                                <div key={index} className="flex items-center gap-6 py-4 border-b last:border-b-0 relative">
                                                    <img src={item.images} className="h-full aspect-square object-cover" />
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-semibold text-gray-700">{item.productName}</h3>
                                                        
                                                        <div className="flex gap-20 mt-2 text-lg font-semibold">
                                                            <span className="text-gray-600">
                                                                Price: <span className="text-green-600">Rs.{item.price.toFixed(2)}</span>
                                                            </span>
                                                            <div className="text-gray-600 font-medium">
                                                                Qty: <span className="text-blue-600">{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        )})
                                    }
                                </div>
                                <button
                                    className="absolute top-[-10px] right-[-10px] rounded-full bg-red-500 hover:text-black"
                                    onClick={() => setModalIsDisplay(false)}
                                >
                                    <IoCloseSharp className="w-[25px] h-[25px]" />
                                </button>
                            
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
}
