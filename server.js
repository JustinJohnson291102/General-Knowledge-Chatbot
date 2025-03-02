require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleSearch } = require("google-search-results-nodejs");

const app = express();
const PORT = process.env.PORT || 5000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

if (!SERPAPI_KEY) {
    console.error("❌ Error: SERPAPI_KEY is missing from .env file.");
    process.exit(1);
}

const search = new GoogleSearch(SERPAPI_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the GK Chatbot API! Use <b>/chat</b> to send queries.");
});

app.post("/chat", (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "❌ Please provide a message." });
    }

    search.json({ q: message, location: "India", hl: "en", gl: "in" }, (data, error) => {
        if (error) {
            return res.status(500).json({ error: "❌ Error fetching data from SerpAPI." });
        }

        if (data.organic_results && data.organic_results.length > 0) {
            let fullResponse = data.organic_results
                .map((result) => result.snippet)
                .join(" ")
                .replace(/(\.\s)/g, ".\n");

            let sentences = fullResponse.split("\n");
            let formattedResponse = sentences.slice(0, 15).join("\n");

            if (formattedResponse.length < 400) {
                formattedResponse += "\n\nFor more details, try rephrasing your query.";
            }

            return res.json({ response: formattedResponse });
        } else {
            return res.json({ response: "⚠️ No relevant answer found." });
        }
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
