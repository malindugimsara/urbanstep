import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserData(){
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token != null) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/current",  {
                headers: {
                    Authorization : "Bearer " + token,
                },
            }).then((response) => {
                setUserData(response.data.user);
            }).catch((error) => {
                console.error("Error fetching user data:", error);
                setUserData(null);
            })
        }
    }, []);

    return(
        <div>
            {
                (userData == null) ? (
                    <div className="h-full flex justify-center items-center flex row gap-4">
                        <Link to ="/login" className="text-lg text-black hover:text-blue-800 bg-blue-200 px-2 border border-2 rounded-lg">Login</Link>
                        <Link to ="/register" className="text-lg text-red-500 hover:text-red-800 bg-blue-200 px-2 border border-2 rounded-lg">Register</Link>
                    </div>
                ):
                (
                    <div className="h-full flex justify-center items-center flex row gap-4">
                        <span className="text-lg text-pink-50">Hello, {userData.firstName}</span>
                        <button className="text-lg text-black hover:text-blue-800 bg-blue-200 px-2 border border-2 rounded-lg"
                        onClick={() => {
                            localStorage.removeItem("token");
                            setUserData(null);
                            window.location = '/login';}
                            }>
                            Logout
                        </button>
                    </div>
                )
            }

        </div>

    )
}