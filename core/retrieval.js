const { loadKnowledge } = require("./knowledge");

function searchKnowledge(query) {

    const book = loadKnowledge();

    if (!book.chapters) return [];

    const q = query.toLowerCase();

    return book.chapters.filter(chapter => {

        return (
            chapter.title.toLowerCase().includes(q) ||
            chapter.content.toLowerCase().includes(q)
        );

    });

}

module.exports = {
    searchKnowledge
};
