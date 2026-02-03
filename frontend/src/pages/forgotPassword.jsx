import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const[otp, setOtp] = useState("");
    const[password, setPassword] = useState("");
    const[confirmPassword, setConfirmPassword]=useState("");
    const[emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    function sendEmail() {
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/user/sendMail  ", {
            email: email
        }).then((response) => {
            console.log("Email sent successfully!", response.data);
            setEmailSent(true);
            toast.success("Email sent successfully! Please check your inbox.");
        }).catch((error) => {
            console.error("Failed to send email:", error);
            toast.error(error.response?.data?.message || "Failed to send email. Please try again.");
        }
        )
    }
    function changePassword() {
        if(password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/user/changepw", {
            email: email,
            otp: otp,
            password: password
        }).then((response) => {
            console.log("Password changed successfully!", response.data);
            toast.success("Password changed successfully! You can now log in with your new password.");
            navigate("/");
        }).catch((error) => {
            console.error("Failed to change password:", error);
            toast.error(error.response?.data?.message || "Failed to change password. Please try again.");
            window.location.reload();
        })
    }
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-pink-200">
            
            {
                emailSent ?
                <div className="w-auto bg-white p-12 shadow-xl rounded-lg shadow-md flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Reset Password</h1>
                    <div>
                        <h3 className="text-gray-700 mb-1">Enter OTP</h3>
                        <input 
                            type="text" 
                            className="border border-gray-500 rounded-md mb-4 px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                            placeholder="OTP"
                            onChange={(e) => {
                                setOtp(e.target.value);
                            }}
                            value={otp}
                        />
                    </div>
                    <div>
                        <h3 className="text-gray-700 mb-1">New Password</h3>
                        <input 
                            type="text" 
                            className="border border-gray-500 rounded-md mb-4 px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                            placeholder="New Password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            value={password}
                        />
                    </div>
                    <div>
                        <h3 className="text-gray-700 mb-1">Confirm Password</h3>
                        <input 
                            type="text" 
                            className="border border-gray-500 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                            placeholder="Confirm Password"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                            value={confirmPassword}
                        />
                    </div>
                    <br />
                    <button className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={changePassword}
                    >
                        Reset Password
                    </button>
                </div>

            :<div className="w-auto bg-white p-12 shadow-xl rounded-lg shadow-md flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Forgot Password</h1>
                <input 
                    type="email" 
                    className="border border-gray-500 rounded-md px-4 py-2 mb-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                 placeholder="Email"
                 onChange={(e) => {
                    setEmail(e.target.value);
                }
                } 
                value={email}
                 /> <br />
                <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={sendEmail}>
                    Send Email
                </button>
            </div>}
            
        </div>
    )
}