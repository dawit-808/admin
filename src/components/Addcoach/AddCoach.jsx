import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../api/api.js";

import { COACH_STEPS } from "./utils/constants.js";
import { useCoachForm } from "./hooks/useCoachForm.js";
import { useDependencies } from "../Addmembers/hooks/useDependencies.js";
import { useImageUpload } from "../Addmembers/hooks/useImageUpload.js";
import { StepIndicator } from "../Addmembers/ui.jsx";
import { CoachStepIdentity } from "./steps/CoachStepIdentity.jsx";
import { CoachStepAssignments } from "./steps/CoachStepAssignments.jsx";

// ---------------------------------------------------------------------------

function AddCoach({ isOpen, onClose, onSuccess }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formData, setField, toggleArrayItem, reset } = useCoachForm();
  const deps = useDependencies(isOpen); // reuses member hook — same endpoints
  const imgUpload = useImageUpload();

  if (!isOpen) return null;

  const canAdvance = formData.name && formData.b_date;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const imageUrl = await imgUpload.upload();

      const payload = {
        name: formData.name,
        gender: formData.gender,
        b_date: formData.b_date,
        phone: formData.phone,
        address_id: formData.address_id
          ? parseInt(formData.address_id, 10)
          : null,
        url: imageUrl || formData.url,
        scheduleIds: formData.scheduleIds,
        trainingTypeIds: formData.trainingTypeIds,
        password: formData.password,
      };

      await api.post("/coach-service/fullregister", payload);
      reset();
      imgUpload.reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Coach registration failed:", err);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabel = COACH_STEPS.find((s) => s.id === activeStep)?.header ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div
        className="w-full max-w-3xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row overflow-hidden"
        style={{ height: "min(600px, 90vh)", maxHeight: "90vh" }}
      >
        {/* ── Left: Step sidebar ── */}
        <aside className="w-full md:w-56 bg-zinc-50 dark:bg-[#030303] border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                New Coach
              </h2>
            </div>
            <nav className="space-y-4">
              {COACH_STEPS.map((step) => (
                <StepIndicator
                  key={step.id}
                  num={step.id}
                  label={step.label}
                  active={activeStep === step.id}
                  done={activeStep > step.id}
                  onClick={() => activeStep > step.id && setActiveStep(step.id)} // Allow jumping back to completed steps
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Right: Form content ── */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <header className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
              {stepLabel}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors"
            >
              <CloseIcon fontSize="small" />
            </button>
          </header>

          {/* Scrollable step content */}
          <main className="flex-1 overflow-y-auto px-6 py-4">
            {activeStep === 1 && (
              <CoachStepIdentity
                formData={formData}
                setField={setField}
                addresses={deps.addresses}
                imageUpload={imgUpload}
              />
            )}
            {activeStep === 2 && (
              <CoachStepAssignments
                formData={formData}
                toggleArrayItem={toggleArrayItem}
                schedules={deps.schedules}
                trainingTypes={deps.trainingTypes}
                uploadProgress={imgUpload.progress}
              />
            )}
          </main>

          {/* Footer nav */}
          <footer className="px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#030303]/10 flex items-center justify-between shrink-0">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((p) => p - 1)}
                  className="px-4 py-2 text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>

              {activeStep < 2 ? (
                <button
                  type="button"
                  disabled={!canAdvance}
                  onClick={() => setActiveStep((p) => p + 1)}
                  className="px-5 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black disabled:opacity-40 transition-colors  rounded-full cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black disabled:opacity-50 transition-colors rounded-full cursor-pointer"
                >
                  {isSubmitting ? "Saving…" : "Register Coach"}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AddCoach;
