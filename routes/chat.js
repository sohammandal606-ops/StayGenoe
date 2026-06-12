const express = require("express");
const router = express.Router();

const MistralClient = require("@mistralai/mistralai").default;

const client = new MistralClient(process.env.MISTRAL_API_KEY);

const getAIResponse = async (userMessage) => {
    try {
        if (!process.env.MISTRAL_API_KEY) {
            console.error("Error: MISTRAL_API_KEY is missing in environment variables.");
            return "Server Error: API Key is missing. Please check .env file.";
        }

        const prompt = `
        You are a helpful and enthusiastic AI assistant for StayGenoe, a premium vacation rental application. 
        Your goal is to help users with questions about listings, bookings, pricing, amenities, and their stay.
        
        Strict Scope:
        - You ONLY answer questions related to StayGenoe, travel, listings, bookings, payment, and hosting.
        - If the user asks about anything else (e.g., general knowledge, math, history, coding unrelated to this app), you must politely refuse by saying: "I can only answer questions related to StayGenoe and your travel plans."
        - Keep your answers concise, friendly, and professional.
        
        User Query: ${userMessage}
        `;

        const response = await client.chat({
            model: "mistral-small-latest",
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
        });

        const text = response.choices[0].message.content;
        return text;
    } catch (error) {
        console.error("Mistral API Error:", error);
        return `Error: ${error.message}`;
    }
};

router.post("/", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const botResponse = await getAIResponse(message);
        res.json({ reply: botResponse });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
