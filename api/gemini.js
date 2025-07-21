// File: /api/gemini.js

export default async function handler(req, res) {
  // 1. We only want to handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // 2. Securely get the API key from Vercel's environment variables

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  if (!apiKey) {
    return res.status(500).json({ message: 'API key not configured' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    // 3. Call the Gemini API from the server
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API responded with status: ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();

    // 4. Send the result back to your website
    res.status(200).json(data);

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ message: 'Failed to call Gemini API' });
  }
}