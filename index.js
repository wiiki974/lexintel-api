const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const prompt = `
Tu es LexiBot, un assistant juridique spécialisé en droit français.

Réponds à l’utilisateur selon la structure suivante, avec les numéros **obligatoires** et dans cet ordre :

1. Résumé
2. Ce que dit la loi
3. Peine encourue
4. Solutions possibles
5. Étapes concrètes

Important :
- Ne change pas l'ordre.
- Commence chaque partie par son numéro.
- Pas d’introduction ni de phrase avant.
- Écris des paragraphes clairs et concis pour chaque section.

Voici la question de l’utilisateur :
"${question}"
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur OpenAI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});