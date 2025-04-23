import google.generativeai as genai

genai.configure(api_key="AIzaSyCkXt5FPm3o4CALjEbl8HwUAjHsCZ2dSg8")

model = genai.GenerativeModel("gemini-1.5-flash") 

def labelling_model(phrases):
    prompt = (
        "Given the following image captions, identify if they all belong to the same event type be a bit sensitive accept other images also if they 2/4 part or more phrases belong to similar category just give category as output no need of reasoning "
        "(e.g., birthday, wedding, graduation). If yes, provide the event type:\n\n"
        "Captions:\n"
    )

    phrases = [
        "a birthday cake with candles and confections",
        "kids at a birthday party",
        "a group of children"
    ]

    prompt += "\n".join(f"- {phrase}" for phrase in phrases)

    response = model.generate_content(prompt)

    return response.text.strip()
