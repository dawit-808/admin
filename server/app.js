import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import trainingTypeRoutes from "./routes/trainingTypes.js";
import statsRoutes from "./routes/stats.js";
import { authenticateToken } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import tableSetup from "./routes/tablesSetup.js";
import imagekitRoutes from "./routes/imagekit.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", tableSetup);

app.use("/api/imagekit", imagekitRoutes);

// protected routes

app.use("/users", authenticateToken, userRoutes);
app.use("/training-types", authenticateToken, trainingTypeRoutes);
app.use("/stats", authenticateToken, statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
