from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import requests
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
captions =[]

def image_model(url):
    image_url = url
    image = Image.open(requests.get(image_url, stream=True).raw).convert("RGB")

    # Load BLIP model
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(device)

    with torch.no_grad():
        inputs = processor(image, return_tensors="pt").to(device)
        output = model.generate(**inputs, max_length=50)
        caption = processor.decode(output[0], skip_special_tokens=True)
        captions.append(caption)
    return captions
