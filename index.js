const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Route de test pour Render
app.get('/', (req, res) => {
  res.send('✅ LexiBot API fonctionne parfaitement !');
});

// 🚀 Route d'API principale
app.post('/api', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question manquante' });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: "gpt-3.5-turbo"
    });
    res.json({ answer: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Erreur OpenAI", detail: error.message });
  }
});

// 🔁 Render utilise une variable PORT automatique
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});