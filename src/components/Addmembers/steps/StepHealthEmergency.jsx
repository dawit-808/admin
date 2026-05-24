import { FormInput, SectionHeading } from "../ui";

export function StepHealthEmergency({ formData, setSection }) {
  const { health, emergency } = formData;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SectionHeading>Physical Status</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Height (cm)"
            value={health.height}
            onChange={(v) => setSection("health", "height", v)}
            placeholder="e.g. 182"
          />
          <FormInput
            label="Weight (kg)"
            value={health.weight}
            onChange={(v) => setSection("health", "weight", v)}
            placeholder="e.g. 78"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Medical Issues"
            value={health.issue}
            onChange={(v) => setSection("health", "issue", v)}
            placeholder="e.g. Asthma, Hypertension, None"
          />
          <FormInput
            label="Prior Injuries"
            value={health.injury}
            onChange={(v) => setSection("health", "injury", v)}
            placeholder="e.g. Left knee ACL, None"
          />
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      <div className="space-y-4">
        <SectionHeading>Emergency Contact</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Contact Name"
            value={emergency.contact_name}
            onChange={(v) => setSection("emergency", "contact_name", v)}
            placeholder="e.g. Elena Fox"
          />
          <FormInput
            label="Contact Phone"
            value={emergency.phone}
            onChange={(v) => setSection("emergency", "phone", v)}
            placeholder="+251 9xx xxx xxxx"
          />
          <FormInput
            label="Relationship"
            value={emergency.relationship}
            onChange={(v) => setSection("emergency", "relationship", v)}
            placeholder="Parent / Spouse"
          />
        </div>
      </div>
    </div>
  );
}
