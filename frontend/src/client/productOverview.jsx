import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../component/loader";
import ImageSlider from "../component/imageSlider";
import { AddToCart } from "../../utils/cart";
import { IoArrowBack } from "react-icons/io5";

export default function ProductOverview() {

    const params=useParams();
    const navigate = useNavigate();

    if(params.productId==null){
        window.location.href="/products";
    }

    const [product,setProduct]=useState(null);
    const [status,setStatus]=useState("loading"); // error, loaded

    useEffect(()=>{
        if (status==="loading"){
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/product/"+params.productId)
            .then((response)=>{
                console.log(response);
                setProduct(response.data.product);
                setStatus("loaded");
            })
            .catch((error)=>{
                toast.error("Error fetching product details. Please try again.");
                setStatus("error");
            })
        }
    },[status])


    return (
        <div className="w-full h-full">
            {
                status==="loading" &&  <Loader />
            }
            {
                status=="loaded" && 
                <div className="w-full h-full flex flex-col lg:flex-row ">
                    <h1 className="text-3xl lg:hidden font-bold text-center mb-4">{product.name}</h1>
                    <h2 className="text-xl lg:hidden font-semibold text-center text-gray-500 mb-4">{product.altName.join(" | ")}</h2>
                    
                    <div className="w-full">
                        <Link to={"/products"}>
                            <IoArrowBack className="text-2xl bg-black text-white flex m-[5px] p-[2px]" />
                        </Link>
                        <ImageSlider images={product.images} />
                    </div>
                   
                    <div className="w-full lg:w[50%] h-full p-[40px] pt-[100px] ">
                        <h1 className="text-3xl hidden lg:block font-bold text-center mb-4">{product.name}</h1>
                        <h2 className="text-xl hidden lg:block font-semibold text-center text-gray-500 mb-4">{product.altName.join(" | ")}</h2>
                        <div className="text-BLACK p-4">
                            
                            <div className="w-full flex gap-2 justify-center items-cente mb-4">
                                {
                                    product.lablePrice > product.price?
                                    (
                                        <>
                                            <p className="text-xl font-semibold line-through">RS.{product.lablePrice.toFixed(2)}</p>
                                            <p className="text-xl font-semibold ">RS.{product.price.toFixed(2)}</p>
                                        </>
                                    ):
                                    (
                                       <p className="text-xl font-semibold mb-4">RS.{product.price.toFixed(2)}</p>
                                    )

                                }
                            </div>
                            <p className="text-xl font-semibold text-center text-gray-500  mb-2">{product.description}</p>
                            <div className="w-full flex gap-4 justify-center items-center mt-4">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800 transition cursor-pointer" onClick={
                                    ()=>{
                                        AddToCart(product, 1);
                                        toast.success("Product added to cart");
                                    }}>
                                    
                                    Add to Cart</button>
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-800 transition cursor-pointer"
                                    onClick={()=>{
                                        navigate("/checkout",{
                                            state: {
                                                items : [
                                                    {
                                                        productId: product.productId,
                                                        name: product.name,
                                                        altname: product.altName,
                                                        price: product.price,
                                                        lableprice: product.lablePrice,
                                                        image: product.images[0],
                                                        quantity: 1
                                                    }
                                                ]
                                            }
                                        })
                                    }}>
                                    Buy Now</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            }
            {
                status==="error" && <div>
                    error
                </div>
            }
        </div>

    );
}