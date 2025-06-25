import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MemberDetails.module.css";

function MemberDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching member:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loading}>Loading member details...</p>
      </div>
    );

  if (!user)
    return <p className={styles.error}>Failed to load member details</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Member Profile</h1>
        <span className={styles.memberCode}>ID: {user.member_code}</span>
      </div>

      <div className={styles.profileContainer}>
        <div className={styles.imageSection}>
          <img
            src={user.profile_img_url || "/default-avatar.png"}
            alt={`${user.name}'s profile`}
            className={styles.profileImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className={styles.statusBadge}>
            <span
              className={`${styles.badge} ${
                user.payment_status === "paid" ? styles.paid : styles.unpaid
              }`}
            >
              {user.payment_status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h2 className={styles.userName}>{user.name}</h2>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Training Type</span>
              <span className={styles.detailValue}>{user.training_type}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Training Day</span>
              <span className={styles.detailValue}>{user.training_day}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Schedule</span>
              <span className={styles.detailValue}>
                {user.training_schedule}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetails;
