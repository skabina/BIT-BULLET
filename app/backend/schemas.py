from pydantic import BaseModel


class GuessRequest(BaseModel):
    target: int
    binary_in: str