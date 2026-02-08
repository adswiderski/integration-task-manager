from datetime import datetime
from typing_extensions import Optional
from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    status: str
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None