import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/create-tables", async (req, res) => {
  try {
    // 1. training_types
    await pool.query(`
      CREATE TABLE IF NOT EXISTS training_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        training_day VARCHAR(50) NOT NULL,
        training_schedule VARCHAR(100) NOT NULL
      )
    `);

    // 2. users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        member_code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        training_type_id INT NOT NULL,
        payment_status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
        profile_img_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (training_type_id) REFERENCES training_types(id)
      )
    `);

    // 3. payments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id CHAR(36),
        amount DECIMAL(10,2),
        method ENUM('cash', 'bank', 'cbe_birr', 'telebirr'),
        status ENUM('paid', 'pending', 'failed') DEFAULT 'paid',
        paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 4. member_health_data
    await pool.query(`
      CREATE TABLE IF NOT EXISTS member_health_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        height_cm DECIMAL(5,2),
        weight_kg DECIMAL(5,2),
        blood_pressure VARCHAR(20),
        pulse INT,
        medical_conditions TEXT,
        fitness_goals TEXT,
        injury_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 5. admins
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. login_logs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(100),
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
      )
    `);

    res.status(200).json({ message: "✅ All tables created successfully!" });
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    res
      .status(500)
      .json({ error: "Failed to create tables", details: error.message });
  }
});

export default router;
