import axios from "axios";
import { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import ProductCard from "../component/productCard";
import Loader from "../component/loader";

export default function ProductPage() {
    const [productsList, setProductsList] = useState([]);
    const [productLoaded, setProductLoaded] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!productLoaded){
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/product/")
            .then((response) => {
                setProductsList(response.data);
                setProductLoaded(true);
                
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
        }
        
    }, [productLoaded]
    );
    function searchProduct(){
        if(search.length>0){
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/product/search/"+search)
            .then((res) => {
                setProductsList(res.data.products || res.data);
                
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
        }
    }

    return (
        <div className='w-full h-screen max-h-screen '>
           
            <div className="w-full p-2 flex items-center justify-center bg-gray-100">
                <input 
                    type="text" 
                    className="border-2 border-blue-300 rounded-lg mb-4 mt-4 px-6 py-2 md:w-80 w-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    placeholder="Search products..."
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    value={search}
                />
                <div className="flex items-center justify-center text-sm md:text-lg ">
                    <button
                        className="ml-4 px-2 md:px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md font-semibold"
                        onClick={searchProduct}
                    >
                        Search
                    </button>

                    {/* reset button */}
                    <button
                        className="ml-4 px-2 md:px-6 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md font-semibold"
                        onClick={() => {
                            setSearch("");
                            setProductLoaded(false);
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
            
            {
                productLoaded ?
                <div className="w-full h-full flex flex-wrap items-start justify-center gap-4 p-4"> 
                    {
                        productsList.map(
                            (product,index)=>{
                    return(
                        <ProductCard key={product.productId} product={product} />
                    )
            }
            )
        }
    </div>
    : 
    <Loader />
    }
        </div>
    );
}