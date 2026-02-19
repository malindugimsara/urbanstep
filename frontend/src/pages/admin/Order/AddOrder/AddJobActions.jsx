import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddJobActions({ addItem, submitJob, showSpinner }) {
  const [showSelector, setShowSelector] = useState(false);

  const navigate = useNavigate();
  
  function closeEditor() {
    navigate("/admin/orders");
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-6 relative">

      {/* Add Another Item Button */}
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="flex items-center gap-2 bg-[#D16BA5] hover:bg-[#C25996] text-white px-6 py-3 rounded-xl shadow-md"
      >
        <FiPlus /> Add Item
      </button>

      {/* DROPDOWN SELECTOR */}
      {showSelector && (
        <div className="absolute top-20 bg-white border border-gray-300 shadow-lg rounded-xl p-4 w-60 z-50">
          <p className="font-semibold text-gray-800 mb-3">Select Item Type</p>

          <button
            onClick={() => {
              addItem("tute");
              setShowSelector(false);
            }}
            className="w-full py-2 mb-2 bg-blue-100 hover:bg-blue-200 rounded-lg"
          >
            Shoe
          </button>
        </div>
      )}


      <div className="flex flex-col gap-3 justify-start md:flex-row md:gap-6">
        {/* Submit Button */}
          <button
          onClick={submitJob}
          className="w-130 bg-blue-500 text-white text-xl py-4 rounded-xl font-bold hover:bg-blue-600"
          disabled={showSpinner}
        >
          {showSpinner ? "Adding..." : "Add Order"}

        </button>

        <button
          onClick={closeEditor}
          className="w-40 bg-gray-600 text-white text-xl py-4 rounded-xl font-bold hover:bg-gray-700"
        >
          Close
        </button>
      </div>

    </div>
  );
}
