require("dotenv").config();
const express = require("express");
const cors = require("cors"); // ✅ CORS Fix
const { GoogleSearch } = require("google-search-results-nodejs");

const app = express();
const PORT = process.env.PORT || 5000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

// ✅ Check API Key
if (!SERPAPI_KEY) {
    console.error("❌ Error: SERPAPI_KEY is missing from .env file.");
    process.exit(1);
}

const search = new GoogleSearch(SERPAPI_KEY);

app.use(cors());  // ✅ Enable CORS
app.use(express.json()); // ✅ Parse JSON Requests

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the GK Chatbot API! Use <b>/chat</b> to send queries.");
});

// ✅ ADD `/chat` ROUTE
app.post("/chat", (req, res) => {
    const { message } = req.body; // Extract user message
    console.log("Received message:", message);  // Log the received message

    if (!message) {
        return res.status(400).json({ error: "❌ Please provide a message." });
    }

    // ✅ Use SerpAPI to fetch data
    search.json({ q: message, location: "India", hl: "en", gl: "in" }, (data, error) => {
        if (error) {
            console.error("Error from SerpAPI:", error);  // Log error from SerpAPI
            return res.status(500).json({ error: "❌ Error fetching data from SerpAPI.", details: error });
        }

        if (data.organic_results && data.organic_results.length > 0) {
            console.log("SerpAPI Response:", data);  // Log SerpAPI response
            return res.json({ response: data.organic_results[0].snippet });
        } else {
            return res.json({ response: "⚠️ No relevant answer found." });
        }
    });
});

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
