from typing import Literal

from fastapi import HTTPException, status

from core.connection_manager import ConnectionManager
from models.message import Message
from repositories.chat_repository import ChatRepository
from repositories.message_repository import MessageRepository
from core.security import *


class MessageService:

    def __init__(self, messageRepository:MessageRepository, chatRepository:ChatRepository, ws_manager:ConnectionManager):
        self.messageRepository = messageRepository
        self.chatRepository = chatRepository
        self.ws_manager = ws_manager

    async def get_by_chat(self, id:int, type:Literal['agent', 'client'], chat_id:int):
        chat = await self.chatRepository.get_by_id(chat_id)

        if (type == 'agent' and str(chat.user_id) != id) or (type == 'client' and str(chat.client_id) != id):
                    raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="Você não faz parte desse chat!"
                            )

        return await self.messageRepository.get_by_chat(chat_id)

    async def create(self, id:int, chat_id:int, type:Literal['agent', 'client'], message:str, check_chat_closed:bool=True):
        chat = await self.chatRepository.get_by_id(chat_id)

        if not chat:
            raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Chat não localizado!"
                    )
        
        if (type == 'agent' and str(chat.user_id) != id) or (type == 'client' and str(chat.client_id) != id):
            raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Você não faz parte desse chat!"
                    )

        if not chat.status and check_chat_closed:
             raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Chat já encerrado!"
            )

        result = await self.chatRepository.create(Message(
            chat_id=chat_id,
            is_client=(type == "client"),
            message=message
        ))

        ws_payload = {
            "event": "new-message",
            "data": {
                "id": result.id,
                "chat_id": chat.id,
                "is_client": type == 'client',
                "message": message,
            }
        }

        await self.ws_manager.send('client', chat.client_id, ws_payload)
        await self.ws_manager.send('agent', chat.user_id, ws_payload)
        
        return result