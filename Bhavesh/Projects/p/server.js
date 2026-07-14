import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GEMINI_API_KEY || "REPLACE_WITH_YOUR_KEY";

if (!API_KEY || API_KEY === "REPLACE_WITH_YOUR_KEY") {
  console.warn("⚠️ GEMINI API key missing. Set GEMINI_API_KEY in .env or replace in file.");
}

app.use(cors());
app.use(express.json());
// serve frontend files (so fetch('/') and relative '/ask' work)
app.use(express.static("."));

app.post("/ask", async (req, res) => {
  const question = (req.body?.question || "").toString().trim();
  if (!question) return res.status(400).json({ error: "Question required" });

  console.log("→ /ask received:", question);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const body = {
      // keep payload simple and conservative
      contents: [{ parts: [{ text: question }] }],
      // generationConfig optional tuning
      generationConfig: { temperature: 0.2, maxOutputTokens: 512 }
    };

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const raw = await upstream.text();
    console.log("Upstream status:", upstream.status);
    console.log("Upstream raw response:", raw.slice(0, 2000)); // log first 2k chars

    if (!upstream.ok) {
      return res.status(502).json({ error: "Upstream API error", status: upstream.status, body: raw });
    }

    let data;
    try { data = JSON.parse(raw); } catch (e) { data = null; }

    // robust extraction from multiple possible shapes
    let reply = null;
    if (data) {
      reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.[0]?.text ||
        data?.candidates?.[0]?.text ||
        data?.output?.[0]?.content?.[0]?.text ||
        data?.reply ||
        data?.text ||
        null;
    }

    if (!reply && typeof raw === "string" && raw.trim()) reply = raw;

    if (!reply) {
      console.warn("No reply extracted from upstream response");
      return res.status(502).json({ error: "No reply from Gemini", raw });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`✅ Server running http://localhost:${PORT}`);
});