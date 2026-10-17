from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.message import Message

class MessageRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_chat(self, chat_id: int):
        result = await self.db.execute(
            select(Message).where(Message.chat_id == chat_id).order_by(Message.created_at)
        )
        return result.scalar().all()

    async def create(self, message: Message):
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message