import { useState, useEffect } from "react";
import api from "../../../api/api.js";

/**
 * Fetches all option lists needed to populate Step 1 and Step 3 selectors.
 * Only fires when `enabled` is true (i.e. modal is open).
 */
export function useDependencies(enabled) {
  const [schedules, setSchedules] = useState([]);
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      api.get("/schedules"),
      api.get("/training-types"),
      api.get("/coaches"),
      api.get("/address"),
    ])
      .then(([schRes, trainRes, coachRes, addrRes]) => {
        if (cancelled) return;
        setSchedules(schRes.data ?? []);
        setTrainingTypes(trainRes.data ?? []);
        setCoaches(coachRes.data ?? []);
        setAddresses(addrRes.data ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
        console.error("Failed loading dependencies:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { schedules, trainingTypes, coaches, addresses, loading, error };
}
