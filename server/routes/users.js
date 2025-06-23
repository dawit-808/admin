import express from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

const router = express.Router();

// Helper: generate readable member code like GYM001, GYM002, ...
async function generateMemberCode() {
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM users");
  const count = rows[0].count + 1;
  return `GYM${String(count).padStart(3, "0")}`; // e.g., GYM007
}

// GET all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  const {
    name,
    training_type,
    training_day,
    training_schedule,
    payment_status,
  } = req.body;

  if (!name || !training_type || !training_day || !training_schedule) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const id = uuidv4();
    const member_code = await generateMemberCode();

    const insertQuery = `
      INSERT INTO users (id, member_code, name, training_type, training_day, training_schedule, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(insertQuery, [
      id,
      member_code,
      name,
      training_type,
      training_day,
      training_schedule,
      payment_status || "unpaid",
    ]);

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// get single user with the id

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE user by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
