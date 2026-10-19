from typing import List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from models.client import Client
from models.chat import Chat
from models.user import User
from models.message import Message

class ChatRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, chat_id: int):
        result = await self.db.execute(
            select(Chat).where(Chat.id == chat_id)
        )
        return result.scalar_one_or_none()

    async def update(self, chat: Chat):
        await self.db.commit()
        await self.db.refresh(chat)
        return chat

    async def get_by_user(self, user_id: int):
        result = await self.db.execute(
            select(Chat.id, Client.name, Chat.subject, Client.email, Client.telephone, func.max(Message.created_at).label("last_message"))
            .select_from(Chat)
            .join(Client, Client.id == Chat.client_id)
            .outerjoin(Message, Message.chat_id == Chat.id)
            .where(Chat.user_id == user_id, Chat.status == True)
            .group_by(
                Chat.id,
                Client.name,
                Chat.subject,
                Client.email,
                Client.telephone
            )
            .order_by(func.max(Message.created_at).desc().nulls_last())
        )
        return [dict(row) for row in result.mappings().all()]

    async def get_least_busy_agent(self, user_ids:List[int]):
        if not user_ids:
            return None
    
        result = await self.db.execute(
            select(User.id)
            .select_from(User)
            .outerjoin(Chat, Chat.user_id == User.id)
            .where(User.id.in_(user_ids), Chat.status == True).group_by(User.id).order_by(func.count(Chat.id).asc()).limit(1)
        )
        return result.scalar_one_or_none()

    async def create(self, chat: Chat):
        self.db.add(chat)
        await self.db.commit()
        await self.db.refresh(chat)
        return chat