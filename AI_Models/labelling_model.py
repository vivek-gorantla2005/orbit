import google.generativeai as genai

genai.configure(api_key="AIzaSyCkXt5FPm3o4CALjEbl8HwUAjHsCZ2dSg8")

model = genai.GenerativeModel("gemini-1.5-flash") 

def labelling_model(caption_batches):
    batch_labels = []

    for batch in caption_batches:
        prompt = (
            "You are an intelligent AI that classifies real-world events based on image captions.\n"
            "Common event types: birthday, wedding, graduation, trip, festival, concert, party, sports, ceremony, meeting.\n"
            "Analyze the following image captions and respond with a **single best event label** that most accurately represents them.\n"
            "If no clear event is found, return only 'None'.\n\n"
        )
        for cap in batch:
            prompt += f"- {cap}\n"

        try:
            response = model.generate_content(prompt)
            label = response.text.strip().lower()

            # Normalize unexpected responses
            if not label or "none" in label:
                batch_labels.append(None)
            else:
                batch_labels.append(label)
        except Exception as e:
            print(f"Label generation error: {str(e)}")
            batch_labels.append(None)

    return batch_labels
