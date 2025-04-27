import os
import google.generativeai as genai
import json

genai.configure(api_key="AIzaSyCQRskgdK8EOCE2OghWk9bcayu1bjDqSZY")
model = genai.GenerativeModel("gemini-1.5-flash")

def extract_message_contents(data):
    return " ".join(msg["content"] for msg in data["messages"] if msg["messageType"] == "TEXT")
def analyze_conversation(conversation_text):
    prompt = f"""
You are a helpful assistant that analyzes user conversations.

Here is the conversation:
\"\"\"{conversation_text}\"\"\"

Based on this conversation, provide:
1. The overall emotion (e.g., Happy, Sad, Angry, Confused, Excited, etc.)
2. The main topics discussed (e.g., College, Exams, Relationships, Work, Projects, etc.)

Return your response in this JSON format:
{{
  "overall_emotion": "<emotion>",
  "topics_discussed": ["<topic1>", "<topic2>"]
}}
"""
    response = model.generate_content(prompt)
    return response.text


import google.generativeai as genai

genai.configure(api_key="AIzaSyCrZ7AGfUNTDvPkLtt3j3fv-r7UYKp_Ci0")

model = genai.GenerativeModel("gemini-1.5-flash")

def convert_to_chat_format(messages, user_id):
    chat = ""
    for message in messages:
        sender = "You" if message["senderId"] == user_id else "Friend"
        content = message["content"]
        if message["messageType"] == "IMAGE":
            content = f"Image: {content}"
        chat += f"{sender}: {content}\n"
    return chat.strip()

def summarize_all_conversations(messages):
    if not messages:
        return None

    user_id = messages[0]["senderId"]

    # Group messages by conversationId
    from collections import defaultdict
    conv_map = defaultdict(list)
    for msg in messages:
        conv_map[msg["conversationId"]].append(msg)

    full_chat = ""
    for conv in conv_map.values():
        full_chat += convert_to_chat_format(conv, user_id) + "\n\n"

    prompt = (
        "You are an intelligent AI who reads multiple conversations between a user and their friend. "
        "Generate an emotional, context-aware overall summary of the user's conversations in about 100 words. "
        "Write the summary in first-person, from the user's perspective.\n\n"
        f"Chats:\n{full_chat.strip()}\n\n"
        "Summary:"
    )

    try:
        response = model.generate_content(prompt)
        ans = response.text.strip()
        print(ans)
        return ans
    except Exception as e:
        print(f"Summary generation error: {str(e)}")
        return None
