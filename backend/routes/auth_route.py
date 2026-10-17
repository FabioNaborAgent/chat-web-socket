from fastapi import APIRouter, HTTPException, status,Depends
from core.dependencies import get_auth_service
from services.auth_service import AuthService
from schemas.auth import AuthSchema

auth_router = APIRouter()

@auth_router.post("/login")
async def login(body: AuthSchema, auth_service: AuthService = Depends(get_auth_service)):
    token = await auth_service.authenticate(body)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha inválidos",
        )

    return {
        'acess_token':token
    }