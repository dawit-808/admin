import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiCalendar,
  FiClock,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import classes from "./TrainingType.module.css";

function TrainingType() {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("types");

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const [typesRes, distRes] = await Promise.all([
          axios.get("http://localhost:5000/training-types"),
          axios.get("http://localhost:5000/stats/summary"),
        ]);
        setTrainingTypes(typesRes.data);
        setDistribution(distRes.data.trainingTypeDistribution || []);
      } catch (err) {
        console.error("Error fetching training types or distribution:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingTypes();
  }, []);

  // Calculate percentages for distribution
  const totalTrainings = distribution.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const distributionWithPercent = distribution.map((item) => ({
    ...item,
    percentage:
      totalTrainings > 0 ? Math.round((item.count / totalTrainings) * 100) : 0,
  }));

  return (
    <div className={classes.page}>
      <header className={classes.header}>
        <h1 className={classes.title}>
          <span className={classes.titleIcon}>🏋️</span>
          Training Program Dashboard
        </h1>
        <div className={classes.tabs}>
          <button
            className={`${classes.tab} ${
              activeTab === "types" ? classes.activeTab : ""
            }`}
            onClick={() => setActiveTab("types")}
          >
            Training Types
          </button>
          <button
            className={`${classes.tab} ${
              activeTab === "analytics" ? classes.activeTab : ""
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>
      </header>

      {loading ? (
        <div className={classes.loadingContainer}>
          <div className={classes.spinner}></div>
          <p className={classes.loadingText}>Loading training data...</p>
        </div>
      ) : (
        <>
          {activeTab === "types" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={classes.grid}
            >
              {trainingTypes.map((type) => (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={classes.card}
                  key={type.id}
                >
                  <div className={classes.cardHeader}>
                    <div className={classes.cardIcon}>
                      {type.name.includes("Cardio")
                        ? "🏃"
                        : type.name.includes("Strength")
                        ? "💪"
                        : type.name.includes("Yoga")
                        ? "🧘"
                        : "🏋️"}
                    </div>
                    <h3 className={classes.cardTitle}>{type.name}</h3>
                  </div>
                  <div className={classes.cardDetails}>
                    <div className={classes.detailItem}>
                      <FiCalendar className={classes.detailIcon} />
                      <span>{type.training_day}</span>
                    </div>
                    <div className={classes.detailItem}>
                      <FiClock className={classes.detailIcon} />
                      <span>{type.training_schedule}</span>
                    </div>
                    {type.description && (
                      <p className={classes.cardDescription}>
                        {type.description}
                      </p>
                    )}
                  </div>
                  <button className={classes.cardButton}>View Sessions</button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <div className={classes.analyticsContainer}>
              <div className={classes.statsGrid}>
                <div className={classes.statCard}>
                  <div className={classes.statHeader}>
                    <FiActivity className={classes.statIcon} />
                    <h4>Total Training Types</h4>
                  </div>
                  <div className={classes.statValue}>
                    {trainingTypes.length}
                  </div>
                </div>

                <div className={classes.statCard}>
                  <div className={classes.statHeader}>
                    <FiTrendingUp className={classes.statIcon} />
                    <h4>Total Sessions</h4>
                  </div>
                  <div className={classes.statValue}>{totalTrainings}</div>
                </div>
              </div>

              <div className={classes.distributionSection}>
                <div className={classes.sectionHeader}>
                  <h3 className={classes.sectionTitle}>
                    <FiAward className={classes.sectionIcon} />
                    Training Distribution
                  </h3>
                  <div className={classes.legend}>
                    <span className={classes.legendItem}>Count</span>
                    <span className={classes.legendItem}>Percentage</span>
                  </div>
                </div>

                <ul className={classes.distributionList}>
                  {distributionWithPercent.map((item) => (
                    <li
                      key={item.training_type}
                      className={classes.distributionItem}
                    >
                      <div className={classes.distributionInfo}>
                        <span className={classes.distributionName}>
                          {item.training_type}
                        </span>
                        <div className={classes.distributionBarContainer}>
                          <div
                            className={classes.distributionBar}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={classes.distributionValues}>
                        <span className={classes.distributionCount}>
                          {item.count}
                        </span>
                        <span className={classes.distributionPercentage}>
                          {item.percentage}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TrainingType;
