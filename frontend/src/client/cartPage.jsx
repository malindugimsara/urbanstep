import { useEffect, useState } from "react";
import { AddToCart, GetCart, GetTotal, GetTotalForLablePrice, RemoveFromCart } from "../../utils/cart";
import { TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const[cartLoaded, setCartLoaded]=useState(false);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (!cartLoaded) {
            const cart = GetCart();
            setCart(cart);
            setCartLoaded(true);
        }
    }, [cartLoaded]);

    return (
        <div className="w-full min-h-screen flex justify-center items-start bg-gray-100 p-10 ">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg lg:p-8">
                <div className="ml-3 mt-3 lg:ml-0 lg:mt-0">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Shopping Cart</h2>
                    {
                        cart.length === 0 ? (
                            <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
                        ) : (
                            cart.map((item, index) => (
                                <div key={index} className="lg:flex items-center gap-6 py-4 border-b last:border-b-0 relative">
                                    
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg shadow" />
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-semibold text-gray-700 pt-3 lg:pt-0">{item.name}</h3>
                                        <p className="text-gray-400 text-m mb-1">{item.altname.join(" | ")}</p>
                                        <div className="lg:flex gap-20 mt-2 text-lg font-semibold">
                                            <span className="text-gray-600">Price: <span className="text-green-600 ">Rs.{item.price.toFixed(2)}</span></span>
                                            <div className="flex items-center gap-4 pt-3 lg:pt-0">
                                                <button 
                                                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                                    onClick={() => {
                                                        AddToCart(item, -1);
                                                        setCartLoaded(false);
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span className="text-gray-600 font-medium">Qty: <span className="text-blue-600">{item.quantity}</span></span>
                                                <button 
                                                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                                    onClick={() => {
                                                        AddToCart(item, 1);
                                                        setCartLoaded(false);
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
                                            RemoveFromCart(item.productId);
                                            setCartLoaded(false);
                                        }}
                                        className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200"
                                        title="Remove item"
                                    >
                                        <TbTrash className="text-red-500 text-2xl absolute bottom-[25px] right-[20px]" />
                                    </button>
                                </div>
                            ))
                        )
                    }
                </div>
                <div className="mr-3 lg:mr-0">
                    <div className="mt-6 text-right">
                        <h3 className="text-xl font-bold text-gray-800">
                            Total: Rs.{GetTotalForLablePrice().toFixed(2)}
                        </h3>
                    </div>
                    <div className="mt-1 text-right">
                        <h3 className="text-xl font-bold text-gray-800">
                            Discount: Rs.{GetTotal().toFixed(2) - GetTotalForLablePrice().toFixed(2)}
                        </h3>
                    </div>
                    <div className="mt-1 text-right">
                        <h3 className="text-xl font-bold text-gray-800">
                            Grand Total: Rs.{GetTotal().toFixed(2)}
                        </h3>
                    </div>
                    <div className="mt-6 text-right mb-4  lg:mb-0">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200  "
                        onClick={() => { navigate("/checkout",
                            {
                                state: {
                                    items: cart
                                }
                            }
                        

                        ); }}>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}