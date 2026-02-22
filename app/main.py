from datetime import timedelta
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db.database import Base, get_db, engine
from app.db.models.task import Task
from app.db.models.user import User
from app.routers import task
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.schemas.user import UserCreate
from app.utils.auth import hash_password, verify_password
from app.utils.jwt import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, verify_token
import os
from fastapi.middleware.cors import CORSMiddleware



if os.getenv("TESTING") != "true":
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="Integration task manago")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/mental")
def mental():
    return {"status": "dead"}

@app.get("/version")
def version():
    return {"aaa": {"version": "0.1.0", "service": "integration-task-manager"}}

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Dependency, które weryfikuje token i zwraca zalogowanego usera
    Uzycie: current_user = Depends(get_current_user)
    """
    token = credentials.credentials

    email = verify_token(token)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


@app.get("/tasks/", response_model=list[TaskRead])
def get_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).all()
    return tasks

@app.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Zwraca dane zalogowanego uzytkownika
    Wymaga tokenu w headerze: Authorization: Bearer <token>
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
    }

@app.post("/tasks/", response_model=TaskRead)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = Task(
        title=task.title,
        description=task.description,
        owner_id=current_user.id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

app.include_router(task.router)

@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates task - own only
    Token required
    """
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.status is not None:
        task.status = task_update.status

    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deleted task - own only
    Token required
    """
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}



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
             

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    """
    Logowanie uzytkownika:
    - sprawdza e-mail i hasło
    - zwraca JWT token
    """

    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not verify_password(user.password, str(db_user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
