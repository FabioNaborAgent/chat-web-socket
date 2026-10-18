from fastapi import APIRouter, HTTPException, Response, status,Depends

from schemas.message import MessageCreate
from services.message_service import MessageService
from schemas.chat import ChatCreate
from services.chat_service import ChatService
from core.dependencies import get_authenticate, get_chat_service, get_message_service

chat_router = APIRouter()

@chat_router.get("/chat")
async def get(auth: dict = Depends(get_authenticate),chat_service: ChatService = Depends(get_chat_service)):
    return await chat_service.get_by_user(auth['type'], auth['id'])

@chat_router.put("/chat/{chat_id}")
async def get(chat_id:int, response:Response, auth: dict = Depends(get_authenticate),chat_service: ChatService = Depends(get_chat_service)):
    result = await chat_service.finalized(auth['id'], auth['type'], chat_id)
    if auth["type"] == "client":
        response.delete_cookie(
            key="access_token",
            path="/",
        )
    return result

@chat_router.post("/chat")
async def create(body: ChatCreate, response:Response, chat_service: ChatService = Depends(get_chat_service)):
    result = await chat_service.create(body)
    response.set_cookie(
            key="access_token",
            value=result.get('access_token'),
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=3600,
            path="/"
        )
    return result

@chat_router.get("/chat/{chat_id}/message")
async def get(chat_id:int, auth: dict = Depends(get_authenticate),message_service: MessageService = Depends(get_message_service)):
    chat_id = chat_id if auth['type'] == 'agent' else auth['chat_id']
    return await message_service.get_by_chat(auth['id'], auth['type'], chat_id)

@chat_router.post("/chat/{chat_id}/message")
async def create(chat_id:int, body: MessageCreate,  auth: dict = Depends(get_authenticate), message_service: MessageService = Depends(get_message_service)):
    result = await message_service.create(auth['id'], chat_id, auth['type'], body.message)
    return result