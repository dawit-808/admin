export const INITIAL_FORM_DATA = {
  member: {
    name: "",
    gender: "Male",
    b_date: "",
    phone: "",
    address_id: "",
    url: "",
  },
  health: {
    height: "",
    weight: "",
    issue: "",
    injury: "",
  },
  emergency: {
    contact_name: "",
    phone: "",
    relationship: "",
  },
  scheduleIds: [],
  trainingTypeIds: [],
  coachIds: [],
  password: "",
};

export const STEPS = [
  { id: 1, label: "Identity Core", header: "Profile Attributes & Security" },
  {
    id: 2,
    label: "Health & Emergency",
    header: "Health Parameters & Emergency Contact",
  },
  {
    id: 3,
    label: "System Deployments",
    header: "Schedules, Workouts & Assignments",
  },
];

export const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dg5utf0tj/image/upload";
export const CLOUDINARY_PRESET = "ras-hailu";
