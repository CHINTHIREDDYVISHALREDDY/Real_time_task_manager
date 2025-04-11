from fastapi import APIRouter, Request, HTTPException
from db import db
from bson import ObjectId
from datetime import datetime

# Updated for single client, manager, team lead, dynamic team members
tasks_router = APIRouter(prefix="/tasks")


async def update_task_status(task_id: str, status: str, db):
    if not task_id or not status:
        raise HTTPException(status_code=400, detail="Missing task_id or status")

    update_fields = {"status": status}

    # 🔥 Always assign team_lead and move to in_progress
    if status in ["accepted", "in_progress"]:
        team_lead = db["users"].find_one({"role": "team_lead"})
        if team_lead:
            update_fields["team_lead_id"] = str(team_lead["_id"])
            update_fields["status"] = "in_progress"  # 🔄 Force to in_progress

    db["tasks"].update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_fields}
    )

    return {"message": f"Task status updated to {update_fields['status']}"}


@tasks_router.post("/create")
async def create_task(request: Request):
    data = await request.json()

    manager = db["users"].find_one({"role": "manager"})
    manager_id = str(manager["_id"]) if manager else None

    task_data = {
        "title": data.get("title"),
        "description": data.get("description"),
        "created_by": data.get("created_by"),
        "manager_id": manager_id,
        "team_lead_id": None,
        "team_members": [],
        "status": "requested",
        "progress": 0,
        "activity_log": [],
        "updated_at": datetime.now().isoformat()
    }

    db["tasks"].insert_one(task_data)
    return {"message": "Task created"}


@tasks_router.post("/admin/approve")
async def approve_task(request: Request):
    data = await request.json()
    task_id = data.get("task_id")
    status = data.get("status")

    return await update_task_status(task_id, status, db)


@tasks_router.post("/assign")
async def assign_task(request: Request):
    data = await request.json()
    print("📩 Received assign payload:", data)

    task_id = data.get("task_id")
    team_members = data.get("team_members")
    assigned_by = data.get("assigned_by")

    if not task_id:
        print("❌ Missing task_id")
    if not team_members:
        print("❌ Missing team_members")
    if not assigned_by:
        print("⚠️ Missing assigned_by")

    if not task_id or not team_members:
        raise HTTPException(status_code=400, detail="Missing task_id or team_members")

    # Safe update
    update_fields = {
        "team_members": team_members,
        "updated_at": datetime.now().isoformat(),
    }

    # Optional: Only update status if currently accepted
    existing = db["tasks"].find_one({"_id": ObjectId(task_id)})
    if existing and existing.get("status") == "accepted":
        update_fields["status"] = "in_progress"

    if assigned_by:
        update_fields["assigned_by"] = assigned_by

    db["tasks"].update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_fields}
    )

    return {"message": "Task assigned successfully"}



@tasks_router.post("/progress")
async def update_progress(request: Request):
    data = await request.json()
    task_id = data.get("task_id")
    progress = data.get("progress", 0)

    if not task_id:
        raise HTTPException(status_code=400, detail="Missing task_id")

    new_status = "completed" if progress >= 100 else "in_progress"

    db["tasks"].update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"progress": progress, "status": new_status}}
    )

    return {"message": f"Task progress updated to {progress}%, status: {new_status}"}


@tasks_router.get("/dashboard/{role}/{user_id}")
def get_dashboard(role: str, user_id: str):
    query = {}

    if role == "client":
        query = {"created_by": user_id}
    elif role == "manager":
        query = {"manager_id": user_id}
    elif role == "team_lead":
        query = {"team_lead_id": user_id}
    elif role == "team_member":
        query = {"team_members": {"$in": [user_id]}}

    tasks = list(db["tasks"].find(query))

    for task in tasks:
        task["_id"] = str(task["_id"])

    return tasks
