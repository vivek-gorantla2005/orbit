from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import requests
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the processor and model once (recommended for performance)
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(device)


def image_model(url):
    try:
        image = Image.open(requests.get(url, stream=True).raw).convert("RGB")

        with torch.no_grad():
            inputs = processor(image, return_tensors="pt").to(device)
            output = model.generate(**inputs, max_length=50)
            caption = processor.decode(output[0], skip_special_tokens=True)

        return caption

    except Exception as e:
        print(f"Error processing image {url}: {str(e)}")
        return "Error generating caption"
