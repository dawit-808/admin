import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MemberDetails.module.css";

function MemberDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching member:", err));
  }, [id]);

  if (!user) return <p className={styles.loading}>Loading member details...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>👤 Member: {user.member_code}</h2>
      <div className={styles.card}>
        <div className={styles.field}>
          <span className={styles.label}>Name:</span>
          <span className={styles.value}>{user.name}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Training Type:</span>
          <span className={styles.value}>{user.training_type}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Training Day:</span>
          <span className={styles.value}>{user.training_day}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Schedule:</span>
          <span className={styles.value}>{user.training_schedule}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Payment Status:</span>
          <span
            className={`${styles.value} ${
              user.payment_status === "paid" ? styles.paid : styles.unpaid
            }`}
          >
            {user.payment_status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MemberDetails;
