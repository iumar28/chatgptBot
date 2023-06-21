const express = require('express');
const axios = require('axios');

// Create Express app
const app = express();
const port = 3000;

// Enable JSON parsing
app.use(express.json());

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route for handling speech recognition and chat
app.post('/process-speech', async (req, res) => {
  const speechResult = req.body.speech;
  console.log('Speech:', speechResult);

  // Call ChatGPT API
  try {
    const response = await callChatGPTAPI(speechResult);
    const chatGPTResponse = response.data.choices[0].message.content;
    console.log('ChatGPT:', response);
    res.json({ response: chatGPTResponse });
  } catch (error) {
    console.error('Error:', error.response.data);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

// Function to call the ChatGPT API
async function callChatGPTAPI(input) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const apiKey = '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'; // Replace with your actual ChatGPT API key
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  const data = {
    'model': 'gpt-3.5-turbo',
    'messages': [
      {'role': 'system', 'content': 'You are a helpful assistant.'},
      {'role': 'user', 'content': input}
    ]
  };

  return axios.post(url, data, { headers });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
