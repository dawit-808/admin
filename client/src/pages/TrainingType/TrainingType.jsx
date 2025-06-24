import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./TrainingType.module.css";

function TrainingTypesPage() {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/training-types")
      .then((res) => {
        setTrainingTypes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching training types:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={classes.page}>
      <h2 className={classes.title}>🏋️ Training Types</h2>

      {loading ? (
        <p className={classes.loading}>Loading training types...</p>
      ) : (
        <div className={classes.grid}>
          {trainingTypes.map((type) => (
            <div className={classes.card} key={type.id}>
              <h3 className={classes.cardTitle}>🏃 {type.name}</h3>
              <p className={classes.detail}>🗓 {type.training_day}</p>
              <p className={classes.detail}>⏰ {type.training_schedule}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrainingTypesPage;
