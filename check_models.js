require('dotenv').config();
const MistralClient = require("@mistralai/mistralai").default;

async function testMistralAPI() {
    if (!process.env.MISTRAL_API_KEY) {
        console.error("API Key missing");
        return;
    }

    const client = new MistralClient(process.env.MISTRAL_API_KEY);

    console.log("Testing Mistral AI...");
    try {
        const response = await client.chat({
            model: "mistral-small-latest",
            messages: [
                {
                    role: "user",
                    content: "Hello",
                }
            ],
        });
        console.log("Success with Mistral AI", response.choices[0].message.content);
    } catch (e) { console.log("Failed Mistral AI", e.message.split('\n')[0]); }
}

testMistralAPI();
