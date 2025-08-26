// server.js

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the Google Cloud Speech-to-Text and Gemini libraries
const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
const { GoogleGenerativeAI } = require('@google/generative-ai');

// The 'dotenv' module is crucial for loading environment variables from your .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
// Use body-parser to parse incoming request bodies as JSON
app.use(bodyParser.json());
// Enable CORS to allow requests from different origins (e.g., a frontend running on a different port)
app.use(cors());

// A basic route for the root URL ('/')
app.get('/', (req, res) => {
  res.status(200).send('<h1>Server is up and running!</h1><p>API is ready for requests.</p>');
});

// An API route to handle transcription requests
app.post('/api/transcribe', async (req, res) => {
  // Check if the transcription API key is available
  const transcriptionApiKey = process.env.TRANSCRIPTION_API_KEY;
  if (!transcriptionApiKey) {
    return res.status(500).json({ error: 'TRANSCRIPTION_API_KEY not found in .env file' });
  }

  // Retrieve audio data from the request body
  const { audioData } = req.body;

  if (!audioData) {
    return res.status(400).json({ error: 'Audio data is missing from the request.' });
  }

  try {
    // In a real application, you would use a service account key file
    // For this example, we'll initialize the client with the API key
    const speechClient = new SpeechClient({ key: transcriptionApiKey });

    const audio = {
      content: audioData,
    };
    const config = {
      encoding: 'FLAC', // Or another appropriate encoding like 'LINEAR16'
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Make the transcription API call
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    console.log(`Transcription: ${transcription}`);
    res.status(200).json({ transcription: transcription });

  } catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).json({ error: 'An error occurred during transcription.' });
  }
});

// An API route to handle requests for the Gemini API
app.post('/api/gemini', async (req, res) => {
  // Check if the Gemini API key is available
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not found in .env file' });
  }

  // Retrieve the user's message (transcribed text) from the request body
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is missing from the request.' });
  }

  try {
    // Initialize the Gemini AI with your API key
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Send the message to the model and get the response
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    console.log(`Gemini response: ${text}`);
    res.status(200).json({ response: text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'An error occurred when calling the Gemini API.' });
  }
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
