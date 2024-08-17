const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true });

exports.checkToxicity = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const messageText = req.body.messageText;
        const apiKey = functions.config().perspective.api_key;
        const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: { text: messageText },
                    languages: ["en"],
                    requestedAttributes: { TOXICITY: {} },
                }),
            });

            const result = await response.json();
            const score = result.attributeScores.TOXICITY.summaryScore.value;
            res.json({ isToxic: score >= 0.4 });
        } catch (error) {
            console.error("Error checking toxicity:", error);
            res.status(500).send("Server Error");
        }
    });
});

exports.checkSentiment = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const messageText = req.body.messageText;
        const apiKey = functions.config().naturallanguage.api_key;
        const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    document: { type: 'PLAIN_TEXT', content: messageText },
                    encodingType: 'UTF8',
                }),
            });

            const result = await response.json();
            const sentimentScore = result.documentSentiment.score;
            res.json({ sentimentScore });
        } catch (error) {
            console.error("Error checking sentiment:", error);
            res.status(500).send("Server Error");
        }
    });
});
