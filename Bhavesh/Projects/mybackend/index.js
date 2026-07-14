import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const GEMINI_API_KEY = "AIzaSyCayFmu5Kv6sHdwyseBLJXgR-d3FKEw8d0";

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ ChatFinity backend is running!");
});

// ✅ Chat route
app.post("/chat", async (req, res) => {
  try {
    const userText = req.body?.contents?.[0]?.parts?.[0]?.text || "Hello";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userText }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("🔥 Backend error:", error);
    res.status(500).json({ error: "Server crashed while processing request." });
  }
});

// 🚀 Important: DO NOT app.listen() in Vercel!
export default app;
