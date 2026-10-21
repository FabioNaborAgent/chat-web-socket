from typing import Literal

from fastapi import HTTPException, status

from schemas.websocket import NewMessage, NewMessageEvent
from schemas.authenticated import Authenticated
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

    async def get_by_chat(self, auth:Authenticated, chat_id:int):
        chat = await self.chatRepository.get_by_id(chat_id)

        if (auth.type == 'agent' and int(chat.user_id) != auth.auth_id) or (auth.type == 'client' and int(chat.client_id) != auth.auth_id):
                    raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="Você não faz parte desse chat!"
                            )

        return await self.messageRepository.get_by_chat(chat_id)

    async def create(self, auth:Authenticated, chat_id:int, message:str, check_chat_closed:bool=True):
        chat = await self.chatRepository.get_by_id(chat_id)

        if not chat:
            raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Chat não localizado!"
                    )

        if (auth.type == 'agent' and chat.user_id != auth.auth_id) or (auth.type == 'client' and chat.client_id != auth.auth_id):
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
            is_client=(auth.type == "client"),
            message=message
        ))

        await self.ws_manager.send_for_list([
             Authenticated(chat.client_id, 'client'),
             Authenticated(chat.user_id, 'agent')
        ], NewMessageEvent(
             data=NewMessage(
                  id=result.id,
                  chat_id=chat.id,
                  is_client=auth.type == 'client',
                  message=message,
                  created_at=str(result.created_at)
             )
        ))
        
        return result