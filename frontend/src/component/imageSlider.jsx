import { useState } from "react";

export default function ImageSlider({ images }) {
    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-full lg:w-[70%] aspect-square relative p-8 lg:p-0">
                
                {/* Main Image */}
                <img 
                    src={activeImage} 
                    className="w-full h-full object-cover rounded-2xl shadow-lg transition-all duration-500 ease-in-out " 
                />

                {/* Thumbnails for Large Screens */}
                <div className="hidden lg:flex lg:w-[70%] h-[90px] bg-black/40 backdrop-blur-md rounded-xl absolute bottom-0 left-1/2 -translate-x-1/2 p-2 gap-3 justify-center items-center shadow-md">
                    {
                        images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                className={`h-full aspect-square rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                                    activeImage === image ? "border-white scale-105 shadow-lg" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                                }`} 
                                onClick={() => setActiveImage(image)} 
                            />
                        ))
                    }
                </div>

                {/* Thumbnails for Mobile */}
                <div className="absolute bottom-[-110px] w-full h-[100px] flex justify-center items-center gap-3 lg:hidden">
                    {
                        images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                className={`h-[70px] aspect-square rounded-full cursor-pointer border-2 transition-all duration-300 ${
                                    activeImage === image ? "border-blue-500 scale-105 shadow-md" : "border-gray-300 opacity-70 hover:opacity-100 hover:scale-105"
                                }`} 
                                onClick={() => setActiveImage(image)} 
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
