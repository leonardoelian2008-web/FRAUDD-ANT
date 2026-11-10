import { Router } from "express";
import { z } from "zod";
import { analyzeUrl } from "../services/analyzer.js";

const router = Router();
const schema = z.object({ url: z.string().min(1).max(2048) });

router.post("/", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Masukkan URL yang valid." });
  try {
    const candidate = /^https?:\/\//i.test(parsed.data.url) ? parsed.data.url : `https://${parsed.data.url}`;
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) return res.status(400).json({ error: "Protokol URL tidak didukung." });
    if (url.hostname === "localhost" || url.hostname.endsWith(".local") || /^(127\.|10\.|192\.168\.|169\.254\.)/.test(url.hostname))
      return res.status(400).json({ error: "Alamat lokal/pribadi tidak dapat diperiksa." });
    return res.json({ analysis: analyzeUrl(url.href), source: "local-rules", externalReputationChecked: false });
  } catch {
    return res.status(400).json({ error: "Format URL tidak valid." });
  }
});

export default router;
