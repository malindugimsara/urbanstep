import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiFileText, FiCalendar, FiPackage } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

export default function ReportGenerate() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
    const [statusFilter, setStatusFilter] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        const filterJobs = () => {
            let filtered = [...jobs];

            if (statusFilter) {
                filtered = filtered.filter(job => job.status === statusFilter);
            }

            if (dateFilter.from) {
                filtered = filtered.filter(job => {
                    const jobDate = new Date(job.needDate);
                    const fromDate = new Date(dateFilter.from);
                    return jobDate >= fromDate;
                });
            }

            if (dateFilter.to) {
                filtered = filtered.filter(job => {
                    const jobDate = new Date(job.needDate);
                    const toDate = new Date(dateFilter.to);
                    return jobDate <= toDate;
                });
            }

            setFilteredJobs(filtered);
        };

        filterJobs();
    }, [jobs, dateFilter, statusFilter]);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/jobcustomer",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setJobs(response.data);
            setLoading(false);
        } catch {
            toast.error("Failed to fetch jobs");
            setLoading(false);
        }
    };

    const generatePDFReport = () => {
        setGenerating(true);
        try {
            if (filteredJobs.length === 0) {
                toast.error("No data available to generate report");
                setGenerating(false);
                return;
            }

            const doc = new jsPDF();
            const currentDate = new Date().toLocaleDateString();

            // Title & header
            doc.setFontSize(20);
            doc.setTextColor(40, 116, 166);
            doc.text("Print Shop", 20, 25);

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("Job Report", 20, 35);
            doc.setFontSize(10);
            doc.text(`Generated on: ${currentDate}`, 20, 45);
            doc.text(`Total Jobs: ${filteredJobs.length}`, 20, 52);

            // Filters info
            let filterInfo = "Filters Applied: ";
            if (statusFilter) filterInfo += `Status: ${statusFilter}, `;
            if (dateFilter.from) filterInfo += `From: ${dateFilter.from}, `;
            if (dateFilter.to) filterInfo += `To: ${dateFilter.to}, `;
            if (filterInfo === "Filters Applied: ") filterInfo += "None";

            doc.text(filterInfo, 20, 59);

            // Status summary
            const statusCounts = filteredJobs.reduce((acc, job) => {
                acc[job.status] = (acc[job.status] || 0) + 1;
                return acc;
            }, {});

            let yPosition = 70;
            doc.setFontSize(12);
            doc.setTextColor(40, 116, 166);
            doc.text("Status Summary:", 20, yPosition);
            yPosition += 10;
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            Object.entries(statusCounts).forEach(([status, count]) => {
                doc.text(`${status}: ${count}`, 25, yPosition);
                yPosition += 7;
            });

            // Table data
            const tableData = filteredJobs.map(job => [
                job.jobID || "N/A",
                job.name || "N/A",
                job.email || "N/A",
                job.phoneNumber || "N/A",
                job.status || "N/A",
                job.needDate ? new Date(job.needDate).toLocaleDateString() : "N/A",
                job.details ? (job.details.substring(0, 30) + (job.details.length > 30 ? "..." : "")) : "N/A"
            ]);

            autoTable(doc, {
                head: [['Job ID', 'Name', 'Email', 'Phone Number', 'Status', 'Need Date', 'Details']],
                body: tableData,
                startY: yPosition + 10,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [40, 116, 166], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                columnStyles: {
                    0: { cellWidth: 25 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 35 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 22 },
                    6: { cellWidth: 25 }
                }
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(
                    `Page ${i} of ${pageCount} - Channa Graphic`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            doc.save(`job_report_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("Report generated successfully!");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error(`Failed to generate report: ${error.message}`);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <FiFileText className="text-3xl text-blue-600 mr-4" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
                            <p className="text-gray-600 mt-1">Generate comprehensive job reports</p>
                            <p className="text-sm text-blue-600 mt-1">
                                Loaded: {jobs.length} jobs | Filtered: {filteredJobs.length} jobs
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={generatePDFReport}
                            disabled={generating}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                            {generating ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            ) : (
                                <FiDownload className="mr-2" />
                            )}
                            {generating ? "Generating..." : "Generate PDF Report"}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FiCalendar className="mr-2" />
                        Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                value={dateFilter.from}
                                onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                value={dateFilter.to}
                                onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setDateFilter({ from: "", to: "" });
                                    setStatusFilter("");
                                }}
                                className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Jobs</p>
                                <p className="text-3xl font-bold">{filteredJobs.length}</p>
                            </div>
                            <FiPackage className="text-2xl opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Pending</p>
                                <p className="text-3xl font-bold">
                                    {filteredJobs.filter(j => j.status === "Pending").length}
                                </p>
                            </div>
                            <FiPackage className="text-2xl opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">In Progress</p>
                                <p className="text-3xl font-bold">
                                    {filteredJobs.filter(j => j.status === "In Progress").length}
                                </p>
                            </div>
                            <FiPackage className="text-2xl opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Completed</p>
                                <p className="text-3xl font-bold">
                                    {filteredJobs.filter(j => j.status === "Completed").length}
                                </p>
                            </div>
                            <FiPackage className="text-2xl opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Preview Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Report Preview</h3>
                        <p className="text-sm text-gray-600">Showing {filteredJobs.length} jobs</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Need Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredJobs.slice(0, 10).map((job, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.jobID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                job.status === "Completed" ? "bg-green-100 text-green-800" :
                                                job.status === "In Progress" ? "bg-purple-100 text-purple-800" :
                                                "bg-yellow-100 text-yellow-800"
                                            }`}>{job.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {job.needDate ? new Date(job.needDate).toLocaleDateString() : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredJobs.length > 10 && (
                            <div className="px-6 py-4 bg-gray-50 text-center">
                                <p className="text-sm text-gray-600">... and {filteredJobs.length - 10} more jobs</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}