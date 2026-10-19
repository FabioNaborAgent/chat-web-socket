
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth_route import auth_router
from routes.chat_route import chat_router
from routes.websocket_route import websocket_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(websocket_router)

