import { useState } from "react";
import QRCode from "react-qr-code";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import HomeIcon from "@mui/icons-material/Home";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import HeightIcon from "@mui/icons-material/Height";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import HealingIcon from "@mui/icons-material/Healing";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import api from "../../api/api";
import { EditFieldsModal, AssignmentModal } from "./EditModals";

export function ProfileInfoItem({ icon, label, value, isMono = false }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider font-mono">
          {label}
        </p>
        <p
          className={`text-xs tracking-tight truncate ${
            value
              ? "text-zinc-900 dark:text-zinc-200 font-medium"
              : "text-zinc-400 dark:text-zinc-600 italic"
          } ${isMono ? "font-mono" : ""}`}
        >
          {value || "None"}
        </p>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] animate-pulse p-12 flex justify-center items-center">
      <div className="w-full max-w-6xl h-150 bg-white dark:bg-zinc-900/20 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
    </div>
  );
}

function EditButton({ onClick, label = "Edit" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="p-1 rounded-md text-zinc-300 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
    >
      <EditIcon sx={{ fontSize: 14 }} />
    </button>
  );
}

export function ProfileHeader({ profile, isActive }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-inner shrink-0 flex items-center justify-center">
          {profile.url || profile.img_url ? (
            <img
              src={profile.url || profile.img_url}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <PersonIcon sx={{ fontSize: 36, color: "#a1a1aa" }} />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              {profile.name}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium rounded-full ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-mono font-bold tracking-wide text-zinc-400">
            <span className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
              ID : {profile.ras_id || "N/A"}
            </span>
            <span>•</span>
            <span className="bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-500">
              {profile.gender || "Unspecified"}
            </span>
          </div>
        </div>
      </div>

      <div className="self-start md:self-auto bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-850 flex items-center gap-4 max-w-xs shadow-sm">
        <div className="p-1.5 bg-white rounded-lg inline-block shrink-0">
          <QRCode
            value={`${window.location.origin}/members/${profile.id}`}
            size={64}
            bgColor="#ffffff"
            fgColor="#09090b"
          />
        </div>
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            Member QR Pass
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">
            Scan for check-in or access validation
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Personal Records  ->  PUT /members/:id                            */
/* ---------------------------------------------------------------- */

function getAddressLabel(addr) {
  if (addr.sub_city || addr.woreda) {
    return `${addr.sub_city || "-"}, Woreda ${addr.woreda || "-"}`;
  }
  return addr.name || `Address #${addr.id}`;
}

export function PersonalRecordsSection({ profile, memberId, onUpdated }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const openEdit = async () => {
    setIsEditOpen(true);
    setLoadingAddresses(true);
    try {
      const res = await api.get("/address");
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text" },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    { name: "phone", label: "Phone Number", type: "text" },
    { name: "ras_id", label: "Member ID", type: "text" },
    { name: "b_date", label: "Date of Birth", type: "date" },
    { name: "url", label: "Profile Image URL", type: "text" },
    {
      name: "address_id",
      label: loadingAddresses ? "Address (loading...)" : "Address",
      type: "select",
      options: addresses.map((a) => ({
        value: a.id,
        label: getAddressLabel(a),
      })),
    },
  ];

  const initialValues = {
    name: profile.name || "",
    gender: profile.gender || "",
    phone: profile.phone || "",
    ras_id: profile.ras_id || "",
    b_date: profile.b_date ? profile.b_date.slice(0, 10) : "",
    url: profile.url || profile.img_url || "",
    address_id: profile.address_id ?? profile.address?.id ?? "",
  };

  const handleSave = async (values) => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/members/${memberId}`, values);
      await onUpdated();
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update personal records:", err);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Personal Records
        </h3>
        <EditButton onClick={openEdit} label="Edit personal records" />
      </div>

      <div className="space-y-3.5">
        <ProfileInfoItem
          icon={<PhoneIcon sx={{ fontSize: 13 }} />}
          label="Phone Number"
          value={profile.phone}
          isMono
        />
        <ProfileInfoItem
          icon={<BadgeIcon sx={{ fontSize: 13 }} />}
          label="Member ID"
          value={profile.ras_id}
          isMono
        />
        <ProfileInfoItem
          icon={<CakeIcon sx={{ fontSize: 13 }} />}
          label="Date of Birth"
          value={
            profile.b_date
              ? new Date(profile.b_date).toLocaleDateString()
              : null
          }
        />
        <ProfileInfoItem
          icon={<HomeIcon sx={{ fontSize: 13 }} />}
          label="Address"
          value={
            profile.sub_city || profile.woreda
              ? `${profile.sub_city || "-"}, Woreda ${profile.woreda || "-"}`
              : null
          }
        />
      </div>

      <EditFieldsModal
        open={isEditOpen}
        title="Edit Personal Records"
        fields={fields}
        initialValues={initialValues}
        saving={saving}
        error={error}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Health Metrics  ->  PUT /health/:memberId                         */
/* ---------------------------------------------------------------- */

export function HealthMetricsSection({ profile, memberId, onUpdated }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // bloodType isn't part of the /health payload, so it's read-only here.
  const fields = [
    { name: "height", label: "Height (cm)", type: "number" },
    { name: "weight", label: "Weight (kg)", type: "number" },
    { name: "issue", label: "Medical Issue", type: "textarea" },
    { name: "injury", label: "Reported Injury", type: "textarea" },
  ];

  const initialValues = {
    height: profile.health?.height ?? "",
    weight: profile.health?.weight ?? "",
    issue: profile.health?.issue ?? "",
    injury: profile.health?.injury ?? "",
  };

  const handleSave = async (values) => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/health/${memberId}`, values);
      await onUpdated();
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update health metrics:", err);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Health Metrics
        </h3>
        <EditButton
          onClick={() => setIsEditOpen(true)}
          label="Edit health metrics"
        />
      </div>

      <div className="space-y-3.5">
        <ProfileInfoItem
          icon={<MonitorWeightIcon sx={{ fontSize: 13 }} />}
          label="Weight"
          value={profile.health?.weight ? `${profile.health.weight} kg` : null}
        />
        <ProfileInfoItem
          icon={<HeightIcon sx={{ fontSize: 13 }} />}
          label="Height"
          value={profile.health?.height ? `${profile.health.height} cm` : null}
        />
        <ProfileInfoItem
          icon={<BloodtypeIcon sx={{ fontSize: 13 }} />}
          label="Blood Type"
          value={profile.health?.bloodType}
        />
        <ProfileInfoItem
          icon={<HealingIcon sx={{ fontSize: 13 }} />}
          label="Reported Injury"
          value={profile.health?.injury}
        />
        <ProfileInfoItem
          icon={<MedicalServicesIcon sx={{ fontSize: 13 }} />}
          label="Medical Issue"
          value={profile.health?.issue}
        />
      </div>

      <EditFieldsModal
        open={isEditOpen}
        title="Edit Health Metrics"
        fields={fields}
        initialValues={initialValues}
        saving={saving}
        error={error}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Emergency Contact  ->  PUT /emergency/:memberId                   */
/* ---------------------------------------------------------------- */

export function EmergencyContactSection({ profile, memberId, onUpdated }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fields = [
    { name: "contact_name", label: "Contact Name", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "relationship", label: "Relationship", type: "text" },
  ];

  const initialValues = {
    contact_name: profile.emergency?.contact_name || "",
    phone: profile.emergency?.phone || "",
    relationship: profile.emergency?.relationship || "",
  };

  const handleSave = async (values) => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/emergency/${memberId}`, values);
      await onUpdated();
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update emergency contact:", err);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Emergency Contact
        </h3>
        <EditButton
          onClick={() => setIsEditOpen(true)}
          label="Edit emergency contact"
        />
      </div>

      <div className="space-y-3.5">
        <ProfileInfoItem
          icon={<PersonIcon sx={{ fontSize: 13 }} />}
          label="Contact Name"
          value={profile.emergency?.contact_name}
        />
        <ProfileInfoItem
          icon={<PhoneIcon sx={{ fontSize: 13 }} />}
          label="Phone"
          value={profile.emergency?.phone}
          isMono
        />
        <ProfileInfoItem
          icon={<BadgeIcon sx={{ fontSize: 13 }} />}
          label="Relationship"
          value={profile.emergency?.relationship}
        />
      </div>

      <EditFieldsModal
        open={isEditOpen}
        title="Edit Emergency Contact"
        fields={fields}
        initialValues={initialValues}
        saving={saving}
        error={error}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Training Scope  ->  assign/remove against GET /training-types/    */
/* ---------------------------------------------------------------- */

export function TrainingScopeSection({ profile, memberId, onUpdated }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const currentIds = (profile.trainingTypes || []).map((t) => t.id);

  const openEdit = async () => {
    setIsEditOpen(true);
    setLoadingOptions(true);
    try {
      const res = await api.get("/training-types/");
      setOptions(res.data || []);
    } catch (err) {
      console.error("Failed to load training types:", err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSave = async (selectedIds) => {
    setSaving(true);
    setError(null);
    try {
      const toAdd = selectedIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !selectedIds.includes(id));

      if (toAdd.length) {
        await api.post("/training-types/member/assign", {
          memberId,
          typeIds: toAdd,
        });
      }
      await Promise.all(
        toRemove.map((typeId) =>
          api.delete("/training-types/member/remove", {
            data: { memberId, typeId },
          }),
        ),
      );

      await onUpdated();
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update training scope:", err);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Training Scope
        </h3>
        <EditButton onClick={openEdit} label="Edit training scope" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {profile.trainingTypes?.length > 0 ? (
          profile.trainingTypes.map((t) => (
            <span
              key={t.id}
              className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 text-xs font-medium"
            >
              {t.t_type || t.name}
            </span>
          ))
        ) : (
          <p className="text-xs italic text-zinc-400">No types assigned</p>
        )}
      </div>

      <AssignmentModal
        open={isEditOpen}
        title="Edit Training Scope"
        options={options}
        getOptionId={(o) => o.id}
        getOptionLabel={(o) => o.t_type || o.name}
        initialSelectedIds={currentIds}
        loadingOptions={loadingOptions}
        saving={saving}
        error={error}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Schedules  ->  assign/remove against GET /schedules/               */
/* ---------------------------------------------------------------- */

export function SchedulesSection({ profile, memberId, onUpdated }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const currentIds = (profile.schedules || []).map((s) => s.id);

  const openEdit = async () => {
    setIsEditOpen(true);
    setLoadingOptions(true);
    try {
      const res = await api.get("/schedules/");
      setOptions(res.data || []);
    } catch (err) {
      console.error("Failed to load schedules:", err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSave = async (selectedIds) => {
    setSaving(true);
    setError(null);
    try {
      const toAdd = selectedIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !selectedIds.includes(id));

      if (toAdd.length) {
        await api.post("/schedules/member/assign", {
          memberId,
          scheduleIds: toAdd,
        });
      }
      await Promise.all(
        toRemove.map((scheduleId) =>
          api.delete("/schedules/member/remove", {
            data: { memberId, scheduleId },
          }),
        ),
      );

      await onUpdated();
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update schedules:", err);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const scheduleLabel = (s) =>
    s.time
      ? `${s.date || s.day} · ${s.time}`
      : `${s.date || s.day} · ${s.startTime || "?"} - ${s.endTime || "?"}`;

  return (
    <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-900">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarMonthIcon sx={{ fontSize: 14 }} className="text-zinc-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Training Schedules
          </h3>
        </div>
        <EditButton onClick={openEdit} label="Edit schedules" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {profile.schedules?.length > 0 ? (
          profile.schedules.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl"
            >
              <span className="text-zinc-800 dark:text-zinc-200 text-xs font-medium uppercase font-mono">
                {s.date || s.day}
              </span>
              <span className="text-[10px] font-mono font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-0.5 rounded shadow-sm text-zinc-700 dark:text-zinc-300">
                {s.time || `${s.startTime} - ${s.endTime}`}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs italic text-zinc-400 col-span-full">
            No schedules assigned
          </p>
        )}
      </div>

      <AssignmentModal
        open={isEditOpen}
        title="Edit Training Schedules"
        options={options}
        getOptionId={(o) => o.id}
        getOptionLabel={scheduleLabel}
        initialSelectedIds={currentIds}
        loadingOptions={loadingOptions}
        saving={saving}
        error={error}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Coaches  ->  assign/remove against GET /coaches/                   */
/* ---------------------------------------------------------------- */

export function CoachesSection({ profile, memberId, onUpdated }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const currentIds = (profile.coaches || []).map((c) => c.id);

  const openEdit = async () => {
    setIsEditOpen(true);
    setLoadingOptions(true);
    try {
      const res = await api.get("/coaches/");
      setOptions(res.data || []);
    } catch (err) {
      console.error("Failed to load coaches:", err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSave = async (selectedIds) => {
    setSaving(true);
    setError(null);
    try {
      const toAdd = selectedIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !selectedIds.includes(id));

      if (toAdd.length) {
        await api.post("/coaches/member/assign", {
          memberId,
          coachIds: toAdd,
        });
      }
      await Promise.all(
        toRemove.map((coachId) =>
          api.delete("/coaches/member/remove", {
            data: { memberId, coachId },
          }),
        ),
      );

      await onUpdated();
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update coaches:", err);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Assigned Coaches
        </h3>
        <EditButton onClick={openEdit} label="Edit coaches" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.coaches?.length > 0 ? (
          profile.coaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3.5"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                {coach.url ? (
                  <img
                    src={coach.url}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <PersonIcon sx={{ fontSize: 20 }} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                  {coach.name}
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                  {coach.phone || "No phone added"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs italic text-zinc-400 col-span-full">
            No coaches assigned
          </p>
        )}
      </div>

      <AssignmentModal
        open={isEditOpen}
        title="Edit Assigned Coaches"
        options={options}
        getOptionId={(o) => o.id}
        getOptionLabel={(o) => o.name}
        initialSelectedIds={currentIds}
        loadingOptions={loadingOptions}
        saving={saving}
        error={error}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}
