### db.py (Updated)
import os
import json
import asyncio
import threading
from dotenv import load_dotenv
from pymongo import MongoClient
from broadcaster import broadcaster
from bson.json_util import dumps

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")

print("✅ MONGO_URI:", MONGO_URI)
print("✅ MONGO_DB:", MONGO_DB)
print("✅ MONGO_COLLECTION:", MONGO_COLLECTION)

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
collection = db[MONGO_COLLECTION]

def sync_watch_changes():
    print("👀 Watching MongoDB change stream in background thread...")
    try:
        with collection.watch(full_document='updateLookup') as stream:
            for change in stream:
                data = {
                    "operation": change["operationType"],
                    "document": change.get("fullDocument", {}),
                    "documentKey": change.get("documentKey", {})
                }
                message = dumps(data)
                print("📡 DB Change:", message)
                asyncio.run(broadcaster.broadcast(message))
    except Exception as e:
        print("❌ Error in change stream watcher:", e)

async def watch_changes():
    thread = threading.Thread(target=sync_watch_changes, daemon=True)
    thread.start()