from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from app.db.database import Base, get_db, engine
from app.db.models.task import Task
from app.db.models.user import User
from app.routers import task
from app.schemas.task import TaskCreate, TaskRead
from app.schemas.user import UserCreate
from app.utils.auth import hash_password


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

@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email} for u in users]


@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        email=user.email,
        hashed_password=user.hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.close()


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email had been registered already")
    
    hashed = hash_password(user.password)
    
    db_user = User(email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"id": db_user.id, "email": db_user.email}
             