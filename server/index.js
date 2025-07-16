import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-70b-8192'; // Default model updated

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is not set in .env');
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(500).json({ reply: 'Error from Groq API.' });
    }

    const reply = data.choices?.[0]?.message?.content || 'No reply';
    res.json({ reply });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ reply: 'Error talking to Groq API.' });
  }
});

app.listen(5000, () => console.log('✅ Server running on http://localhost:5000 with Groq API'));
