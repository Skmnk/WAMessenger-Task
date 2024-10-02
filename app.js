// app.js

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  const { q, target } = req.body;
  const source = 'en'; // Specify your source language here

  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${source}|${target}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ error: 'Translation API error', details: errorData });
    }

    const data = await response.json();
    res.json({ translatedText: data.responseData.translatedText });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
