// src/components/admin/WelcomeAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { VscLoading } from "react-icons/vsc";
import { FaHourglassEnd, FaSpinner, FaCheckCircle } from "react-icons/fa";

export default function WelcomeAdmin() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "Admin";

  // State to store jobs
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/order1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
  const interval = setInterval(fetchJobs, 5000);
  return () => clearInterval(interval);
}, []);


  // Compute job counts
  const summary = { Pending: 0, "In Progress": 0, Completed: 0 };

  jobs.forEach(job => {
    job.items?.forEach(item => {
      if (summary[item.status] !== undefined) {
        summary[item.status]++;
      }
    });
  });

return (
    <div
        className="flex flex-col justify-center items-center h-full p-6"
        style={{
            backgroundImage: 'url("/bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
        }}
    >
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Welcome {userName}! 🎉
        </h1>
        <p className="text-lg text-gray-600 max-w-xl text-center">
            You are logged in as an administrator. Use the left menu to manage users, jobs, and accounts.  
            Have a productive session!
        </p>

        <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Admin"
            className="w-40 mt-6"
        />

        {/* Job Summary Cards */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 w-full max-w-4xl">
  {loading ? (
    <div className="w-full flex justify-center items-center py-10">
      <VscLoading className="text-5xl animate-spin text-blue-400" />
    </div>
  ) : (
    <>
      {/* Pending */}
      <div className="w-52 p-6 text-white text-center rounded-2xl
                      bg-gradient-to-br from-red-300 to-red-700
                      hover:scale-105 hover:shadow-2xl">
        <FaHourglassEnd className="text-4xl mx-auto mb-3 opacity-90" />
        <h2 className="text-lg font-semibold tracking-wide">Pending</h2>
        <p className="text-4xl font-extrabold mt-2">
          {summary.Pending}
        </p>
      </div>

      {/* In Progress */}
      <div className="w-52 p-6 text-white text-center rounded-2xl
                      bg-gradient-to-br from-yellow-700 to-yellow-200
                      shadow-lg transition-all duration-300
                      hover:scale-105 hover:shadow-2xl">
        <FaSpinner className="text-4xl mx-auto mb-3 opacity-90 animate-spin" />
        <h2 className="text-lg font-semibold tracking-wide">In Progress</h2>
        <p className="text-4xl font-extrabold mt-2">
          {summary['In Progress']}
        </p>
      </div>

      {/* Completed */}
      <div className="w-52 p-6 text-white text-center rounded-2xl
                      bg-gradient-to-br from-green-300 to-green-700
                      shadow-lg transition-all duration-300
                      hover:scale-105 hover:shadow-2xl">
        <FaCheckCircle className="text-4xl mx-auto mb-3 opacity-90" />
        <h2 className="text-lg font-semibold tracking-wide">Completed</h2>
        <p className="text-4xl font-extrabold mt-2">
          {summary.Completed}
        </p>
      </div>
    </>
  )}
</div>

    </div>
);
}
