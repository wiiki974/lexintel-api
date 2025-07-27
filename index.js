const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api', (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question requise" });

  // Simuler une réponse
  res.json({ answer: `Voici une réponse à : "${question}"` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
