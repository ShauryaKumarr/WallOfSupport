const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true }); // Import CORS

// Function to check toxicity using Perspective API
exports.checkToxicity = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => { // Enable CORS for this function
    const { messageText } = req.body;
    const apiKey = functions.config().perspective.api_key; // Stored API key
    const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`;

    const requestBody = {
      comment: { text: messageText },
      languages: ['en'],
      requestedAttributes: { TOXICITY: {} },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
      res.json(result.attributeScores.TOXICITY.summaryScore.value);
    } catch (error) {
      console.error('Error calling Perspective API:', error);
      res.status(500).send('Error checking toxicity');
    }
  });
});

// Function to check sentiment using Natural Language API
exports.checkSentiment = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => { // Enable CORS for this function
    const { messageText } = req.body;
    const apiKey = functions.config().nlp.api_key; // Stored API key
    const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;

    const requestBody = {
      document: {
        type: "PLAIN_TEXT",
        content: messageText,
      },
      encodingType: "UTF8",
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      res.json(data.documentSentiment.score);
    } catch (error) {
      console.error('Error calling Natural Language API:', error);
      res.status(500).send('Error checking sentiment');
    }
  });
});
