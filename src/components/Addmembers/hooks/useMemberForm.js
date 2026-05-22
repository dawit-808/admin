import { useState } from "react";
import { INITIAL_FORM_DATA } from "../utils/constants.js";

/**
 * Encapsulates all form state logic for the AddMembers wizard.
 * Returns typed updaters instead of exposing raw setState.
 */
export function useMemberForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  /** Update a nested section field: member, health, emergency */
  const setSection = (section, field, value) =>
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));

  /** Update a root-level scalar field */
  const setField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  /** Toggle an id in/out of a root-level array field */
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

  const reset = () => setFormData(INITIAL_FORM_DATA);

  return { formData, setSection, setField, toggleArrayItem, reset };
}
