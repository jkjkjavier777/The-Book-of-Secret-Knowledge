require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/chat", async (req, res) => {

    const message = req.body.message;

    if (!message) {
        return res.status(400).json({
            error: "No message provided."
        });
    }

    try {

        const response = await fetch(
            "https://api.mistral.ai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [
                        {
                            role: "system",
                            content: "You are the Guardian of the Book of Secret Knowledge."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Book of Secret Knowledge");
    console.log(`Running on http://localhost:${PORT}`);
});
