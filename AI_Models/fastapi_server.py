from fastapi import FastAPI, HTTPException
from bson import ObjectId
from setup.mongoDB import mongoDB_setup
from eventDetection.eventdetect import eventDetection
import datetime
import image_memory
import labelling_model

app = FastAPI()

# Helper function to convert MongoDB document to JSON-serializable dict
def serialize_mongo_doc(doc):
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
    return doc

@app.get("/")
def hello_world():
    return {"message": "Hello World"}

@app.get("/api/getData/{user_id}")
async def get_uploads(user_id: str):
    try:
        collection = await mongoDB_setup()
        results = await collection.find({"userId": user_id}).to_list(length=100)

        if not results:
            raise HTTPException(status_code=404, detail="No uploads found for this user")

        serialized = [serialize_mongo_doc(doc) for doc in results]
        print("Serialized Data:", serialized)
        event_message = eventDetection.detectEvent(results)
        if event_message:
            for i in serialized:
                path = f'{i["filePath"]}'
                eventData = image_memory.image_model(path)
            respose = labelling_model.labelling_model(eventData)
            print("Event Data:",respose)
        else:
            print("No event detected")
        return {
            "message": "data retrieved",
            "data": serialized,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
