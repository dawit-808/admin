import { useState } from "react";

function MobileCapture({ onCapture }) {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setPreview(imgURL);
    onCapture(imgURL);
  };

  const handleRetake = () => {
    setPreview(null);
    onCapture(null);
  };

  return (
    <div>
      {!preview && (
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          className="mb-2"
        />
      )}

      {preview && (
        <div className="flex flex-col gap-2">
          <img src={preview} alt="Preview" className="w-48 rounded shadow" />
          <button
            onClick={handleRetake}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Retake
          </button>
        </div>
      )}
    </div>
  );
}

export default MobileCapture;
