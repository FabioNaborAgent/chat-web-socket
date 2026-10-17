from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

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

async def get_authenticate(credentials:HTTPAuthorizationCredentials = Depends(security), jwt: JwtService = Depends(get_jwt_service)):
    token = credentials.credentials

    try:
        return jwt.valid(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )
