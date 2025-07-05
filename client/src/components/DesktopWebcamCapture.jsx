import { useRef, useState } from "react";
import Webcam from "react-webcam";

function DesktopWebcamCapture({ onCapture }) {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
    onCapture(imgSrc);
  };

  const handleRetake = () => {
    setImage(null);
    onCapture(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setImage(imgURL);
    onCapture(imgURL);
  };

  return (
    <div>
      {!image ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            className="rounded mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={capture}
              className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer"
            >
              Capture
            </button>

            {/* File input button */}
            <label
              htmlFor="fileInput"
              className="px-3 py-1 bg-gray-600 text-white rounded cursor-pointer"
            >
              Choose File
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <img src={image} alt="Captured" className="w-75 rounded shadow" />
          <button
            onClick={handleRetake}
            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
          >
            Retake
          </button>
        </div>
      )}
    </div>
  );
}

export default DesktopWebcamCapture;
