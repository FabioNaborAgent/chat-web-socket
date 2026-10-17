
from collections import defaultdict
from fastapi import WebSocket
import asyncio

class ConnectionManager:
    def __init__(self):
        self.connections: dict[int, set[WebSocket]] = defaultdict(set)
        self.lock = asyncio.Lock()

    async def connect(self, id: int, websocket: WebSocket):
        await websocket.accept()

        async with self.lock:
            self.connections[id].add(websocket)

    async def disconnect(self, id: int, websocket: WebSocket):
        async with self.lock:
            connections = self.connections.get(id)

            if connections is not None:
                connections.discard(websocket)

                if not connections:
                    del self.connections[id]

    async def is_online(self, id: int) -> bool:
        async with self.lock:
            return bool(self.connections.get(id))

    async def get_online(self):
        async with self.lock:
            return list(self.connections.keys())

    async def send(self, id: int, message: str):
        async with self.lock:
            connections = list(self.connections.get(id, set()))

        for websocket in connections:
            try:
                await websocket.send_text(message)
            except Exception:
                await self.disconnect(id, websocket)

manager = ConnectionManager()
