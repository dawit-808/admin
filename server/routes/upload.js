import express from "express";
import axios from "axios";
import FormData from "form-data";

const router = express.Router();

const IMGBB_API_KEY = "f29991c37db39ca41bd813521ed14932";

router.post("/", async (req, res) => {
  try {
    const { image } = req.body; // base64 string without data URL prefix

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const form = new FormData();
    // Use the base64 string directly
    form.append("image", image);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const imageUrl = response.data.data.url;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error("ImgBB upload error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to upload image",
      details: err.response?.data?.error?.message || err.message,
    });
  }
});

export default router;
