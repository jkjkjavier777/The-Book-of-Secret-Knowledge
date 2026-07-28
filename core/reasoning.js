const identity = require("./identity");
const { searchKnowledge } = require("./retrieval");
const { loadMemory } = require("./memory");

function buildMessages(userInput) {

    const memory = loadMemory().slice(-10);

    const knowledge = searchKnowledge(userInput);

    let context = "";

    if (knowledge.length > 0) {
        context =
            "Relevant Book Passages:\n\n" +
            knowledge
                .map(ch => `## ${ch.title}\n${ch.content}`)
                .join("\n\n");
    }

    return [
        {
            role: "system",
            content: identity.systemPrompt
        },
        {
            role: "system",
            content: context
        },
        ...memory,
        {
            role: "user",
            content: userInput
        }
    ];
}

module.exports = {
    buildMessages
};
