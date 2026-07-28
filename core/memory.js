const fs = require("fs");
const path = require("path");

const MEMORY = path.join(__dirname, "..", "data", "memory.json");

function loadMemory() {

    try {

        return JSON.parse(fs.readFileSync(MEMORY));

    } catch {

        return [];

    }

}

function saveMemory(memory) {

    fs.writeFileSync(
        MEMORY,
        JSON.stringify(memory, null, 2)
    );

}

function remember(role, content) {

    const memory = loadMemory();

    memory.push({

        role,

        content,

        timestamp: Date.now()

    });

    saveMemory(memory);

}

module.exports = {

    remember,

    loadMemory

};
