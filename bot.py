def generate_response(user_input):
    """Generate a response based on user input, favoring direct replies."""
    config = load_config()
    quotes = load_quotes()
    replies = load_replies()
    history = load_history()

    # Calculate reward
    R_prime = calculate_reward(user_input, history)

    # Log interaction
    log_interaction(user_input, R_prime)

    # Always try to use a direct reply first
    direct_reply = collapse(user_input, replies)
    if direct_reply != "The archive hums in silence.":
        return f"JVI: {direct_reply} (R' = {R_prime:.1f})"

    # Fallback to cryptic or quote-based responses if no direct reply exists
    fallback_responses = [
        f"JVI: {random.choice(quotes)['quote']} — {random.choice(quotes)['author']} (R' = {R_prime:.1f})",
        f"JVI: The archive whispers: {random.choice(quotes)['quote']} (R' = {R_prime:.1f})"
    ]
    return random.choice(fallback_responses)
