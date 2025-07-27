const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ LexiBot API fonctionne parfaitement !');
});

app.post('/api', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question manquante' });
  }

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Tu es LexiBot, assistant juridique français. Structure ta réponse en 5 parties :
1. Résumé
2. Ce que dit la loi (France)
3. Peine encourue (si applicable)
4. Solutions possibles
5. Étapes concrètes
Cas : ${question}`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ answer: reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la communication avec OpenAI.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});
