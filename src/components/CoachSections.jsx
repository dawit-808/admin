import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import api from "../api/api";
import { ProfileInfoItem } from "./MemberProfile/ProfileSections";
import { EditFieldsModal, AssignmentModal } from "./MemberProfile/EditModals";

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

// Adjust this if the real /address shape is different
// (same assumption used on the member profile).
function getAddressLabel(addr) {
  if (addr.sub_city || addr.woreda) {
    return `${addr.sub_city || "-"}, Woreda ${addr.woreda || "-"}`;
  }
  return addr.name || `Address #${addr.id}`;
}

/* ---------------------------------------------------------------- */
/* Core Records  ->  PUT /coaches/:id                                 */
/* ---------------------------------------------------------------- */

export function CoachRecordsSection({ profile, coachId, onUpdated }) {
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
    b_date: profile.b_date ? profile.b_date.slice(0, 10) : "",
    url: profile.url || "",
    address_id: profile.address_id ?? profile.address?.id ?? "",
  };

  const handleSave = async (values) => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/coaches/${coachId}`, values);
      await onUpdated();
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update coach records:", err);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">
          // Core Records
        </h3>
        <EditButton onClick={openEdit} label="Edit core records" />
      </div>

      <div className="space-y-4">
        <ProfileInfoItem
          icon={<PhoneIcon sx={{ fontSize: 14 }} />}
          label="Primary Connection"
          value={profile.phone}
          isMono
        />
        <ProfileInfoItem
          icon={<BadgeIcon sx={{ fontSize: 14 }} />}
          label="System Registry ID"
          value={profile.ras_id}
          isMono
        />
        <ProfileInfoItem
          icon={<CakeIcon sx={{ fontSize: 14 }} />}
          label="Date of Birth"
          value={
            profile.b_date
              ? new Date(profile.b_date).toLocaleDateString()
              : null
          }
        />
      </div>

      <EditFieldsModal
        open={isEditOpen}
        title="Edit Core Records"
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
/* Specialties (Training Scope)  ->  assign/remove against          */
/* GET /training-types/                                              */
/* ---------------------------------------------------------------- */

export function CoachTrainingScopeSection({ profile, coachId, onUpdated }) {
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
        await api.post("/training-types/coach/assign", {
          coachId,
          typeIds: toAdd,
        });
      }
      await Promise.all(
        toRemove.map((typeId) =>
          api.delete("/training-types/coach/remove", {
            data: { coachId, typeId },
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
          <FitnessCenterIcon sx={{ fontSize: 12 }} /> // Area Specialties
        </h3>
        <EditButton onClick={openEdit} label="Edit specialties" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {profile.trainingTypes?.length > 0 ? (
          profile.trainingTypes.map((t) => (
            <span
              key={t.id}
              className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-200 text-xs font-medium shadow-sm"
            >
              {t.t_type}
            </span>
          ))
        ) : (
          <p className="text-zinc-400 text-xs italic tracking-tight">
            No operational disciplines assigned.
          </p>
        )}
      </div>

      <AssignmentModal
        open={isEditOpen}
        title="Edit Area Specialties"
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
/* Active Shifts (Schedules)  ->  assign/remove against              */
/* GET /schedules/                                                    */
/* ---------------------------------------------------------------- */

export function CoachSchedulesSection({ profile, coachId, onUpdated }) {
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
        await api.post("/schedules/coach/assign", {
          coachId,
          scheduleIds: toAdd,
        });
      }
      await Promise.all(
        toRemove.map((scheduleId) =>
          api.delete("/schedules/coach/remove", {
            data: { coachId, scheduleId },
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
          <CalendarMonthIcon sx={{ fontSize: 12 }} /> // Active Shifts
        </h3>
        <EditButton onClick={openEdit} label="Edit shifts" />
      </div>

      <div className="space-y-2">
        {profile.schedules?.length > 0 ? (
          profile.schedules.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl"
            >
              <span className="text-zinc-800 dark:text-zinc-200 text-xs font-medium uppercase font-mono tracking-tight">
                {s.date}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono font-bold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded">
                {s.time}
              </span>
            </div>
          ))
        ) : (
          <p className="text-zinc-400 text-xs italic tracking-tight">
            No operational calendar assigned.
          </p>
        )}
      </div>

      <AssignmentModal
        open={isEditOpen}
        title="Edit Active Shifts"
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
