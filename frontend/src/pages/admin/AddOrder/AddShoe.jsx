import React from "react";

export default function AddShoe({ jobData, setJobData }) {

    // Generic change handler
    const handleChange = (field, value) => {
        setJobData({
            ...jobData,
            [field]: value,
        });
    };

    // Fee change handler (auto calculate total)
    const handleFeeChange = (field, value) => {
        const updatedData = {
            ...jobData,
            [field]: value,
        };

        const itemFee = Number(updatedData.price) || 0;
        const deliveryFee = Number(updatedData.deliveryFee) || 0;

        updatedData.totalFee = itemFee + deliveryFee;

        setJobData(updatedData);
    };

    return (
        <div className="mt-10 bg-white rounded-xl shadow-md p-6 border border-gray-200">

            {/* Title */}
            <div className="p-4 bg-[#F8F9FA] border border-gray-300 rounded-xl mb-6 flex justify-center items-center">
                <h1 className="text-2xl font-bold text-[#2C3E50]">Shoe</h1>
            </div>

            {/* Shoe Name */}
            <div className="mt-6">
                <label className="block font-semibold mb-2">Shoe Name</label>
                <input
                    type="text"
                    className="w-full border p-3 rounded-lg"
                    value={jobData.name || ""}
                    onChange={e => handleChange("name", e.target.value)}
                />
            </div>

            {/* Quantity & Size */}
            <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block font-semibold mb-2">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full border p-3 rounded-lg"
                        value={jobData.quantity || ""}
                        onChange={e => handleChange("quantity", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
                        Size <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="text"
                        maxLength={2}
                        className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2
                            ${
                                jobData.size?.length === 2
                                    ? "border-gray-300 focus:ring-blue-500"
                                    : "border-red-500 focus:ring-red-500"
                            }`}
                        value={jobData.size || ""}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            handleChange("size", value);
                        }}
                    />

                    {jobData.size && jobData.size.length !== 2 && (
                        <p className="text-red-500 text-sm mt-1">
                            Size must be exactly 2 digits
                        </p>
                    )}
                </div>
            </div>

            {/* Fees */}
            <div className="grid grid-cols-3 gap-6 mt-6">
                <div>
                    <label className="block font-semibold mb-2">Item fee</label>
                    <input
                        type="number"
                        className="w-full border p-3 rounded-lg"
                        value={jobData.price || ""}
                        onChange={e => handleFeeChange("price", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">Delivery fee</label>
                    <input
                        type="number"
                        className="w-full border p-3 rounded-lg"
                        value={jobData.deliveryFee || ""}
                        onChange={e => handleFeeChange("deliveryFee", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">Total fee</label>
                    <input
                        type="number"
                        className="w-full border p-3 rounded-lg bg-gray-100"
                        value={jobData.totalFee || 0}
                        readOnly
                    />
                </div>
            </div>

        </div>
    );
}
