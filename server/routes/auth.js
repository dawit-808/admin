import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "your_secret_key";

// Register new admin
router.post("/register", async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO admins (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [fullName, email, hashed, role || "admin"]
    );

    res.status(201).json({ message: "Admin registered" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login existing admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [admins] = await pool.query("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);
    if (admins.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = admins[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
