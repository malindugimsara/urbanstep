import { useEffect, useState } from "react";    
import { TbTrash } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
    const location = useLocation();
    const [cart, setCart] = useState(location.state?.items || []);
    const [cartRefresh, setCartRefresh] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    function placeOrder() {
        const orderdata = {
            name,
            address,
            phone,
            billItems: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        };
        console.log("Placing Order:", orderdata);
        navigate("/order-success", { state: { order: orderdata } });
    }

    function GetTotal() {
        return cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    }

    function GetTotalForLablePrice() {
        return cart.reduce((sum, p) => sum + p.lableprice * p.quantity, 0);
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-start bg-gray-100 p-10">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg lg:p-8 p-6">
                
                {/* Title */}
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Checkout</h2>

                {/* Cart Items */}
                {cart.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
                ) : (
                    cart.map((item, index) => (
                        <div key={index} className="lg:flex items-center gap-6 py-4 border-b last:border-b-0 relative">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg shadow" />
                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold text-gray-700 pt-3 lg:pt-0">{item.name}</h3>
                                <p className="text-gray-400 text-m mb-1">{item.altname.join(" | ")}</p>
                                <div className="lg:flex gap-20 mt-2 text-lg font-semibold">
                                    <span className="text-gray-600">
                                        Price: <span className="text-green-600">Rs.{item.price.toFixed(2)}</span>
                                    </span>
                                    <div className="flex items-center gap-4 pt-3 lg:pt-0">
                                        <button 
                                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                            onClick={() => {
                                                const newcart = [...cart];
                                                newcart[index].quantity = Math.max(1, newcart[index].quantity - 1);
                                                setCart(newcart);
                                                setCartRefresh(!cartRefresh);
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="text-gray-600 font-medium">
                                            Qty: <span className="text-blue-600">{item.quantity}</span>
                                        </span>
                                        <button 
                                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                            onClick={() => {
                                                const newcart = [...cart];
                                                newcart[index].quantity += 1;
                                                setCart(newcart);
                                                setCartRefresh(!cartRefresh);
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-gray-600 font-medium pt-3 lg:pt-0">
                                        Total: <span className="text-purple-600">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    setCart(cart.filter((prdct) => prdct.productId !== item.productId));
                                }}
                                className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200"
                                title="Remove item"
                            >
                                <TbTrash className="text-red-500 text-2xl absolute bottom-[25px] right-[20px]" />
                            </button>
                        </div>
                    ))
                )}

                {/* Totals */}
                <div className="mr-3 lg:mr-0 text-lg">
                    <div className="mt-6 text-right">
                        <h3 className=" font-bold text-gray-600">
                            Total: Rs.{GetTotalForLablePrice().toFixed(2)}
                        </h3>
                    </div>
                    <div className="mt-1 text-right">
                        <h3 className=" font-bold text-gray-600">
                            Discount: Rs.{(GetTotalForLablePrice() - GetTotal()).toFixed(2)}
                        </h3>
                    </div>
                    <div className="mt-1 text-right">
                        <h3 className="font-bold text-blue-800">
                            Grand Total: Rs.{GetTotal().toFixed(2)}
                        </h3>
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="ml-3 mt-8 lg:ml-0 lg:mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">Shipping Information</h2>

                    <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Full Name</label>
                    <input  
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" 
                        placeholder="Enter your full name" 
                    />

                    <label className="block text-gray-700 font-medium mb-2 mt-4" htmlFor="address">Address</label>
                    <input  
                        type="text" 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" 
                        placeholder="Enter your address" 
                    />

                    <label className="block text-gray-700 font-medium mb-2 mt-4" htmlFor="phone">Phone</label>
                    <input  
                        type="text" 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" 
                        placeholder="Enter your phone number" 
                    />
                </div>

                {/* Place Order */}
                <div className="mt-6 text-right mb-4 lg:mb-0">
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
                        onClick={placeOrder}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}
