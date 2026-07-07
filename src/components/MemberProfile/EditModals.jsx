import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

function ModalShell({ title, saving, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={saving ? undefined : onClose}
      />
      <div
        className={`relative w-full ${wide ? "max-w-lg" : "max-w-md"} bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ saving, onClose, submitLabel = "Save Changes" }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="px-4 py-2 text-xs font-medium rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 text-xs font-medium bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full transition-transform active:scale-95 disabled:opacity-60"
      >
        {saving ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

export function EditFieldsModal({
  open,
  title,
  fields,
  initialValues,
  saving = false,
  error = null,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(initialValues || {});

  useEffect(() => {
    if (open) setValues(initialValues || {});
  }, [open]);

  if (!open) return null;

  const handleChange = (name, val) =>
    setValues((prev) => ({ ...prev, [name]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <ModalShell title={title} saving={saving} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                value={values[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={values[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            ) : (
              <input
                type={field.type || "text"}
                value={values[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            )}
          </div>
        ))}

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        )}
        <ModalActions saving={saving} onClose={onClose} />
      </form>
    </ModalShell>
  );
}

export function AssignmentModal({
  open,
  title,
  options = [],
  getOptionId = (o) => o.id,
  getOptionLabel = (o) => o.name ?? o.label ?? String(getOptionId(o)),
  initialSelectedIds = [],
  loadingOptions = false,
  saving = false,
  error = null,
  onClose,
  onSubmit,
}) {
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);

  useEffect(() => {
    if (open) setSelectedIds(initialSelectedIds || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedIds);
  };

  return (
    <ModalShell title={title} saving={saving} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-3">
        {loadingOptions ? (
          <p className="text-xs italic text-zinc-400">Loading options...</p>
        ) : options.length === 0 ? (
          <p className="text-xs italic text-zinc-400">
            Nothing available to assign.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {options.map((opt) => {
              const id = getOptionId(opt);
              const isChecked = selectedIds.includes(id);
              return (
                <label
                  key={id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
                    isChecked
                      ? "bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white"
                      : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? "bg-white dark:bg-zinc-900 border-white dark:border-zinc-900"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {isChecked && (
                      <CheckIcon
                        sx={{ fontSize: 12 }}
                        className="text-zinc-900 dark:text-white"
                      />
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isChecked}
                    onChange={() => toggle(id)}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isChecked
                        ? "text-white dark:text-zinc-900"
                        : "text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {getOptionLabel(opt)}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        )}
        <ModalActions saving={saving} onClose={onClose} />
      </form>
    </ModalShell>
  );
}
