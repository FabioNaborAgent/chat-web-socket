from dataclasses import dataclass
from typing import Literal

# interface NewMessage {
#     id:number
#     chat_id:number
#     is_client:boolean
#     message:string
#     created_at:string
# }
# interface NewChat{
#     id: number,
#     name: string,
#     subject: string,
#     email:string,
#     telephone:string,
#     user_id: number,
#     client_id: number
# }

@dataclass(frozen=True, slots=True)
class NewMessage:
    id:int
    chat_id:int
    is_client:bool
    message:str
    created_at:str

@dataclass(frozen=True, slots=True)
class NewChat:
    id:int
    user_id:int
    client_id:int
    name:str
    subject:str
    email:str
    telephone:str

@dataclass(frozen=True, slots=True)
class NewMessageEvent:
    data: NewMessage
    event: Literal["new-message"] = "new-message"


@dataclass(frozen=True, slots=True)
class NewChatEvent:
    data: NewChat
    event: Literal["new-chat"] = "new-chat"