import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// main chat route
app.post("/chat", async (req, res) => {
  console.log("Incoming /chat request body:", req.body);
  try {
    const { message } = req.body ?? {};
    if (!message) return res.status(400).json({ error: "Missing message in body" });

    // ✅ Use Cohere Chat API instead of generate
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus",   // Free tier me ye chalega
        message: message
      })
    });

    const raw = await response.text();
    console.log("Cohere raw response:", raw);

    let data;
    try { data = JSON.parse(raw); } catch (e) { data = null; }

    if (!response.ok) {
      return res.status(502).json({
        error: "Upstream API error",
        status: response.status,
        body: data ?? raw
      });
    }

    if (data && data.text) {
      return res.json({ reply: data.text });
    } else {
      return res.status(500).json({ error: "Invalid response from Cohere", body: data ?? raw });
    }

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
});

// start server
app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
