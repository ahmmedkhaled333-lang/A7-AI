import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "اكتب رسالة الأول"
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: "أنت A7-AI، مساعد ذكي تتحدث باللهجة المصرية باحترام ووضوح.",
      input: message
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({
      error: "حصل خطأ. حاول تاني بعد شوية."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`A7-AI server running on port ${port}`);
});
