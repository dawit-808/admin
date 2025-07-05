import { useEffect, useState } from "react";
import MobileCapture from "./MobileCapture";
import DesktopWebcamCapture from "./DesktopWebcamCapture";
import { MdCameraAlt } from "react-icons/md";

function MemberReg() {
  const [formData, setFormData] = useState({
    name: "",
    trainingType: "",
    trainingSchedule: "",
    photo: null,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleCapture = (imgUrl) => {
    setFormData((prev) => ({ ...prev, photo: imgUrl }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    // Upload or save here
  };

  return (
    <div className="min-h-screen bg-[#0D1421] flex flex-col items-center p-6 text-gray-100">
      <h1 className="md:text-3xl text-blue-500 font-semibold mb-6">
        Register New Member
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#222531] rounded-lg shadow-lg p-6 max-w-4xl w-full flex flex-col md:flex-row gap-8"
      >
        {/* Capture Section */}
        <div className="flex flex-col items-center md:w-1/3">
          <label className="mb-4 flex items-center gap-2 text-lg font-medium">
            <MdCameraAlt size={24} />
            Member Photo
          </label>
          {isMobile ? (
            <MobileCapture onCapture={handleCapture} />
          ) : (
            <DesktopWebcamCapture onCapture={handleCapture} />
          )}
        </div>

        {/* Inputs */}
        <div className="flex flex-col pt-10 gap-5 md:w-2/3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 rounded-md bg-[#0D1421] border border-gray-600 focus:border-blue-500 outline-none placeholder-gray-400"
          />

          <select
            name="trainingType"
            value={formData.trainingType}
            onChange={handleChange}
            required
            className="p-3 rounded-md bg-[#0D1421] border border-gray-600 focus:border-blue-500 outline-none text-gray-100"
          >
            <option value="" disabled>
              Select Training Type
            </option>
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
            <option value="Flexibility">Flexibility</option>
          </select>

          <select
            name="trainingSchedule"
            value={formData.trainingSchedule}
            onChange={handleChange}
            required
            className="p-3 rounded-md bg-[#0D1421] border border-gray-600 focus:border-blue-500 outline-none text-gray-100"
          >
            <option value="" disabled>
              Select Training Schedule
            </option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Weekend">Weekend</option>
          </select>

          <button
            type="submit"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-md"
          >
            Register Member
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberReg;
