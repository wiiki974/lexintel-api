import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CLIENT_KEY = process.env.CLIENT_KEY;

app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { question, clientKey } = req.body;

  if (clientKey !== CLIENT_KEY) {
    return res.status(403).json({ error: "Clé client invalide." });
  }

  const prompt = `
Tu es LexIntel, assistant juridique français. Réponds selon cette structure :
1. Résumé
2. Ce que dit la loi
3. Peine encourue
4. Solutions possibles
5. Étapes concrètes

Cas : ${question}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "Pas de réponse." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne API." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ LexIntel API écoute sur http://localhost:${PORT}`);
});
