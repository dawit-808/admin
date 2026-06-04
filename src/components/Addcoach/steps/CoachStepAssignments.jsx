import { CheckList, ProgressBar, SectionHeading } from "../../Addmembers/ui";

export function CoachStepAssignments({
  formData,
  toggleArrayItem,
  schedules,
  trainingTypes,
  uploadProgress,
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <SectionHeading>Schedule Slots</SectionHeading>
          <CheckList
            items={schedules}
            selectedIds={formData.scheduleIds}
            onToggle={(id) => toggleArrayItem("scheduleIds", id)}
            renderLabel={(s) => [s.date, s.time].filter(Boolean).join(" · ")}
          />
        </div>

        <div className="space-y-2">
          <SectionHeading>Training Programs</SectionHeading>
          <CheckList
            items={trainingTypes}
            selectedIds={formData.trainingTypeIds}
            onToggle={(id) => toggleArrayItem("trainingTypeIds", id)}
            renderLabel={(t) => t.t_type}
          />
        </div>
      </div>

      <ProgressBar value={uploadProgress} />
    </div>
  );
}
