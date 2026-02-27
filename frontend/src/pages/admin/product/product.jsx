import axios from "axios"
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../../../component/loader";

export default function ProductPage() {

    // useState
    const[products, setProducts] = useState([])
    const [loaded, setLoaded] = useState(false);
    const [fileModalJob, setFileModalJob] = useState(null);

    const navigate = useNavigate();
    //useEffect
    useEffect(() => {
        if (!loaded){
             // Fetch products from the backend
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/product")
            .then((response) => {
                setProducts(response.data);
                setLoaded(true)
            })
        }
       
        },[loaded]
    )
    
    async function deleteProduct(productId) {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(import.meta.env.VITE_BACKEND_URL+"/api/product/"+productId, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            });
            setLoaded(false); // Reset loaded state to refetch products
            toast.success("Product deleted successfully!");
        } catch (error) {
            toast.error(error.response.data.message || "Failed to delete product. Please try again.");
        }
    }

    return (
        <div className="w-full h-full rounded-lg p-1 relative">
            <Link to={"/admin/addproduct"} className="fixed text-white bg-blue-700 hover:bg-blue-600 p-2 text-3xl rounded-full mb-4 flex items-center gap-2 absolute bottom-7 right-15 z-50">
                <FaPlus />
            </Link>
            {loaded &&
            <div className="overflow-x-auto mt-4 sm:mt-6">
            <table className="w-full min-w-[700px] sm:min-w-full bg-white rounded-xl shadow-lg border border-blue-100">
                <thead>
                    <tr className="text-center ">
                        <th className="p-2 sm:p-4 font-bold text-blue-700">Product ID</th>
                        <th className="p-2 sm:p-4 font-bold text-blue-700">Name</th>
                        <th className="p-2 sm:p-4 font-bold text-blue-700">Price</th>
                        <th className="p-2 sm:p-4 font-bold text-blue-700">Lable Price</th>
                        <th className="p-2 sm:p-4 font-bold text-blue-700">Stock</th>
                        <th className="p-2 sm:p-4 font-bold text-blue-700">File</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product,index) => {
                        return (
                            <tr key={index} className="text-center border-b cursor-pointer hover:bg-gray-100">
                                <td className="p-2">{product.productId}</td>
                                <td className="p-2">{product.name}</td>
                                <td className="p-2">Rs.{product.price}</td>
                                <td className="p-2">Rs.{product.lablePrice}</td>
                                <td className="p-2">{product.stock}</td>
                                <td className="p-2 sm:p-4">
                                    <button
                                    onClick={() => setFileModalJob(product)}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 shadow "
                                    title="View Files"
                                    >
                                    Files
                                    </button>
                                </td>
                                <td className="p-2 sm:p-4">  
                                    <div className="w-full h-full flex flex-wrap  justify-center gap-2">
                                        
                                        <MdOutlineDeleteOutline onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this product?")) {
                                                deleteProduct(product.productId);
                                            }
                                        }}
                                        className="text-[24px] text-red-500 hover:text-red-700 cursor-pointer"/>

                                        <MdOutlineEdit onClick={()=>{
                                            navigate("/admin/editproduct/",{
                                            state: product})
                                        }}
                                        className="text-[24px] text-blue-500 hover:text-blue-700 cursor-pointer"/>
                                    </div>  
                                </td>
                            </tr>
                        )
                        })
                    }
                </tbody>
                
            </table>
            </div>}
            {
                !loaded && 
                    <Loader />
            }

            {fileModalJob && (
                <div className="fixed inset-0 backdrop-blur-md bg-white/30 bg-opacity-40 flex justify-end items-center z-50 p-4">
                <div className="bg-white p-6 rounded-xl shadow-2xl  max-w-lg overflow-y-auto max-h-[80vh] mr-20 ">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Files for {fileModalJob.productId}</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {fileModalJob.images?.map((fileUrl, i) => (
                        <div key={i} className="flex flex-col items-center">
                        {fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img src={fileUrl} className="w-32 h-32 object-cover rounded mb-2" />
                        ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded mb-2">
                            <span className="text-gray-600">File</span>
                            </div>
                        )}

                        <div className="flex gap-2">
                            {/* Preview Button */}
                            <button
                            onClick={() => window.open(fileUrl, "_blank")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                            Preview
                            </button>

                            {/* Download Button */}
                            <button
                            onClick={async () => {
                                try {
                                const response = await fetch(fileUrl);
                                if (!response.ok) throw new Error("Failed to fetch file");
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `job-${fileModalJob.productId}-file${i + 1}`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                window.URL.revokeObjectURL(url);
                                } catch (err) {
                                console.error("Download error:", err.message);
                                alert("Failed to download file.");
                                }
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                            >
                            Download
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>

                    <button
                    onClick={() => setFileModalJob(null)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
                    >
                    Close
                    </button>
                </div>
                </div>
            )}
        </div>
    )
    
}



