import express from "express";
import ImageKit from "imagekit";

const router = express.Router();

const imagekit = new ImageKit({
  publicKey: "public_edwR5o1Iwj7Rdwo3O6SxS/lMPxU=",
  privateKey: "private_53U//Zft87ghIMYfNCu9+tb6Up0=",
  urlEndpoint: "https://ik.imagekit.io/po5gykncz",
});

router.get("/auth", (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (err) {
    console.error("ImageKit auth error:", err);
    res.status(500).json({ error: "Failed to generate auth parameters" });
  }
});

export default router;
