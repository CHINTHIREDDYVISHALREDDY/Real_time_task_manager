
### broadcaster.py (Updated)
from fastapi import WebSocket
from typing import List, Dict
from bson.json_util import loads
from sessions import user_context


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[Dict] = []

    async def connect(self, websocket: WebSocket, client_info: dict):
        self.active_connections.append({
            "websocket": websocket,
            "id": client_info["id"],
            "role": client_info["role"]
        })

    def disconnect(self, websocket: WebSocket):
        self.active_connections = [
            conn for conn in self.active_connections if conn["websocket"] != websocket
        ]

    async def broadcast(self, message: str):
        try:
            event = loads(message)
            doc = event.get("document", {})

            for conn in self.active_connections:
                if should_notify(conn["id"], conn["role"], doc):
                    await conn["websocket"].send_text(message)
        except Exception as e:
            print("❌ Error during broadcast:", e)

def should_notify(user_id: str, role: str, doc: dict):
    creator = doc.get("created_by")
    if (creator == user_id) or (isinstance(creator, dict) and creator.get("id") == user_id):
        if role == "client":
            return True
    print("👀 checking if should notify", user_id, role, "→", doc.get("status"))


    if doc.get("manager_id") == user_id and role == "manager":
        return True
    if role == "team_lead":
       if doc.get("team_lead_id") == user_id:
        return True
    if doc.get("status") == "accepted" and not doc.get("team_lead_id"):
        return True  # Only for new tasks

    if user_id in doc.get("team_members", []) and role == "team_member":
        return True

    return False

broadcaster = ConnectionManager()


# from fastapi import WebSocket
# from typing import List, Dict
# from bson.json_util import loads  # ✅ Handles ObjectId, date, etc.

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[Dict] = []

#     async def connect(self, websocket: WebSocket, client_info: dict):
#         self.active_connections.append({
#             "websocket": websocket,
#             "id": client_info["id"],
#             "role": client_info["role"]
#         })

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections = [
#             conn for conn in self.active_connections if conn["websocket"] != websocket
#         ]

#     async def broadcast(self, message: str):
#         try:
#             event = loads(message)  # ✅ Replace json.loads with bson.loads
#             doc = event.get("document", {})

#             for conn in self.active_connections:
#                 if should_notify(conn["id"], conn["role"], doc):
#                     await conn["websocket"].send_text(message)
#         except Exception as e:
#             print("❌ Error during broadcast:", e)

# # ✅ Safe filtering logic
# def should_notify(user_id: str, role: str, doc: dict):
#     # Check created_by
#     if isinstance(doc.get("created_by"), dict):
#         if doc["created_by"].get("id") == user_id:
#             return True

#     # Check assigned_to list
#     for assignee in doc.get("assigned_to", []):
#         if assignee.get("id") == user_id:
#             return True

#     # Check watchers list
#     for watcher in doc.get("watchers", []):
#         if watcher.get("id") == user_id:
#             return True

#     return False

# broadcaster = ConnectionManager()
