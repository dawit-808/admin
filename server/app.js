import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import trainingTypeRoutes from "./routes/trainingTypes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/training-types", trainingTypeRoutes); // 👈 cleaner

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
