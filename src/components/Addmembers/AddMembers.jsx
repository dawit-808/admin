import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../api/api";

import { STEPS } from "./utils/constants";
import { useMemberForm } from "./hooks/useMemberForm";
import { useDependencies } from "./hooks/useDependencies";
import { useImageUpload } from "./hooks/useImageUpload";

import { StepIndicator } from "./ui";
import { StepIdentity } from "./steps/StepIdentity";
import { StepHealthEmergency } from "./steps/StepHealthEmergency";
import { StepDeployments } from "./steps/StepDeployments";

// ---------------------------------------------------------------------------

function AddMembers({ isOpen, onClose, onSuccess }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formData, setSection, setField, toggleArrayItem, reset } =
    useMemberForm();
  const deps = useDependencies(isOpen);
  const imgUpload = useImageUpload();

  if (!isOpen) return null;

  // Step 1 requires name + birth date before advancing
  const canAdvanceStep1 = formData.member.name && formData.member.b_date;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const imageUrl = await imgUpload.upload();

      const payload = {
        ...formData,
        member: {
          ...formData.member,
          address_id: formData.member.address_id
            ? parseInt(formData.member.address_id, 10)
            : null,
          url: imageUrl || formData.member.url,
        },
      };

      await api.post("/member-service/fullregister", payload);
      reset();
      imgUpload.reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabel = STEPS.find((s) => s.id === activeStep)?.header ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row min(680px, 90vh) overflow-hidden">
        {/* ── Left: Step sidebar ── */}
        <aside className="w-full md:w-60 bg-zinc-50 dark:bg-[#030303] border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                New Member
              </h2>
            </div>
            <nav className="space-y-4">
              {STEPS.map((step) => (
                <StepIndicator
                  key={step.id}
                  num={step.id}
                  label={step.label}
                  active={activeStep === step.id}
                  done={activeStep > step.id}
                  onClick={() => setActiveStep(step.id)}
                />
              ))}
            </nav>
          </div>
          <p className="hidden md:block text-[10px] text-zinc-400 leading-relaxed">
            All nodes register on final dataset commit.
          </p>
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
          <main className="flex-1 overflow-y-auto px-6 py-5">
            {activeStep === 1 && (
              <StepIdentity
                formData={formData}
                setSection={setSection}
                setField={setField}
                addresses={deps.addresses}
                imageUpload={imgUpload}
              />
            )}
            {activeStep === 2 && (
              <StepHealthEmergency
                formData={formData}
                setSection={setSection}
              />
            )}
            {activeStep === 3 && (
              <StepDeployments
                formData={formData}
                toggleArrayItem={toggleArrayItem}
                schedules={deps.schedules}
                trainingTypes={deps.trainingTypes}
                coaches={deps.coaches}
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
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {activeStep < 3 ? (
                <button
                  type="button"
                  disabled={activeStep === 1 && !canAdvanceStep1}
                  onClick={() => setActiveStep((p) => p + 1)}
                  className="px-5 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Saving…" : "Register Member"}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AddMembers;
