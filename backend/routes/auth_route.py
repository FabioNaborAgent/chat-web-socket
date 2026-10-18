from fastapi import APIRouter, HTTPException, Response, status,Depends
from core.dependencies import get_auth_service, get_authenticate
from services.auth_service import AuthService
from schemas.auth import AuthSchema

auth_router = APIRouter()

@auth_router.get("/me")
async def me(auth: dict = Depends(get_authenticate)):
    return {
        'id':int(auth['id']),
        'type':auth['type'],
    }

@auth_router.post("/login")
async def login(body: AuthSchema, response:Response, auth_service: AuthService = Depends(get_auth_service)):
    token = await auth_service.authenticate(body)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha inválidos",
        )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=3600,
        path="/"
    )

    return {
        'acess_token':token
    }