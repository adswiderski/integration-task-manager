from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from app.db.database import Base, get_db, engine
from app.db.models.task import Task
from app.routers import task
from app.schemas.task import TaskCreate, TaskRead


Base.metadata.create_all(bind=engine)
app = FastAPI(title="Integration task manago")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/mental")
def mental():
    return {"status": "dead"}

@app.get("/version")
def version():
    return {"aaa": {"version": "0.1.0", "service": "integration-task-manager"}}

@app.get("/tasks/", response_model=list[TaskRead])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks

@app.post("/tasks/", response_model=TaskRead)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(
        title=task.title,
        description=task.description,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
    
app.include_router(task.router)


@app.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(task_id: int, task_update: TaskCreate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.title = task_update.title
    task.description = task_update.description
    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}", response_model=dict)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": f"Task {task_id} got deleted"}