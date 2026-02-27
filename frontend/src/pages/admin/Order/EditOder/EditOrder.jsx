import { useState } from "react";
import { FiClipboard, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import EditJobActions from "./EditJobActions";
import EditShoe from "./EditShoe";
import { useEffect } from "react";

export default function EditOrder() {
    const { orderId } = useParams();
    const navigate = useNavigate()

    // CUSTOMER
    const [customer, setCustomer] = useState({
        name: "",
        phoneNumber: "",
        address: "",
    });

    const [date, setDate] = useState("");

    // ITEMS
    const [items, setItems] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const [loading, setLoading] = useState(true);
    
    
    // FETCH ORDER DATA
   useEffect(() => {
    if (!orderId) {
        console.log("orderId is missing");
        return;
    }

    const fetchOrder = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/order1/${orderId}`,
                {
                    headers: { 
                        Authorization: "Bearer " + localStorage.getItem("token") 
                    },
                }
            );

            const order = res.data;

            setCustomer({
                name: order.customer.name,
                phoneNumber: order.customer.phoneNumber,
                address: order.customer.address,   
            });

            setDate(order.date.split("T")[0]);


            setItems(order.items || []);

            if (order.items && order.items.length > 0) {
                setActiveIndex(0);
            }

            setLoading(false);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load order data");
            setLoading(false);
        }
    };

    fetchOrder();
    }, [orderId]);


    // ADD NEW ITEM
    const addItem = (type) => {
        const newItem = {
            type, // "shoe"
            data: {
                name: "",
                quantity: "",
                size: "",
                price: "",
                deliveryFee: "",
                totalFee: 0,
            },
            status: "Pending",
        };

        setItems(prev => [...prev, newItem]);
        setActiveIndex(items.length);
    };

    // UPDATE ITEM DATA
    const updateItemData = (index, newData) => {
        setItems(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, data: newData }
                    : item
            )
        );
    };

    // UPDATE ITEM STATUS
    const updateItemStatus = (index, newStatus) => {
        setItems(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, status: newStatus }
                    : item
            )
        );
    };
    // DELETE ITEM
    const deleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);

        if (activeIndex === index) {
            setActiveIndex(null);
        } else if (activeIndex > index) {
            setActiveIndex(activeIndex - 1);
        }
    };

    // SUBMIT ORDER
    const updateOrder = async () => {
        if (!customer.name || !customer.phoneNumber) {
            toast.error("Please fill all customer details");
            return;
        }

        if (items.length === 0) {
            toast.error("Please add at least one item");
            return;
        }

        const payload = {
            customer,
            date,
            items,
        };

        try {
            setShowSpinner(true);

            await axios.put(
                import.meta.env.VITE_BACKEND_URL + "/api/order1/" + orderId,
                payload
            );

            toast.success("Order Update successfully!");
            navigate("/admin/orders");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update order");
        } finally {
            setShowSpinner(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-10 px-6">
            <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-200">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-[#D16BA5]/20 rounded-xl">
                        <FiClipboard className="text-3xl text-[#D16BA5]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-[#2C3E50]">
                            Edit Order
                        </h1>
                        <p className="text-gray-600">Edit an existing order</p>
                    </div>
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Customer Name</label>
                        <input
                            className="w-full border p-3 rounded-lg"
                            value={customer.name}
                            onChange={e =>
                                setCustomer({ ...customer, name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="tel"
                            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2
                                ${
                                    customer.phoneNumber.length === 0 ||
                                    customer.phoneNumber.length === 10
                                        ? "border-gray-300 focus:ring-blue-500"
                                        : "border-red-500 focus:ring-red-500"
                                }`}
                            value={customer.phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                setCustomer({ ...customer, phoneNumber: value });
                            }}
                        />

                        {customer.phoneNumber.length > 0 &&
                            customer.phoneNumber.length !== 10 && (
                                <p className="text-red-500 text-sm mt-1">
                                    Phone number must be exactly 10 digits
                                </p>
                            )}
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block font-semibold mb-2">Customer Address</label>
                    <input
                        className="w-full border p-3 rounded-lg"
                        value={customer.address}
                        onChange={e =>
                            setCustomer({ ...customer, address: e.target.value })
                        }
                    />
                </div>

                {/* DATE */}
                <div className="mt-6">
                    <label className="block font-semibold mb-2">Date</label>
                    <input
                        type="date"
                        className="w-full h-12 border border-gray-300 rounded-lg px-4"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </div>

                <div className="mt-6">
                    {items.length > 0 && (
                        <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Items</h2>
                        <div className="flex flex-wrap gap-2">
                            {items.map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-2 border p-2 rounded-lg cursor-pointer ${
                                activeIndex === idx ? "bg-blue-100" : "bg-gray-100"
                                }`}
                                onClick={() => setActiveIndex(idx)}
                            >
                                <span>{item.data.name || "New Shoe"}</span>
                                <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent selecting item
                                    deleteItem(idx);
                                }}
                                className="text-red-500 hover:text-red-700"
                                >
                                <FiTrash2 size={20} />
                                </button>
                            </div>
                            ))}
                        </div>
                        </div>
                    )}
                </div>

                {/* ACTIVE ITEM */}
                <div className="mt-8">
                    {activeIndex !== null && items[activeIndex] && (
                        <EditShoe
                            jobData={items[activeIndex].data}
                            setJobData={(data) =>
                                updateItemData(activeIndex, data)
                            }
                            status={items[activeIndex].status}
                            setStatus={(s) =>
                                updateItemStatus(activeIndex, s)
                            }
                        />
                    )}
                </div>

                {/* ACTION BUTTONS */}
                <EditJobActions
                    addItem={() => addItem("shoe")}
                    updateOrder={updateOrder}
                    showSpinner={showSpinner}
                />

            </div>
        </div>
    );
}
