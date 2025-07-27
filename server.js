const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

app.get("/", (req, res) => {
  res.send("✅ LexiBot API est en ligne !");
});

app.post("/api", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question manquante" });

  const prompt = `
Tu es LexiBot, un assistant juridique spécialisé en droit français. Réponds dans ce format JSON :
{
  "Résumé": "...",
  "Ce que dit la loi": "...",
  "Peine encourue": "...",
  "Solutions possibles": "...",
  "Étapes concrètes": "..."
}
Question : ${question}
`;

  try {
    const chat = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = chat.data.choices[0].message.content;
    res.json({ answer: content });
  } catch (err) {
    console.error("❌ Erreur OpenAI :", err.message);
    res.status(500).json({ error: "Erreur de l’IA" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LexiBot API en ligne sur le port ${PORT}`);
});
