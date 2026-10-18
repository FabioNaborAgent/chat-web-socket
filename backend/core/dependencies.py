from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from repositories.message_repository import MessageRepository
from services.message_service import MessageService
from core.connection_manager import ConnectionManager
from repositories.chat_repository import ChatRepository
from repositories.client_repository import ClientRepository
from services.chat_service import ChatService
from services.jwt_service import JwtService
import jwt

from core.database import get_db
from repositories.user_repository import UserRepository
from services.auth_service import AuthService

security = HTTPBearer()

ws_manager = ConnectionManager()

jwt_service = JwtService()

def get_connection_manager() -> ConnectionManager:
    return ws_manager

def get_jwt_service() -> JwtService:
    return jwt_service

def get_auth_service(db: AsyncSession = Depends(get_db), 
                     jwt: JwtService = Depends(get_jwt_service)) -> AuthService:
    repository = UserRepository(db)
    return AuthService(repository, jwt)

def get_chat_service(db: AsyncSession = Depends(get_db), 
                     manager: ConnectionManager = Depends(get_connection_manager),
                     jwt:JwtService = Depends(get_jwt_service)):
    chat_repository = ChatRepository(db)
    user_repository = UserRepository(db)
    client_repository = ClientRepository(db)
    return ChatService(chat_repository, client_repository, user_repository, manager, jwt)

def get_message_service(db: AsyncSession = Depends(get_db), 
                     manager: ConnectionManager = Depends(get_connection_manager)):
    message_repository = MessageRepository(db)
    chat_repository = ChatRepository(db)

    return MessageService(message_repository, chat_repository, manager)

async def get_authenticate(access_token: str | None = Cookie(default=None), jwt: JwtService = Depends(get_jwt_service)):
    try:
        if not access_token:
            raise HTTPException(
                status_code=401,
                detail="Não autenticado",
            )
        return jwt.valid(access_token)
    except jwt.ExpiredSignatureError or jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Acesso negado",
        )
