import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENROUTER_KEY;

app.get("/", (req, res) => res.send("✅ DeepSeek Backend is Live!"));

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: "You are ChatFinity AI, a friendly AI assistant created by Bhavesh Sharma." },
          { role: "user", content: message }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn’t generate a response.";
    res.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Something went wrong connecting to OpenRouter." });
  }
});

app.listen(PORT, () => console.log(`✅ DeepSeek backend running on port ${PORT}`));
