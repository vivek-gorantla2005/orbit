import os
import google.generativeai as genai
import re
import copy

# Configure your API key
genai.configure(api_key="AIzaSyCkYzMoCf2a8jtSm5j8aF18eeJ4rCS11S4")  # Replace with your actual API key

# Load Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# Extract goal names from dictionary
def extract_goals(goals_dict):
    return list(goals_dict.keys())

# Analyze a single message for goal relevance and sentiment
def analyze_message_with_gemini(message, goal_list):
    try:
        chat = model.start_chat()
        prompt = (
            f"You are a helpful AI. The user has goals: {goal_list}.\n"
            f"A message is given. Determine if it relates to any goal and if so, its sentiment.\n\n"
            f"Message: \"{message}\"\n"
            f"Respond like this:\n"
            f"fitness: positive\n"
            f"reading: negative\n"
            f"Only include goals that are mentioned, using their exact names from the list."
        )

        response = chat.send_message(prompt)
        if not response or not response.text.strip():
            print(f"No valid response from Gemini for message: {message}")
            return []

        lines = response.text.strip().split("\n")
        result = []
        for line in lines:
            match = re.match(r"(\w+):\s*(positive|negative|neutral)", line.strip(), re.IGNORECASE)
            if match:
                goal = match.group(1).lower()
                sentiment = match.group(2).upper()
                result.append((goal, sentiment))

        return result

    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        return []

# Analyze all messages and update progress based on positive sentiment only
def analyze_and_update_progress_with_gemini(goals, chat_history):
    progress = copy.deepcopy(goals)
    goal_list = extract_goals(goals)

    for message in chat_history:
        analysis = analyze_message_with_gemini(message, goal_list)
        for goal, sentiment in analysis:
            if goal in progress and sentiment == "POSITIVE":
                progress[goal] = min(progress[goal] + 0.1, 1.0)  # cap progress at 1.0

    return progress
