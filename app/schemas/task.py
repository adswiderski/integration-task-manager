from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Task

router = APIRouter()

@router.get("/tasks")
def list_task(db: Session = Depends(get_db)):
    return db.query(Task).all()
    