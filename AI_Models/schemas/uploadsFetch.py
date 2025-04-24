from jsonschema import validate, ValidationError
from pymongo.collection import Collection
from datetime import datetime
from typing import List, Dict, Any

# Your schema
detectedEventSchema = { 
    "type": "object",
    "properties": {
        "_id": {
            "type": "string",
            "format": "objectId"
        },
        "userId": {
            "type": "string",
            "description": "ID of the user associated with the uploads"
        },
        "label": {
            "type": "string",
            "description": "The event label like birthday, graduation, etc."
        },
        "eventDetected": {
            "type": "boolean"
        },
        "uploads": {
            "type": "array",
            "description": "List of uploads part of this detected event",
            "items": {
                "type": "object",
                "properties": {
                    "_id": {"type": "string", "format": "objectId"},
                    "fileName": {"type": "string"},
                    "filePath": {"type": "string", "format": "uri"},
                    "fileType": {"type": "string"},
                    "fileSize": {"type": "number"},
                    "analytics": {"type": "string"},
                    "status": {"type": "string"},
                    "uploadDate": {"type": "string", "format": "date-time"},
                    "eventDetected": {"type": "boolean"}
                },
                "required": [
                    "_id", "fileName", "filePath", "fileType",
                    "fileSize", "analytics", "status",
                    "uploadDate", "eventDetected"
                ]
            }
        },
        "eventTimestamp": {
            "type": "string",
            "format": "date-time",
            "description": "The timestamp when this event was detected or stored"
        },
        "detectionMethod": {
            "type": "string",
            "description": "How the event was detected (e.g., clustering, ML, etc.)"
        },
        "confidence": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "description": "Confidence score of the detection"
        },
        "metadata": {
            "type": "object",
            "description": "Additional custom information",
            "additionalProperties": True
        }
    },
    "required": ["userId", "label", "uploads", "eventDetected", "eventTimestamp"]
}

def insert_validated_events(collection: Collection, user_id: str, detected_events: List[Dict[str, Any]]) -> Dict[str, Any]:
    documents = []
    for event in detected_events:
        document = {
            "userId": user_id,
            "label": event["label"],
            "eventDetected": True,
            "uploads": event["uploads"],
            "eventTimestamp": datetime.now().isoformat(),
            "detectionMethod": "time_clustering + label_match",
            "confidence": 1.0,
            "metadata": {
                "uploadCount": len(event["uploads"])
            }
        }

        # Validate against schema
        try:
            validate(instance=document, schema=detectedEventSchema)
        except ValidationError as ve:
            return {
                "message": "Validation error",
                "error": str(ve),
                "invalid_document": document
            }

        documents.append(document)

    # Insert only valid documents
    if documents:
        result = collection.insert_many(documents)
        return {
            "message": "Detected events inserted successfully",
            "inserted_ids": [str(_id) for _id in result.inserted_ids]
        }

    return {
        "message": "No valid events to insert"
    }
