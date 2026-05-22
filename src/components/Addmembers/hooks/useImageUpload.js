import { useState } from "react";
import {
  createImagePreview,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";

/**
 * Manages image file selection, local preview, and Cloudinary upload.
 */
export function useImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);

  const selectFile = (incoming) => {
    if (!incoming?.type?.startsWith("image/")) return;
    setFile(incoming);
    setPreview(createImagePreview(incoming));
  };

  const handleInputChange = (e) => selectFile(e.target.files?.[0]);
  const handleDrop = (e) => selectFile(e.dataTransfer?.files?.[0]);

  /** Returns the secure_url string; empty string if no file selected */
  const upload = () => uploadImageToCloudinary(file, setProgress);

  const reset = () => {
    setFile(null);
    setPreview("");
    setProgress(0);
  };

  return {
    file,
    preview,
    progress,
    handleInputChange,
    handleDrop,
    upload,
    reset,
  };
}
