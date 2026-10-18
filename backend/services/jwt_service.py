import os
from pathlib import Path
from dotenv import load_dotenv

from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import HTTPException
import jwt
from jwt.exceptions import InvalidTokenError

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

class JwtService:

    def __init__(self, secret_key:str | None = None, expire_at:int | None = None, algorithm:str = "HS256"):
        self.secret_key = secret_key if secret_key is not None else os.environ["JWT_SECRET_KEY"]
        self.algorithm = algorithm
        self.expire_at = expire_at if expire_at is not None else int(os.environ["EXPIRE_AT"])
    
    def create(self, id:int, type:Literal['client', 'agent'], chat_id:int | None = None):

        payload = {}

        if type not in ['client', 'agent']:
            raise ValueError('Tipo de usuário inválido!')

        if type == 'client':
            if not chat_id:
                raise ValueError('Informe o chat_id!')
            payload['chat_id'] = str(chat_id)
            
        now = datetime.now(timezone.utc)

        payload.update({
            "id": str(id),
            "type":type,
            "iat": now,
            "exp": now + timedelta(minutes=self.expire_at),
        })


        return jwt.encode(
            payload,
            self.secret_key,
            algorithm=self.algorithm,
        )

    def valid(self, token:str) :
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm],
                options={'require': ['id', 'type', 'iat', 'exp']},
            )
            if payload is None:
                raise HTTPException(
                    status_code=401,
                    detail="Token inválido ou expirado",
                )
            return payload
        except InvalidTokenError:
            return None