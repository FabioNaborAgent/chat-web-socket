
from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect, WebSocketException, status
from fastapi.middleware.cors import CORSMiddleware

from core.connection_manager import ConnectionManager
from core.dependencies import get_connection_manager, get_jwt_service
from services.jwt_service import JwtService
from routes.auth_route import auth_router
from routes.chat_route import chat_router


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

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, 
                             manager:ConnectionManager = Depends(get_connection_manager),
                             jwt:JwtService = Depends(get_jwt_service)):

    token = websocket.cookies.get('access_token')
    print(token)
    payload = jwt.valid(token)
    print(payload)
    

    if not payload:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION
        )

    try:
        id = int(payload.get('id'))

        await manager.connect(payload.get('type'), id, websocket)

        while True:
            message = await websocket.receive_text()

            await websocket.send_text(
                f"Servidor recebeu: {message}"
            )

    except WebSocketDisconnect:
        print("Cliente desconectado")

