import os
from pathlib import Path
from dotenv import load_dotenv

from datetime import datetime, timedelta, timezone
from typing import Literal

import jwt
from jwt.exceptions import InvalidTokenError

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

class JwtService:

    def __init__(self, secret_key:str | None = None, expire_at:int=30, algorithm:str = "HS256"):
        print(os.environ)
        self.secret_key = secret_key if secret_key is not None else os.environ["JWT_SECRET_KEY"]
        self.algorithm = algorithm
        self.expire_at = expire_at
    
    def create(self, id:int, type:Literal['client', 'user']):

        if type not in ['client', 'user']:
            raise ValueError('Tipo de usuário inválido!')

        now = datetime.now(timezone.utc)

        payload = {
            "sub": str(id),
            "type":type,
            "iat": now,
            "exp": now + timedelta(minutes=self.expire_at),
        }

        return jwt.encode(
            payload,
            self.secret_key,
            algorithm=self.algorithm,
        )

    def valid(self, token:str):
        try:
            return jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm],
                options={'require': ['exp', 'iat', 'sub', 'type']},
            )
        except InvalidTokenError:
            return None

jwt_service = JwtService()