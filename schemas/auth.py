from pydantic import BaseModel, Field

class AuthResquest(BaseModel):
    username:str = Field(min_length=5, max_length=50)
    password:str = Field(min_length=8, max_length=30)

