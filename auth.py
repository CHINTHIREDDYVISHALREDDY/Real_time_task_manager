### auth.py (Updated with user context)
from fastapi import APIRouter, Request, HTTPException
from db import db
from bson import ObjectId
from fastapi.responses import JSONResponse
from sessions import user_context

user_context = {}

auth_router = APIRouter(prefix="/auth")

@auth_router.post("/register")
async def register(request: Request):
    data = await request.json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")  # Should be one of: client, manager, team_lead, team_member

    if not email or not password or not role:
        raise HTTPException(status_code=400, detail="Missing fields")

    existing = db["users"].find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    db["users"].insert_one({
        "username": username,
        "email": email,
        "password": password,
        "role": role
    })
    return {"message": "User registered"}

@auth_router.post("/login")
async def login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    user = db["users"].find_one({"email": email, "password": password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = str(user["_id"])
    user_context[user_id] = {
        "username": user["username"],
        "role": user["role"]
    }

    return JSONResponse(content={
        "message": "Login successful",
        "user": {
            "id": user_id,
            "username": user["username"],
            "role": user["role"]
        }
    })

@auth_router.get("/me")
def get_me(request: Request):
    user_id = request.query_params.get("id")
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user ID")

    user = db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "role": user["role"]
    }


# from fastapi import APIRouter, Request, HTTPException
# from db import db

# auth_router = APIRouter(prefix="/auth")

# @auth_router.post("/register")
# async def register(request: Request):
#     data = await request.json()
#     username = data.get("username")
#     email = data.get("email")
#     password = data.get("password")
#     role = data.get("role")



#     if not email or not password or not role:
#         raise HTTPException(status_code=400, detail="Missing fields")

#     existing = db["users"].find_one({"email": email})
#     if existing:
#         raise HTTPException(status_code=400, detail="User already exists")

#     db["users"].insert_one(data)
#     return {"message": "User registered"}

# @auth_router.post("/login")
# async def login(request: Request):
#     data = await request.json()
#     email = data.get("email")
#     password = data.get("password")

#     user = db["users"].find_one({"email": email, "password": password})
#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     return {
#         "message": "Login successful",
#         "user": {
#             "id": str(user["_id"]),
#             "role": user["role"]
#         }
#     }
