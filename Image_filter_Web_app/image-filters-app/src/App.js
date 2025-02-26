import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image } from "react-konva";
import Konva from "konva";

const FiltersApp = () => {
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState("");
  const imageRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result;
        img.crossOrigin = "Anonymous"; // Ensures CORS compatibility
        img.onload = () => {
          setImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageRef.current) {
      const imgNode = imageRef.current;
      imgNode.cache(); // Cache before applying filters

      // Apply filters
      switch (filter) {
        case "blur":
          imgNode.filters([Konva.Filters.Blur]);
          imgNode.blurRadius(10);
          break;
        case "bw":
          imgNode.filters([Konva.Filters.Grayscale]);
          break;
        case "sepia":
          imgNode.filters([Konva.Filters.Sepia]);
          break;
        default:
          imgNode.filters([]);
      }

      imgNode.getLayer().batchDraw(); // Redraw after applying filters
    }
  }, [filter, image]); // Re-run when filter or image changes

  return (
    <div className="flex flex-col items-center p-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      <div className="flex space-x-2 mb-4">
        <button onClick={() => setFilter("blur")} className="p-2 bg-blue-500 text-white rounded">Blur</button>
        <button onClick={() => setFilter("bw")} className="p-2 bg-gray-500 text-white rounded">Black & White</button>
        <button onClick={() => setFilter("sepia")} className="p-2 bg-yellow-500 text-white rounded">Sepia</button>
      </div>
      <Stage width={500} height={500} className="border border-gray-300">
        <Layer>
          {image && (
            <Image
              image={image}
              ref={imageRef}
              x={0}
              y={0}
              width={500}
              height={500}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default FiltersApp;
