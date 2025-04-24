from fastapi import FastAPI, HTTPException
from bson import ObjectId
from setup.mongoDB import mongoDB_setup, mongoDB_setup2
from eventDetection.eventdetect import eventDetection
import datetime
import image_memory
import labelling_model
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
)
# Helper function to convert MongoDB document to JSON-serializable dict
def serialize_mongo_doc(doc):
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
    return doc

@app.get("/")
def hello_world():
    return {"message": "Hello World"}


@app.get("/api/performAnalysis/{user_id}")
async def perform_analysis(user_id: str):
    try:
        collection = await mongoDB_setup()
        results = await collection.find({"userId": user_id, "status": "pending"}).to_list(length=100)

        if not results:
            raise HTTPException(status_code=404, detail="No uploads found for this user")

        serialized = [serialize_mongo_doc(doc) for doc in results]
        print("Serialized Data:", serialized)

        batch_event_data = []
        image_paths = []

        # Step 1: Collect image paths and captions
        for doc in serialized:
            path = doc["filePath"]
            print(f"Processing file: {path}")

            event_detected = eventDetection.detectEvent([doc])
            if event_detected:
                caption = image_memory.image_model(path)
                if caption and caption != "Error generating caption":
                    batch_event_data.append(caption)
                    image_paths.append((doc["_id"], True))
                else:
                    image_paths.append((doc["_id"], False))
            else:
                image_paths.append((doc["_id"], False))

        print("All captions for batch:", batch_event_data)

        labels = labelling_model.labelling_model(batch_event_data)
        print("Labels:", labels)

        label_index = 0
        for doc_id, has_data in image_paths:
            if has_data:
                label = labels[label_index] if label_index < len(labels) else None
                label_index += 1

                if label and label.lower() != "none":
                    await collection.update_one(
                        {"_id": ObjectId(doc_id)},
                        {"$set": {
                            "analytics": label,
                            "status": "completed",
                            "eventDetected": True
                        }}
                    )
                else:
                    await collection.update_one(
                        {"_id": ObjectId(doc_id)},
                        {"$set": {
                            "status": "completed",
                            "eventDetected": False
                        }}
                    )
            else:
                await collection.update_one(
                    {"_id": ObjectId(doc_id)},
                    {"$set": {
                        "status": "completed",
                        "eventDetected": False
                    }}
                )

        return {
            "message": "Batch data processed successfully",
            "totalProcessed": len(serialized),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/api/getUploads/{user_id}")
async def get_uploads(user_id: str):
    try:
        # Fetch uploads from main collection
        collection = await mongoDB_setup()
        results = await collection.find({
            "userId": user_id,
            "status": "completed",
            "analytics": {"$ne": None}
        }).to_list(length=100)

        if not results:
            raise HTTPException(status_code=404, detail="No uploads found for this user")

        serialized_uploads = [serialize_mongo_doc(doc) for doc in results]

        # Detect events from uploads
        detected_events = eventDetection.detect_events(serialized_uploads)

        # Store detected events in another collection
        collection2 = await mongoDB_setup2()

        # Structure detected event documents
        insert_docs = []
        for event in detected_events:
            insert_docs.append({
                "userId": user_id,
                "label": event["label"],
                "uploads": event["uploads"],
                "eventDetected": True,
                "timestamp": datetime.datetime.now().isoformat()
            })

        # Insert into the new collection
        if insert_docs:
            insert_result = await collection2.insert_many(insert_docs)
            print("Inserted Detected Events:", insert_result.inserted_ids)

            ids_to_delete = [ObjectId(doc["_id"]) for doc in results]
            delete_result = await collection.delete_many({"_id": {"$in": ids_to_delete}})
            print("Deleted from first collection:", delete_result.deleted_count)

        return {
            "message": "Uploads retrieved successfully",
            "data": {
                "detectedEvents": detected_events
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    

@app.get("/api/getMemory/{user_id}")
async def get_memory(user_id: str):
    try:
        # Fetch uploads from main collection
        collection = await mongoDB_setup2()
        results = await collection.find({
            "userId": user_id,
            "eventDetected" : True
        }).to_list(length=100)

        if not results:
            raise HTTPException(status_code=404, detail="No uploads found for this user")

        serialized_uploads = [serialize_mongo_doc(doc) for doc in results]

        return {
            "message": "Memory retrieved successfully",
            "data": serialized_uploads
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
