from pydantic import BaseModel, Field

class MessageCreate(BaseModel):
    chat_id: int
    message:str = Field(min_length=3, max_length=150)