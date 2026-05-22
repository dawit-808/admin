import { CLOUDINARY_URL, CLOUDINARY_PRESET } from "./constants.js";

/**
 * Uploads an image file to Cloudinary.
 * @param {File} file
 * @param {(progress: number) => void} onProgress
 * @returns {Promise<string>} secure_url
 */
export async function uploadImageToCloudinary(file, onProgress) {
  if (!file) return "";

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", CLOUDINARY_PRESET);

  onProgress?.(40);

  const res = await fetch(CLOUDINARY_URL, { method: "POST", body });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);

  onProgress?.(100);
  const data = await res.json();
  return data.secure_url;
}

/**
 * Converts a File to a local object URL for preview.
 */
export function createImagePreview(file) {
  return URL.createObjectURL(file);
}
