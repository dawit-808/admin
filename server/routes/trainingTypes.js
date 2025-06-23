// routes/trainingTypes.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM training_types");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching training types:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
