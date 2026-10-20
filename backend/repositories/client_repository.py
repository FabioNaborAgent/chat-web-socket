from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.client import Client
from datetime import datetime

class ClientRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, name:str, email:str, telephone:str):
        result = await self.db.execute(
            select(Client).where(Client.name == name, Client.email == email, Client.telephone == telephone)
        )
        return result.scalar_one_or_none()

    async def create(self, client: Client):
        self.db.add(client)
        await self.db.commit()
        await self.db.refresh(client)
        return client