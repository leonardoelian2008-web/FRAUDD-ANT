import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import scanRouter from "./routes/scan.js";
import urlRouter from "./routes/url.js";

const app = express();
const port = Number(process.env.PORT || 4000);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173" }));
app.use(express.json({ limit: "32kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "Fraud-Ant API" }));
app.use("/api/scan", scanRouter);
app.use("/api/url-check", urlRouter);
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err?.code === "LIMIT_FILE_SIZE" ? 413 : 400;
  res.status(status).json({ error: err?.message || "Terjadi kesalahan pada server." });
});
app.listen(port, () => console.log(`Fraud-Ant API berjalan di http://localhost:${port}`));
