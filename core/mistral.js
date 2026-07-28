const axios = require("axios");

async function askMistral(messages) {

    const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
            model: "mistral-small-latest",
            messages
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data.choices[0].message.content;
}

module.exports = {
    askMistral
};
