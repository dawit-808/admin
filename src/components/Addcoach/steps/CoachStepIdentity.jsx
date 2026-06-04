// Shared UI primitives live in AddMembers/components/ui.jsx —
// adjust the import path to wherever you place them in your project.
import { FormInput, SelectField, UploadZone } from "../../Addmembers/ui";

export function CoachStepIdentity({
  formData,
  setField,
  addresses,
  imageUpload,
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-2">
          Coach Avatar
        </label>
        <UploadZone
          preview={imageUpload.preview}
          fileName={imageUpload.file?.name}
          onInputChange={imageUpload.handleInputChange}
          onDrop={imageUpload.handleDrop}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name *"
          value={formData.name}
          onChange={(v) => setField("name", v)}
          placeholder="e.g. Dawit Tesfaye"
          required
        />
        <SelectField
          label="Gender"
          value={formData.gender}
          onChange={(v) => setField("gender", v)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </SelectField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Birth Date *"
          value={formData.b_date}
          onChange={(v) => setField("b_date", v)}
          type="date"
          required
        />
        <FormInput
          label="Phone"
          value={formData.phone}
          onChange={(v) => setField("phone", v)}
          placeholder="09xx xxx xxxx"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Location *"
          value={formData.address_id}
          onChange={(v) => setField("address_id", v)}
          required
        >
          <option value="">— Select Location —</option>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {[a.sub_city, a.woreda].filter(Boolean).join(", ")}
            </option>
          ))}
        </SelectField>

        <FormInput
          label="Password"
          value={formData.password}
          onChange={(v) => setField("password", v)}
          type="password"
          placeholder="e.g. Password123!"
        />
      </div>
    </div>
  );
}
