import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// ---------------------------------------------------------------------------
// FormInput
// ---------------------------------------------------------------------------
export function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
        {label}
      </label>
      <input
        required={required}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full text-xs px-3 py-2.5
          border border-zinc-200 dark:border-zinc-800
          bg-transparent
          text-zinc-900 dark:text-white
          placeholder-zinc-300 dark:placeholder-zinc-700
          focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400
          transition-colors
        "
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SelectField
// ---------------------------------------------------------------------------
export function SelectField({ label, value, onChange, children, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
        {label}
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full text-xs px-3 py-2.5
          border border-zinc-200 dark:border-zinc-800
          bg-white dark:bg-[#09090b]
          text-zinc-900 dark:text-white
          focus:outline-none focus:border-zinc-500
          transition-colors
        "
      >
        {children}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CheckList — scrollable multi-select list
// ---------------------------------------------------------------------------
export function CheckList({ items, selectedIds, onToggle, renderLabel }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
      {items.length === 0 && (
        <p className="p-4 text-[10px] text-zinc-400 text-center">No items found</p>
      )}
      {items.map((item) => {
        const checked = selectedIds.includes(item.id);
        return (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`
              px-3 py-2.5 text-xs flex items-center justify-between cursor-pointer
              transition-colors select-none
              ${checked
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white"
                : "text-zinc-500 hover:bg-zinc-50/60 dark:hover:bg-zinc-900/20"}
            `}
          >
            <span className="truncate pr-2">{renderLabel(item)}</span>
            <div
              className={`
                shrink-0 w-4 h-4 border flex items-center justify-center transition-colors
                ${checked
                  ? "border-zinc-900 bg-zinc-900 dark:border-white dark:bg-white"
                  : "border-zinc-300 dark:border-zinc-700"}
              `}
            >
              {checked && (
                <span className="text-[9px] font-bold text-white dark:text-black">✓</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// UploadZone — drag-and-drop / click-to-upload image area
// ---------------------------------------------------------------------------
export function UploadZone({ preview, fileName, onInputChange, onDrop }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="
        group relative border-2 border-dashed
        border-zinc-200 dark:border-zinc-800
        hover:border-zinc-400 dark:hover:border-zinc-500
        transition-colors bg-zinc-50/30 dark:bg-[#030303]/20
        p-5 cursor-pointer
        flex flex-col items-center justify-center min-h-[110px]
      "
    >
      <input
        type="file"
        accept="image/*"
        onChange={onInputChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      {preview ? (
        <div className="flex items-center gap-4 w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-14 h-14 object-cover border border-zinc-200 dark:border-zinc-800"
          />
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
              {fileName}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Drop or click to replace
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-zinc-400 group-hover:text-zinc-500 transition-colors">
          <CloudUploadIcon fontSize="medium" />
          <p className="text-[11px] text-center">
            Drop image or click to browse
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressBar
// ---------------------------------------------------------------------------
export function ProgressBar({ value }) {
  if (!value) return null;
  return (
    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1 overflow-hidden rounded-full">
      <div
        className="bg-zinc-900 dark:bg-white h-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// StepIndicator
// ---------------------------------------------------------------------------
export function StepIndicator({ num, label, active, done, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 group select-none w-full text-left"
    >
      <div
        className={`
          w-7 h-7 shrink-0 flex items-center justify-center text-xs
          transition-all duration-200
          ${done
            ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
            : active
            ? "border border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-bold"
            : "border border-zinc-200 dark:border-zinc-700 text-zinc-400 group-hover:border-zinc-400"}
        `}
      >
        {done ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : num}
      </div>
      <span
        className={`
          text-xs font-medium transition-colors
          ${active || done
            ? "text-zinc-900 dark:text-white"
            : "text-zinc-400 group-hover:text-zinc-500"}
        `}
      >
        {label}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// SectionHeading — consistent subsection label inside a step
// ---------------------------------------------------------------------------
export function SectionHeading({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
      {children}
    </p>
  );
}
