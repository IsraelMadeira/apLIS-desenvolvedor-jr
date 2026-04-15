import express from "express";
import cors from "cors";
import env from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

const corsOrigin = env.corsOrigins.includes("*") ? true : env.corsOrigins;

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Node API de pacientes operacional.",
    data: {
      service: "backend-node",
      uptime: process.uptime()
    }
  });
});

app.use("/auth", authRoutes);
app.use("/api/v1/pacientes", pacienteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
