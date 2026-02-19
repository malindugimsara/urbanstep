import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditUser() {
    const locationData = useLocation();
    const navigate = useNavigate();

    const userData = locationData.state;

    const [userID] = useState(userData?._id || "");
    const [name, setName] = useState(userData?.name || "");
    const [email, setEmail] = useState(userData?.email || "");
    const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || "");
    const [role, setRole] = useState(userData?.role || "");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        if (!userData) {
            toast.error("No user data found to edit.");
            navigate("/admin/users");
        }
    }, [userData, navigate]);

    if (!userData) {
        return null;
    }

    async function handleEditUser() {
        setShowSpinner(true);
        const updatedUser = {
            name,
            email,
            phoneNumber,
            role,
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
            navigate("/admin/users");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit user.");
            console.error(error);
        }finally {
            setShowSpinner(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Edit User</h1>
                <form
                    className="w-full flex flex-col gap-5"
                    onSubmit={e => {
                        e.preventDefault();
                        handleEditUser();
                    }}
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-semibold">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            type="text"
                            placeholder="Name"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-semibold">E-mail</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            type="email"
                            placeholder="E-mail"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-semibold">Phone Number</label>
                        <input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            type="text"
                            placeholder="Phone Number"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-semibold">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-white"
                            required
                        >
                            <option value="" disabled>
                                Select Role
                            </option>
                            <option value="admin">Admin</option>
                            <option value="user">Customer</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition mt-2 shadow"
                        disabled={showSpinner}
                    >
                       {showSpinner ? "Saving..." : "Save Changes"}
                    </button>
                </form>
                <Link
                    to={"/admin/users"}
                    className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center mt-4 transition shadow"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}