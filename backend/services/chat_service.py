from fastapi import HTTPException, status

from schemas.authenticated import Authenticated
from services.message_service import MessageService
from core.connection_manager import ConnectionManager
from models.chat import Chat
from models.client import Client
from repositories.chat_repository import ChatRepository
from repositories.client_repository import ClientRepository
from repositories.user_repository import UserRepository
from schemas.chat import ChatCreate
from services.jwt_service import JwtService


class ChatService:

    def __init__(self, chat_repository:ChatRepository, 
                 client_repository:ClientRepository,
                 user_repository:UserRepository, 
                 message_service:MessageService,
                 ws_manager:ConnectionManager,
                 jwt:JwtService):
        self.chat_repository = chat_repository
        self.client_repository = client_repository
        self.user_repository = user_repository
        self.message_service = message_service
        self.ws_manager = ws_manager
        self.jwt = jwt

    async def get_by_user(self, auth:Authenticated):
        if auth.type == 'client':
            raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Acesso negado!"
                        )
        chats = await self.chat_repository.get_by_user(auth.auth_id)
        if not chats:
            return []
        return chats

    async def finalize_chat(self, auth:Authenticated, chat_id:int):
        chat = await self.chat_repository.get_by_id(chat_id)

        if chat.status == False:
            return chat

        if not chat:
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Não encontrado"
        )

        if (auth.type == 'agent' and chat.user_id != auth.auth_id) or (auth.type == 'client' and chat.client_id != auth.auth_id):
            raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Você não faz parte desse chat!"
            )

        chat.status = False

        result = await self.chat_repository.update(chat)

        await self.message_service.create(auth, chat_id, '[Atenção] Chat Finalizado', False)

        return result

    async def create(self, data:ChatCreate):
        agents_online = await self.ws_manager.get_online('agent')
        agent_id = await self.chat_repository.get_least_busy_agent(agents_online)

        if not agent_id:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Nenhum agente online no momento."
            )

        client = await self.client_repository.get(data.name, data.email, data.telephone)
        
        if not client:
            client = await self.client_repository.create(
                Client(
                    name=data.name, 
                    email=data.email, 
                    telephone=data.telephone
                )
            )

        chat = await self.chat_repository.create(
            Chat(
                subject=data.subject, 
                user_id=agent_id, 
                client_id=client.id
            )
        )
        
        await self.ws_manager.send(Authenticated(auth_id=agent_id, type='agent'), {
            "event": "new-chat",
            "data": {
                "id": chat.id,
                "name": client.name,
                "subject": chat.subject,
                "email":client.email,
                "telephone":client.telephone,
                "user_id": chat.user_id,
                "client_id": chat.client_id
            }
        })

        return {
            'chat_id':chat.id,
            'access_token':self.jwt.create(client.id, 'client', chat.id)
        }