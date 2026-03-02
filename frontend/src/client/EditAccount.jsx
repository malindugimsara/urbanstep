import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditAccount() {
    const locationData = useLocation();
    const navigate = useNavigate();

    const userData = locationData.state;

    if (!userData) {
        return null;
    }

    const [userID] = useState(userData?._id || "");
    const [name, setName] = useState(userData?.name || "");
    const [email, setEmail] = useState(userData?.email || "");
    const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || "");
    const [address, setAddress] = useState(userData?.address || "");

    const [showSpinner, setShowSpinner] = useState(false);

    async function handleEditUser() {
        setShowSpinner(true);
        const updatedUser = {
            name,
            email,
            phoneNumber,
            address,
        };

        const token = localStorage.getItem("token");

        try {
            await axios.put(
                import.meta.env.VITE_BACKEND_URL + "/api/user/" + userID,
                updatedUser,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            toast.success("User edited successfully!");
            navigate("/viewaccount");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit user.");
            console.error(error);
        }finally {
            setShowSpinner(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
                Edit Account Details
                </h1>

                <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEditUser();
                }}
                >
                {/* Name */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold mb-2">Name</label>
                    <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Name"
                    required
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold mb-2">E-mail</label>
                    <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="E-mail"
                    required
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold mb-2">Phone Number</label>
                    <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="text"
                    placeholder="Phone Number"
                    required
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                {/* Address */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold mb-2">Address</label>
                    <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    placeholder="Address"
                    required
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                {/* Buttons span full width */}
                <div className="md:col-span-2 flex justify-between mt-4 gap-4">
                    <button
                    type="submit"
                    disabled={showSpinner}
                    className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition shadow"
                    >
                    {showSpinner ? "Saving..." : "Save Changes"}
                    </button>

                    <Link
                    to={"/viewaccount"}
                    className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center transition shadow"
                    >
                    Cancel
                    </Link>
                </div>
                </form>
            </div>
        </div>

    );
}