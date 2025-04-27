import google.generativeai as genai

genai.configure(api_key="AIzaSyCrZ7AGfUNTDvPkLtt3j3fv-r7UYKp_Ci0")

model = genai.GenerativeModel("gemini-1.5-flash")

def convert_to_chat_format(messages):
    chat = ""
    for message in messages:
        sender = "User" if message["senderId"] == "user-id-1" else "Friend"
        content = message["content"]
        # Check if content is a URL (indicating an image)
        if message["messageType"] == "IMAGE":
            content = f"Image: {content}"
        chat += f"{sender}: {content}\n"
    return chat.strip()

def summarize(messages):
    chat = convert_to_chat_format(messages)
    prompt = (
        "You are an intelligent AI who reads a chat between a user and their friend. "
        "Generate an emotional and context-aware summary of the conversation in about 100 words generate response in the user's perspective.\n\n"
        f"Chat:\n{chat}\n\n"
        "Summary:"
    )

    try:
        response = model.generate_content(prompt)
        ans = response.text.strip()
        print(ans)
        return ans
    except Exception as e:
        print(f"Label generation error: {str(e)}")
        return None


