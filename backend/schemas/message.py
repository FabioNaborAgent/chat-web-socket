from pydantic import BaseModel, Field

class MessageCreate(BaseModel):
    message:str = Field(min_length=1, max_length=150)