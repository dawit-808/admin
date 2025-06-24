import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Statistics.module.css";

export default function Statistics() {
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

      <div className={styles.trainingDistribution}>
        <h3 className={styles.sectionTitle}>🏋️ Training Type Distribution</h3>
        <ul className={styles.distributionList}>
          {stats.trainingTypeDistribution.map((type) => (
            <li key={type.training_type} className={styles.distributionItem}>
              <span>{type.training_type}</span>
              <strong>{type.count}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
