function validate(reply) {

    if (!reply) {
        return "I couldn't generate a response.";
    }

    if (reply.length > 4000) {
        return reply.substring(0, 4000);
    }

    return reply;
}

module.exports = {
    validate
};
