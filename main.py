from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from broadcaster import broadcaster
from db import watch_changes
import asyncio
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from auth import auth_router
from tasks import tasks_router
from users import users_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Application startup initiated.")
    await watch_changes()
    print("✅ Application startup complete.")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(users_router)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("✅ WebSocket connection accepted.")
    try:
        # Receive client info (id, role)
        data = await websocket.receive_json()
        print("🧾 Received client info:", data)
        await broadcaster.connect(websocket, data)

        # Keep the connection alive
        while True:
            await websocket.receive_text()  # This blocks and keeps connection open

    except WebSocketDisconnect:
        print("❌ WebSocket disconnected")
        broadcaster.disconnect(websocket)

    except Exception as e:
        print("❗ WebSocket error:", e)
        broadcaster.disconnect(websocket)
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from broadcaster import broadcaster
# from db import watch_changes, db
# import asyncio
# from contextlib import asynccontextmanager
# from fastapi.middleware.cors import CORSMiddleware


# from auth import auth_router
# from tasks import tasks_router

# from users import users_router



# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     print("🚀 Application startup initiated.")
#     await watch_changes()
#     print("✅ Application startup complete.")
#     yield

# app = FastAPI(lifespan=lifespan)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Or ["http://localhost:3000"] if React
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # Mount routers
# app.include_router(auth_router)
# app.include_router(tasks_router)
# app.include_router(users_router)

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     print("✅ WebSocket connection accepted.")
#     try:
#         data = await websocket.receive_json()
#         print("🧾 Received client info:", data)
#         await broadcaster.connect(websocket, data)
#         while True:
#             await websocket.receive_text()
#     except WebSocketDisconnect:
#         print("❌ WebSocket disconnected")
#         broadcaster.disconnect(websocket)
#     except Exception as e:
#         print("❗ WebSocket error:", e)
#         broadcaster.disconnect(websocket)
