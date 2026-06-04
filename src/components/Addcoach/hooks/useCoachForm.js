import { useState } from "react";
import { INITIAL_COACH_FORM } from "../utils/constants.js";

/**
 * Coach form is a flat structure (no nested sections like member).
 * Exposes typed setters so step components never touch raw setState.
 */
export function useCoachForm() {
  const [formData, setFormData] = useState(INITIAL_COACH_FORM);

  const setField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleArrayItem = (arrayField, id) =>
    setFormData((prev) => {
      const arr = prev[arrayField];
      return {
        ...prev,
        [arrayField]: arr.includes(id)
          ? arr.filter((x) => x !== id)
          : [...arr, id],
      };
    });

  const reset = () => setFormData(INITIAL_COACH_FORM);

  return { formData, setField, toggleArrayItem, reset };
}
