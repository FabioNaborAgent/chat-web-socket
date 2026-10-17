
from collections import defaultdict
from typing import Literal
from fastapi import WebSocket
import asyncio

class ConnectionManager:
    def __init__(self):
        self.connections: dict[Literal['client', 'agent'], dict[int, set[WebSocket]]] = {
            "client": defaultdict(set),
            "agent": defaultdict(set)
        }
        self.lock = asyncio.Lock()

    async def connect(self, type:Literal['client', 'agent'], id: int, websocket: WebSocket):
        await websocket.accept()

        async with self.lock:
            self.connections[type][id].add(websocket)

    async def disconnect(self, type:Literal['client', 'agent'], id: int, websocket: WebSocket):
        async with self.lock:
            connections = self.connections.get(type).get(id)

            if connections is not None:
                connections.discard(websocket)

                if not connections:
                    del self.connections[type][id]

    async def is_online(self, type:Literal['client', 'agent'], id: int) -> bool:
        async with self.lock:
            return bool(self.connections.get(type).get(id))

    async def get_online(self, type:Literal['client', 'agent']):
        async with self.lock:
            return [user_id for user_id, socket in self.connections[type].items() if socket]

    async def send(self, type:Literal['client', 'agent'], id: int, message: str):
        async with self.lock:
            connections = list(self.connections[type].get(id, set()))

        for websocket in connections:
            try:
                await websocket.send_text(message)
            except Exception:
                await self.disconnect(type, id, websocket)

