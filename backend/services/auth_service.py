from schemas.auth import AuthSchema
from repositories.user_repository import UserRepository
from core.security import *

from services.jwt_service import JwtService

class AuthService:

    def __init__(self, repository:UserRepository, jwtService:JwtService):
        self.repository = repository
        self.jwtService = jwtService

    async def authenticate(self, authSchema:AuthSchema):
        user = await self.repository.get_by_username(authSchema.username)
        if not user or not verify_password(authSchema.password, user.password):
            return None
        return self.jwtService.create(id=user.id, type='agent')
        