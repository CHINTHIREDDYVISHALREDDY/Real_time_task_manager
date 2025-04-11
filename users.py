from fastapi import APIRouter, Request, HTTPException
from db import db

users_router = APIRouter()

@users_router.get("/users/team-members")
async def get_team_members():
    try:
        members = list(db["users"].find({"role": "team_member"}))
        for m in members:
            m["_id"] = str(m["_id"])
        return [{"id": m["_id"], "username": m.get("username", "Unnamed")} for m in members]
    except Exception as e:
        return {"error": str(e)}

@users_router.get("/users/info/{email}")
def get_user_info(email: str):
    user = db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "role": user["role"]
    }

@users_router.get("/users/all")
def get_all_users():
    users = list(db["users"].find({}))
    for u in users:
        u["_id"] = str(u["_id"])
    return users

# from fastapi import APIRouter, Request, HTTPException
# from db import db

# users_router = APIRouter()

# @users_router.get("/users/team-members")
# async def get_team_members():
#     try:
#         members = list(db["users"].find({"role": "team_member"}))
#         for m in members:
#             m["_id"] = str(m["_id"])  # Convert ObjectId to str
#         return [{"id": m["_id"], "username": m.get("username", "Unnamed")} for m in members]
#     except Exception as e:
#         return {"error": str(e)}


# @users_router.get("/users/info/{email}")
# def get_user_info(email: str):
#     user = db["users"].find_one({"email": email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
    
#     return {
#         "username": user["username"],
#         "role": user["role"]
#     }
