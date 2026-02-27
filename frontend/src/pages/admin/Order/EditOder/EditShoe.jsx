import React from "react";

export default function EditShoe({ jobData, setJobData, status, setStatus }) {

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

        const qutantity = Number(updatedData.quantity) || 0;
        const itemFee = Number(updatedData.price) || 0;
        const deliveryFee = Number(updatedData.deliveryFee) || 0;

        updatedData.totalFee = (itemFee * qutantity) + deliveryFee;

        setJobData(updatedData);
    };

    return (
        <div className="mt-10 bg-white rounded-xl shadow-md p-6 border border-gray-200">

            {/* Title */}
            <div className="p-4 bg-[#F8F9FA] border border-gray-300 rounded-xl mb-6 flex justify-center items-center">
                <h1 className="text-2xl font-bold text-[#2C3E50]">Edit Shoe</h1>
            </div>

            {/* Shoe Name & Size */}
            <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block font-semibold mb-2">Shoe Name</label>
                    <input
                        type="text"
                        className="w-full border p-3 rounded-lg"
                        value={jobData.name || ""}
                        onChange={e => handleChange("name", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-2">
                        Size 
                    </label>

                    <input
                        type="text"
                        maxLength={2}
                        className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                            jobData.size &&
                            (Number(jobData.size) < 35 || Number(jobData.size) > 50)
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                        }`}
                        value={jobData.size || ""}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            handleChange("size", value);
                        }}
                    />

                </div>
            </div>

            {/* Quantity & Status */}
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
                        Status
                    </label>
                    <select
                        className="w-full border p-3 rounded-lg"
                        value={status || "Pending"}       // top-level status
                        onChange={(e) => setStatus(e.target.value)} // updates parent state
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
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
