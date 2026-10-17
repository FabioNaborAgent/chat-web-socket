from fastapi import HTTPException, status

from core.connection_manager import ConnectionManager
from models.chat import Chat
from models.client import Client
from repositories.chat_repository import ChatRepository
from repositories.client_repository import ClientRepository
from repositories.user_repository import UserRepository
from schemas.chat import ChatCreate
from services.jwt_service import JwtService

from time import sleep


class ChatService:

    def __init__(self, chat_repository:ChatRepository, 
                 client_repository:ClientRepository,
                 user_repository:UserRepository, 
                 ws_manager:ConnectionManager,
                 jwt:JwtService):
        self.chat_repository = chat_repository
        self.client_repository = client_repository
        self.user_repository = user_repository
        self.ws_manager = ws_manager
        self.jwt = jwt

    async def create(self, data:ChatCreate):
        agents_online = await self.ws_manager.get_online('agent')
        print(agents_online)
        agent = await self.chat_repository.get_least_busy_agent(agents_online)
        print(agent)

        if not agent:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Nenhum agente online no momento."
            )

        client = await self.client_repository.get(data.name, data.email, data.telephone)
        
        print(client)
        
        sleep(5)

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
                user_id=agent.id, 
                client_id=client.id
            )
        )

        return {
            'chat_id':chat.id,
            'access_token':self.jwt.create(client.id, 'client', chat.id)
        }