from pydantic import BaseModel, Field, EmailStr

class ChatCreate(BaseModel):
    name:str = Field(min_length=3, max_length=100)
    subject:str = Field(min_length=3, max_length=100)
    email:EmailStr = Field(max_length=150)
    telephone:str = Field(min_length=11, max_length=11)
    