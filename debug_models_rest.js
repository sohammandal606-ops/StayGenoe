require('dotenv').config();

const API_KEY = process.env.MISTRAL_API_KEY;
const MistralClient = require("@mistralai/mistralai").default;

const fs = require('fs');

async function checkMistralAPI() {
    if (!API_KEY) {
        console.log("No API Key found in .env");
        return;
    }

    console.log(`Checking Mistral API with key starting with: ${API_KEY.substring(0, 5)}...`);

    try {
        const client = new MistralClient(API_KEY);

        const response = await client.chat({
            model: "mistral-small-latest",
            messages: [
                {
                    role: "user",
                    content: "Test message",
                }
            ],
        });

        const data = {
            status: "success",
            model: "mistral-small-latest",
            message: response.choices[0].message.content,
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync('models_log.json', JSON.stringify(data, null, 2));
        console.log("Mistral API test result saved to models_log.json");

    } catch (err) {
        console.error("API Error:", err);
    }
}

checkMistralAPI();
