from transformers import pipeline
classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

def chatLog(text):
    results = classifier(text)
    emotions = {result['label']: result['score'] for result in results[0]}
    sorted_emotions = sorted(emotions.items(), key=lambda x: x[1], reverse=True)
    print(sorted_emotions[0])

chatLog(["hello how are you","iam very happy","the day was amazing"])

