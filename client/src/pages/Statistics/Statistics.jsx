import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Statistics.module.css";

function Statistics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/stats/summary")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  if (!stats) {
    return <p className={styles.loadingText}>Loading statistics...</p>;
  }

  return (
    <div className={styles.statsPage}>
      <h2 className={styles.statsTitle}>📈 Gym Dashboard Overview</h2>

      <div className={styles.cardsGrid}>
        <div className={styles.statCard}>
          <p className={styles.cardLabel}>Total Members</p>
          <h3 className={styles.cardValue}>{stats.totalMembers}</h3>
        </div>
        <div className={styles.statCard}>
          <p className={styles.cardLabel}>New This Month</p>
          <h3 className={styles.cardValue}>{stats.newMembersThisMonth}</h3>
        </div>
        <div className={styles.statCard}>
          <p className={styles.cardLabel}>Payments This Month</p>
          <h3 className={styles.cardValue}>${stats.totalPaidThisMonth}</h3>
        </div>
        <div className={styles.statCard}>
          <p className={styles.cardLabel}>Pending Payments</p>
          <h3 className={styles.cardValue}>{stats.pendingPayments}</h3>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
