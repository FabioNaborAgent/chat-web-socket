
from collections import defaultdict
from typing import Any, Literal
from fastapi import WebSocket
import asyncio

from schemas.authenticated import Authenticated

class ConnectionManager:
    def __init__(self):
        self.connections: dict[Literal['client', 'agent'], dict[int, set[WebSocket]]] = {
            "client": defaultdict(set),
            "agent": defaultdict(set)
        }
        self.lock = asyncio.Lock()

    async def connect(self, auth: Authenticated, websocket: WebSocket):
        await websocket.accept()
        print(auth)
        async with self.lock:
            self.connections[auth.type][auth.auth_id].add(websocket)

    async def disconnect(self, auth: Authenticated, websocket: WebSocket):
        async with self.lock:
            connections = self.connections.get(auth.type).get(auth.auth_id)

            if connections is not None:
                connections.discard(websocket)

                if not connections:
                    del self.connections[auth.type][auth.auth_id]

    async def is_online(self, auth: Authenticated) -> bool:
        async with self.lock:
            return bool(self.connections.get(auth.type).get(auth.auth_id))

    async def get_online(self, type:Literal['client', 'agent']):
        async with self.lock:
            return [user_id for user_id, socket in self.connections[type].items() if socket]

    async def send(self, auth: Authenticated, message: dict[str, Any]):
        async with self.lock:
            connections = list(self.connections[auth.type].get(auth.auth_id, set()))

        for websocket in connections:
            try:
                await websocket.send_json(message)
            except Exception:
                await self.disconnect(auth, websocket)

