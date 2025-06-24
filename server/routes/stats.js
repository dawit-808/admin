import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const [totalMembers] = await pool.query(`
      SELECT COUNT(*) AS count FROM users
    `);

    const [newThisMonth] = await pool.query(`
      SELECT COUNT(*) AS count FROM users
      WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())
    `);

    const [totalPaid] = await pool.query(`
      SELECT SUM(amount) AS total FROM payments
      WHERE status = 'paid'
      AND MONTH(paid_at) = MONTH(NOW()) AND YEAR(paid_at) = YEAR(NOW())
    `);

    const [pendingPayments] = await pool.query(`
      SELECT COUNT(*) AS count FROM payments
      WHERE status = 'pending'
    `);

    const [trainingDistribution] = await pool.query(`
      SELECT tt.name AS training_type, COUNT(*) AS count
      FROM users u
      JOIN training_types tt ON u.training_type_id = tt.id
      GROUP BY tt.name
    `);

    res.json({
      totalMembers: totalMembers[0].count,
      newMembersThisMonth: newThisMonth[0].count,
      totalPaidThisMonth: totalPaid[0].total || 0,
      pendingPayments: pendingPayments[0].count,
      trainingTypeDistribution: trainingDistribution,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
