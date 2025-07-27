const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Route de test pour Render
app.get('/', (req, res) => {
  res.send('✅ LexiBot API fonctionne parfaitement !');
});

// 🚀 Route d'API principale
app.post('/api', (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question manquante' });
  }

  res.json({ answer: `Voici une réponse simulée à : "${question}"` });
});

// 🔁 Render utilise une variable PORT automatique
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});
