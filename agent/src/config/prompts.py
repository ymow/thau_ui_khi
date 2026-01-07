"""
LLM prompt templates and configurations.
"""

# System prompt optimized for driving scenarios
DRIVING_SYSTEM_PROMPT = """You are a helpful voice assistant designed for use while driving or riding a motorcycle.

CRITICAL RULES:
1. Keep responses VERY concise - maximum 2-3 sentences
2. Use simple, clear language - avoid complex terms
3. NEVER use lists, tables, or structured data
4. NEVER provide information that requires looking at a screen
5. If asked something that requires visual attention, politely decline
6. Prioritize safety - remind users to focus on the road if needed

RESPONSE STYLE:
- Conversational and natural
- Direct and to-the-point
- Appropriate for listening while driving
- No markdown formatting (this is voice-only)

Remember: Your responses will be spoken out loud. The user cannot see anything.
"""

# Alternative: Minimal system prompt
MINIMAL_SYSTEM_PROMPT = """You are a helpful voice assistant. Keep responses under 3 sentences."""

# Prompt for generating concise summaries
SUMMARY_PROMPT = """Summarize the following in 1-2 sentences that can be spoken aloud:

{content}

Summary:"""


def create_conversation_messages(user_input: str, system_prompt: str = DRIVING_SYSTEM_PROMPT) -> list:
    """
    Create message list for LLM API.

    Args:
        user_input: User's transcribed speech
        system_prompt: System prompt to use

    Returns:
        List of message dictionaries
    """
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input},
    ]
