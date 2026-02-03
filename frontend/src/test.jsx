import { useState } from "react";
import mediaUpload from "../utils/mediaupload";


export default function TestPage() {
    const [file, setFile] = useState(null);

    function handleFileUpload() {
 
        mediaUpload(file)
            .then((url) => {
                console.log("File uploaded successfully:", url);
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
            });
    }
    return (
        <div className="w-full h-full rounded-lg p-1">
            <input type="file"  
            onChange={(e)=>{
                setFile(e.target.files[0]);
            }}/>
            <button onClick={handleFileUpload} className="bg-blue-500 text-white p-2 rounded mt-2">
                Upload File
            </button>
        </div>
    );
}