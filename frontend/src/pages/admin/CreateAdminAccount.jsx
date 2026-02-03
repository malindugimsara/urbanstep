import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function CreateAdminAccount() {
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phoneNumber: "",
        role: "",
        password: "",
        confirmPassword: "",
        isDisable: false,
        isEmailVerified: false
    });

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === "checkbox" ? checked : value 
        });
    }

    function handleRegister() {
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/", {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            role: formData.role,
            password: formData.password,
            isDisable: formData.isDisable,
            isEmailVerified: formData.isEmailVerified
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            toast.success("Account created successfully!");
            navigate("/admin");
        })
        .catch((err) => {
            toast.error(err.response?.data?.message || "Registration failed");
        });
    }

    function handleClear() {
        setFormData({
            name: "",
            email: "",
            address: "",
            phoneNumber: "",
            role: "user",
            password: "",
            confirmPassword: "",
            isDisable: false,
            isEmailVerified: false
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-lg bg-white/90 shadow-2xl rounded-2xl p-8 px-15 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-10 font-sans">Create User Account</h1>
                <form className="w-full flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Full Name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            type="text"
                            placeholder="Address"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            type="text"
                            placeholder="Phone Number"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition bg-white"
                        >
                            <option value="">Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleRegister}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 mt-2 transition"
                    >
                        Create Account
                    </button>
                    <div className="flex justify-between mt-2 gap-4">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg py-2 transition w-1/2"
                        >
                            Clear
                        </button>
                        <Link
                            to={"/admin/"}
                            className="bg-gray-400 hover:bg-gray-500 text-[#1E1E1E] font-semibold rounded-lg py-2 flex items-center justify-center transition w-1/2"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
