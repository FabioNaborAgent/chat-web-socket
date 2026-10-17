
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, WebSocketException, status

from schemas.auth import AuthResquest

from core.connection_manager import manager
from services.jwt import jwt_service


app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    token = websocket.cookies.get("access_token")

    payload = jwt_service.valid(token)

    if not payload:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION
        )

    try:
        id = int(payload.get('id'))

        await manager.connect(id, websocket)

        while True:
            message = await websocket.receive_text()

            await websocket.send_text(
                f"Servidor recebeu: {message}"
            )

    except WebSocketDisconnect:
        print("Cliente desconectado")


@app.post("/login")
async def login(body:AuthResquest):
    print(body)
    return {
        "slaiced":"boa"
    }