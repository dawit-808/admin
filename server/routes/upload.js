import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const router = express.Router();
const upload = multer(); // stores files in memory
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const UPLOAD_TIMEOUT = 15000; // 15 seconds

router.post("/", upload.single("image"), async (req, res) => {
  let timeout;
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const base64Image = imageFile.buffer.toString("base64");
    const form = new FormData();
    form.append("image", base64Image);

    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      form,
      {
        signal: controller.signal,
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    clearTimeout(timeout);

    if (!response.data?.data?.url) {
      throw new Error("Invalid response from ImgBB");
    }

    return res.json({
      url: response.data.data.url,
      delete_url: response.data.data.delete_url,
    });
  } catch (err) {
    if (timeout) clearTimeout(timeout);

    const statusCode =
      err.code === "ECONNRESET" || err.name === "AbortError" ? 504 : 500;

    const errorMessage =
      err.code === "ECONNRESET" || err.name === "AbortError"
        ? "Image upload timed out"
        : "Failed to upload image";

    return res.status(statusCode).json({
      error: errorMessage,
      details: err.response?.data?.error?.message || err.message,
    });
  }
});

export default router;
