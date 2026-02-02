from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.task import Task
from app.schemas.task import TaskRead

router = APIRouter()

@router.get("/tasks")
def list_task(db: Session = Depends(get_db)):
    return db.query(Task).all()
    
@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

