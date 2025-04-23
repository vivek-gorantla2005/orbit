import pymongo
from pymongo import MongoClient
from pymongo import AsyncMongoClient

async def mongoDB_setup():
    uri = "mongodb+srv://23eg105j66:DwvIAvGK2i7zxYKD@uploadmetadata.osy9ydb.mongodb.net/?retryWrites=true&w=majority"
    client = AsyncMongoClient(uri)
    db = client["test"]
    collection = db["uploads"]
    return collection