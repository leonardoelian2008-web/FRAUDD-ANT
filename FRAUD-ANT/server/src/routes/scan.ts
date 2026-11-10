import { Router } from "express";
import multer from "multer";
import { createWorker } from "tesseract.js";
import { analyzeText } from "../services/analyzer.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    cb(allowed.includes(file.mimetype) ? null : new Error("Format gambar harus PNG, JPG, atau WEBP"), allowed.includes(file.mimetype));
  }
});

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File gambar wajib diunggah." });
    const worker = await createWorker("ind+eng");
    try {
      const result = await worker.recognize(req.file.buffer);
      const extractedText = result.data.text.trim();
      if (!extractedText) return res.status(422).json({ error: "Teks tidak terbaca. Gunakan gambar yang lebih jelas." });
      return res.json({ extractedText, analysis: analyzeText(extractedText) });
    } finally {
      await worker.terminate();
    }
  } catch (error) { next(error); }
});

export default router;
