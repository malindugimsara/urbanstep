import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../../../../utils/mediaupload.jsx";


export default function AddProduct() {

    const [name, setName] = useState("");
    const [altName, setAltName] = useState("");
    const [price, setPrice] = useState("");
    const [lablePrice, setLablePrice] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);
    const [images, setImages] = useState([]);

   const navigate = useNavigate();
    async function handleAddProduct() {

        const promisesArray = [];
        for (let i = 0; i < images.length; i++) {
            const promise = mediaUpload(images[i]);
            promisesArray[i] = promise;
        }

        try {
            setShowSpinner(true);
            const imageUrls = await Promise.all(promisesArray);

            if (!name || !altName || !price || !lablePrice || !description || !stock) {
                toast.error("Please fill in all required fields.");
                setShowSpinner(false);
                return;
            }

            const product = {
                name,
                altName,
                price,
                lablePrice,
                description,
                stock,
                images: imageUrls
            };

            const token = localStorage.getItem("token");

            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/product",
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Product added successfully!");
            setShowSpinner(false);
            navigate("/admin/product", { replace: true });
        } catch (error) {
            setShowSpinner(false);
            toast.error(error.response?.data?.message || "Failed to add product.");
            console.error("Error adding product:", error);
        }
    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            
            <div className="w-full max-w-lg shadow-2xl rounded-2xl flex flex-col items-center bg-white p-8">
                <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-8 drop-shadow-lg">Add Product</h1>

                {/* Name */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    placeholder="Name"
                    type="text"
                />

                {/* altName */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Alter Name</label>
                <input
                    value={altName}
                    onChange={(e) => setAltName(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    placeholder="Alter Name"
                    type="text"
                />

                {/* price */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Price</label>
                <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    placeholder="Price"
                    type="number"
                />

                {/* Lable Price */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Lable Price</label>
                <textarea
                    value={lablePrice}
                    onChange={(e) => setLablePrice(e.target.value)}
                    className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
                    placeholder="Lable Price"
                />

                {/* Description */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
                    placeholder="Description"
                />

                {/* Images */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Images</label>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    className="w-full border rounded-lg px-4 py-2 mb-4"
                />

                {/* Stock */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Stock</label>
                <select
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-6"
                >
                    <option value="" disabled>Select stock</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>

                <button
                    onClick={handleAddProduct}
                    className="w-full h-12 bg-blue-600 text-white rounded-lg mb-4"
                    disabled={showSpinner}
                >
                    {showSpinner ? "Adding..." : "Add Product"}
                </button>

                <Link to={"/admin/product"} className="w-full h-12 bg-gray-400 text-center pt-3 rounded-lg">
                    Cancel
                </Link>
            </div>
        </div>
    );
}