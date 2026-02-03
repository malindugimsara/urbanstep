import { useState } from "react";
import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import UserData from "../pages/userData";

export default function Header(){
    const [isOpen, setIsOpen] = useState(true);
    return(
        <header className="w-full h-20 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-start items-center shadow-xl">
            <GiHamburgerMenu 
                className="text-2xl mx-4 text-white lg:hidden hover:text-pink-200 cursor-pointer transition-all" 
                onClick={() => setIsOpen(true)} 
            />
            <div className="w-full h-full hidden lg:flex justify-evenly items-center px-8 relative">
                <nav className="flex gap-8 text-white text-lg font-medium">
                    <Link to='/home' className="hover:text-pink-200 transition-all hover:scale-105">Home</Link>
                    <Link to='/products' className="hover:text-pink-200 transition-all hover:scale-105">Products</Link>
                    <Link to='/contact' className="hover:text-pink-200 transition-all hover:scale-105">Contact Us</Link>
                    <Link to='/reviews' className="hover:text-pink-200 transition-all hover:scale-105">Reviews</Link>
                    <div className="absolute right-15 ">
                        <UserData />
                    </div>
                    
                </nav>
                <Link to='/cart'>
                    <BsCart3 className="text-2xl absolute right-[300px] top-1/2 -translate-y-1/2 text-white hover:text-pink-200 transition-all hover:scale-110" />
                </Link>
            </div>
            {
                isOpen &&(
                    <div className="fixed top-0 left-0 w-full h-screen bg-black/50 z-50 flex backdrop-blur-sm lg:hidden">
                        <div className="w-[40%] h-full bg-gradient-to-b from-indigo-100 to-purple-100 flex flex-col pt-8 relative lg:hidden shadow-2xl">
                            <GiHamburgerMenu 
                                className="text-2xl mx-4 absolute top-4 right-4 text-indigo-600 hover:text-purple-600 cursor-pointer transition-all" 
                                onClick={() => setIsOpen(false)}
                            />
                            <nav className="flex flex-col gap-8 text-indigo-600 text-lg font-medium px-8 mt-8">
                                <Link to='/home' className="hover:text-purple-600 transition-all" onClick={() => setIsOpen(false)}>Home</Link>
                                <Link to='/products' className="hover:text-purple-600 transition-all" onClick={() => setIsOpen(false)}>Products</Link>
                                <Link to='/contact' className="hover:text-purple-600 transition-all" onClick={() => setIsOpen(false)}>Contact Us</Link>
                                <Link to='/reviews' className="hover:text-purple-600 transition-all" onClick={() => setIsOpen(false)}>Reviews</Link>
                                <div className="absolute bottom-15 ">
                                    <UserData />
                                </div>
                            </nav>
                            <Link to='/cart' onClick={() => setIsOpen(false)}>
                                <BsCart3 className="text-2xl absolute right-[20px] top-1/2 -translate-y-1/2 text-indigo-600 hover:text-purple-600 transition-all" />
                            </Link>
                        </div>
                    </div>
                )
            }
        </header>
    )
}