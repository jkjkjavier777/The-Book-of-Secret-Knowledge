const fs = require("fs");
const path = require("path");

const BOOK_PATH = path.join(__dirname, "..", "data", "knowledge.json");

function loadKnowledge() {
    try {
        const data = fs.readFileSync(BOOK_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Failed to load knowledge:", err.message);
        return {};
    }
}

module.exports = {
    loadKnowledge
};
