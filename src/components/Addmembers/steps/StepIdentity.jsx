import { FormInput, SelectField, UploadZone } from "../ui";

export function StepIdentity({
  formData,
  setSection,
  setField,
  addresses,
  imageUpload,
}) {
  const { member, password } = formData;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-2">
          Member Avatar
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
          value={member.name}
          onChange={(v) => setSection("member", "name", v)}
          placeholder="e.g. Maverick Fox"
          required
        />
        <SelectField
          label="Gender"
          value={member.gender}
          onChange={(v) => setSection("member", "gender", v)}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </SelectField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Birth Date *"
          value={member.b_date}
          onChange={(v) => setSection("member", "b_date", v)}
          type="date"
          required
        />
        <FormInput
          label="Phone"
          value={member.phone}
          onChange={(v) => setSection("member", "phone", v)}
          placeholder="+251 9xx xxx xxxx"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Location *"
          value={member.address_id}
          onChange={(v) => setSection("member", "address_id", v)}
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
          value={password}
          onChange={(v) => setField("password", v)}
          type="password"
          placeholder="Defaults to 123456"
        />
      </div>
    </div>
  );
}
