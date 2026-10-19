
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from core.connection_manager import ConnectionManager
from core.dependencies import get_connection_manager, get_websocket_authenticate

websocket_router = APIRouter()

@websocket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, 
                             auth: dict = Depends(get_websocket_authenticate),
                             manager:ConnectionManager = Depends(get_connection_manager)):
    try:
        id = int(auth['id'])
        type = auth['type']
        await manager.connect(type, id, websocket)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print("Cliente desconectado")