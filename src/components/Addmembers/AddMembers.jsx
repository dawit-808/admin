import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Loader2 } from "lucide-react";
import api from "../../api/api";

import { STEPS } from "./utils/constants";
import { useMemberForm } from "./hooks/useMemberForm";
import { useDependencies } from "./hooks/useDependencies";
import { useImageUpload } from "./hooks/useImageUpload";

import { StepIndicator } from "./ui";
import { StepIdentity } from "./steps/StepIdentity";
import { StepHealthEmergency } from "./steps/StepHealthEmergency";
import { StepDeployments } from "./steps/StepDeployments";

function AddMembers({ isOpen, onClose, onSuccess }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formData, setSection, setField, toggleArrayItem, reset } =
    useMemberForm();
  const deps = useDependencies(isOpen);
  const imgUpload = useImageUpload();

  if (!isOpen) return null;

  // Validation Logic
  const canAdvance = {
    1: formData.member.name && formData.member.b_date,
    2: true, // Add validation for health if needed
    3: true,
  };

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabel = STEPS.find((s) => s.id === activeStep)?.header ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row h-[min(720px,90vh)] overflow-hidden rounded-2xl">
        {/* ── Left: Pro Sidebar ── */}
        <aside className="w-full md:w-64 bg-zinc-50/50 dark:bg-zinc-900/20 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
              New Member
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Complete the onboarding flow.
            </p>
          </div>

          <nav className="space-y-1">
            {STEPS.map((step) => (
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
        </aside>

        {/* ── Right: Form content ── */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* Header */}
          <header className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {stepLabel}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          </header>

          {/* Scrollable step content */}
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-2 duration-500">
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
            </div>
          </main>

          {/* Footer nav */}
          <footer className="px-8 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#09090b] flex items-center justify-between shrink-0">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((p) => p - 1)}
                  className="px-5 py-2 text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-95 cursor-pointer"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {activeStep < 3 ? (
                <button
                  type="button"
                  disabled={!canAdvance[activeStep]}
                  onClick={() => setActiveStep((p) => p + 1)}
                  className="px-8 py-2.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-full disabled:opacity-40 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-2.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-full disabled:opacity-50 transition-all active:scale-95 cursor-pointer shadow-md flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                  {isSubmitting ? "Processing..." : "Register Member"}
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
