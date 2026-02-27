import { Route, Routes } from "react-router-dom";
import Header from "../component/header";
import ProductPage from "../client/productpage.jsx";
import Contact from "./contact.jsx";
import ProductOverview from "../client/productOverview.jsx";
import CartPage from "../client/cartPage.jsx";
import Checkout from "../client/checkOut.jsx";
import Home from "../client/home.jsx";
import Navbar from "../component/NavBar.jsx";
import Footer from "../component/Footer.jsx";


export default function HomePage() {
    return (
        <div className='w-full h-screen max-h-screen'>
            {/* <Header /> */}
            <Navbar />
            <div className='w-full h-[calc(100vh-75px)] min-h-[calc(100vh-75px)] '>
                <Routes path="/*">
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/contact" element= {<Contact />} />
                    <Route path="/reviews" element={<div>Reviews</div>} />
                    <Route path="/overview/:productId" element={<ProductOverview />} /> 
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/*" element={<div>404 Not Found</div>} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}