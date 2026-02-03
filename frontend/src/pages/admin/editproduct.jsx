import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../../../utils/mediaupload.jsx";

export default function EditProduct() {
    const locationData = useLocation();
    const navigate = useNavigate();

    if (!locationData.state) {
        toast.error("No product data found to edit.");
        navigate("/admin/product", { replace: true });
        return null;
    }

    const [productId] = useState(locationData.state.productId);
    const [name, setName] = useState(locationData.state.name);
    const [altName, setAltName] = useState(locationData.state.altName.join(","));
    const [price, setPrice] = useState(locationData.state.price);
    const [lablePrice, setLablePrice] = useState(locationData.state.lablePrice);
    const [description, setDescription] = useState(locationData.state.description);
    const [stock, setStock] = useState(locationData.state.stock);

    const [existingImages, setExistingImages] = useState(
        locationData.state.images || []
    );
    const [images, setImages] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    function removeExistingImage(index) {
        const updatedImages = [...existingImages];
        updatedImages.splice(index, 1);
        setExistingImages(updatedImages);
    }

    async function handleEditProduct() {
        try {
            setShowSpinner(true);

            let imageUrls = existingImages;

            if (images.length > 0) {
                const uploadPromises = images.map((img) => mediaUpload(img));
                const newImageUrls = await Promise.all(uploadPromises);
                imageUrls = [...existingImages, ...newImageUrls];
            }

            const product = {
                productId,
                name,
                altName: altName.split(","),
                price,
                lablePrice,
                description,
                stock,
                images: imageUrls,
            };

            const token = localStorage.getItem("token");

            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Product updated successfully!");
            navigate("/admin/product", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product");
        } finally {
            setShowSpinner(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-lg shadow-2xl rounded-2xl flex flex-col items-center bg-white p-8">
                <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-8 drop-shadow-lg">
                    Edit Product
                </h1>

                {/* Product ID */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">
                    Product ID
                </label>
                <input
                    value={productId}
                    disabled
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-100"
                    type="text"
                />

                {/* Name */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">
                    Name
                </label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    type="text"
                />

                {/* Alt Name */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">
                    Alter Name (comma separated)
                </label>
                <input
                    value={altName}
                    onChange={(e) => setAltName(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    type="text"
                />

                {/* Price */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">
                    Price
                </label>
                <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    type="number"
                />

                {/* Label Price */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">
                    Label Price
                </label>
                <textarea
                    value={lablePrice}
                    onChange={(e) => setLablePrice(e.target.value)}
                    className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
                />

                {/* Description */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
                />

                {/* Existing Images */}
                {existingImages.length > 0 && (
                    <div className="w-full mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                            Existing Images
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            {existingImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative w-full h-24 rounded-lg overflow-hidden border"
                                >
                                    <img
                                        src={img}
                                        alt="product"
                                        className="w-full h-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New Images */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">
                    Add New Images
                </label>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    className="w-full border rounded-lg px-4 py-2 mb-4"
                />

                {/* Stock */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">
                    Stock
                </label>
                <select
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-6"
                >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>

                <button
                    onClick={handleEditProduct}
                    disabled={showSpinner}
                    className="w-full h-12 bg-green-600 text-white rounded-lg mb-4"
                >
                    {showSpinner ? "Updating..." : "Update Product"}
                </button>

                <Link
                    to={"/admin/product"}
                    className="w-full h-12 bg-gray-400 text-center pt-3 rounded-lg"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}
