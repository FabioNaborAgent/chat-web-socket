from fastapi import APIRouter, HTTPException, status,Depends

from schemas.chat import ChatCreate
from services.chat_service import ChatService
from core.dependencies import get_chat_service

chat_router = APIRouter()

@chat_router.post("/novo-assunto")
async def new_chat(body: ChatCreate, chat_service: ChatService = Depends(get_chat_service)):
    return await chat_service.create(body)