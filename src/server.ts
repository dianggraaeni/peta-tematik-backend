import express from "express";
import cors from "cors";
import petaRoutes from "./routes/petaRoutes";
import pekerjaanRoutes from "./routes/pekerjaanRoutes";
import authRoutes from "./routes/authRoutes";
import villageThemeRoutes from "./routes/villageThemeRoutes";
import aiInsightRoutes from "./routes/aiInsightRoutes";
import umkmRoutes from "./routes/umkmRoutes";
import manualInsightRoutes from "./routes/manualInsightRoutes";

const app = express();
const port = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/peta", petaRoutes);
app.use("/api/pekerjaan", pekerjaanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/village-themes", villageThemeRoutes);
app.use("/api/insights", aiInsightRoutes);
app.use("/api/umkm", umkmRoutes);
app.use("/api/manual-insights", manualInsightRoutes);

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

export default app;
