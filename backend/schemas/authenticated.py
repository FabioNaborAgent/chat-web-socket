from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True, slots=True)
class Authenticated:
    auth_id: int
    type: Literal["agent", "client"]
    chat_id:int | None = None