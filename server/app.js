import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import trainingTypeRoutes from "./routes/trainingTypes.js";
import { authenticateToken } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import tableSetup from "./routes/tablesSetup.js";
import uploadRouter from "./routes/upload.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // 👈 allows larger JSON bodies

app.use("/create-tables", tableSetup);
app.use("/auth", authRoutes);
app.use("/upload-image", uploadRouter);

// protected routes

app.use("/users", authenticateToken, userRoutes);
app.use("/training-types", authenticateToken, trainingTypeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
