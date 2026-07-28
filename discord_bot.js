// Guardian of the Hidden Constellation
// Discord.js v14

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ===============================
// Book Data
// ===============================

const book = {

    title: "The Codex of the Hidden Constellation",

    warning:
`Read with curiosity.
Interpret with humility.
Teach with honesty.

Those who seek domination instead of understanding shall discover only reflections of themselves.`,

    chapters: {

        1: {
            title: "The Mirror of Thought",
            content:
`The first gate is opened by asking better questions.
Every answer becomes another doorway.
△ ○ ◇`
        },

        2: {
            title: "The Library Beneath Time",
            content:
`Books speak to books.
Ideas answer older ideas.
Forgotten truths simply wait.`
        },

        3: {
            title: "The Cartographer of Stars",
            content:
`Every constellation depends upon where you stand.`
        },

        4: {
            title: "The Whispering Wind",
            content:
`Leaves.
Rain.
Ocean.
Silence.

These are the oldest teachers.`
        },

        5: {
            title: "The Final Door",
            content:
`The greatest chamber contains no treasure.

Only one question:

Who were you before you sought the answer?`
        }

    },

    prophecies: [

        "The brightest lantern casts the longest shadow.",

        "Knowledge gathered without humility becomes noise.",

        "The last page is written by every reader.",

        "Every answer hides another beginning.",

        "Silence often teaches faster than certainty."

    ]
};

// ===============================
// Ready
// ===============================

client.once("ready", () => {

    console.log(`Guardian of "${book.title}" is online.`);

});

// ===============================
// Message Handler
// ===============================

client.on("messageCreate", message => {

    if (message.author.bot) return;

    const args = message.content.trim().split(/\s+/);

    const command = args.shift().toLowerCase();

    // --------------------------------

    if (command === "!help") {

        return message.reply(

`📖 **Guardian Commands**

!read <chapter>

!search <keyword>

!random

!warn

!help`

        );

    }

    // --------------------------------

    if (command === "!warn") {

        return message.reply(book.warning);

    }

    // --------------------------------

    if (command === "!read") {

        const number = args[0];

        if (!number) {

            return message.reply("Please specify a chapter number.");

        }

        const chapter = book.chapters[number];

        if (!chapter) {

            return message.reply("Chapter not found.");

        }

        return message.reply(

`# ${chapter.title}

${chapter.content}`

        );

    }

    // --------------------------------

    if (command === "!random") {

        const prophecy = book.prophecies[
            Math.floor(Math.random() * book.prophecies.length)
        ];

        return message.reply(`📜 ${prophecy}`);

    }

    // --------------------------------

    if (command === "!search") {

        const keyword = args.join(" ").toLowerCase();

        if (!keyword) {

            return message.reply("Please provide a keyword.");

        }

        let results = [];

        for (const id in book.chapters) {

            const chapter = book.chapters[id];

            if (
                chapter.title.toLowerCase().includes(keyword) ||
                chapter.content.toLowerCase().includes(keyword)
            ) {

                results.push(`Chapter ${id}: ${chapter.title}`);

            }

        }

        if (results.length === 0) {

            return message.reply("No matching passages found.");

        }

        return message.reply(results.join("\n"));

    }

});

// ===============================
// Login
// ===============================

client.login(process.env.DISCORD_TOKEN);
// Quantum Chatbot
// Node.js + Express + Mistral API

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const API_KEY = process.env.MISTRAL_API_KEY;

app.post("/chat", async (req, res) => {

    try {

        const prompt = req.body.message;

        if (!prompt) {
            return res.status(400).json({
                error: "No message provided."
            });
        }

        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {

            method: "POST",

            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: "mistral-small-latest",

                messages: [

                    {
                        role: "system",
                        content:
`You are Quantum Chatbot.

Be intelligent, friendly, curious and concise.

Always answer naturally.`

                    },

                    {
                        role: "user",
                        content: prompt
                    }

                ]

            })

        });

        const json = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(json);
        }

        res.json({

            reply:
                json.choices?.[0]?.message?.content ??
                "No reply."

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Quantum Chatbot running on http://localhost:${PORT}`);

});
