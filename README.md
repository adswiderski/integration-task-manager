Personal project for some additional FastAPI and backend development training.

REST API for task management with JWT authentication.

## Tech Stack

- FastAPI
- SQLAlchemy + SQLite
- JWT authentication
- pytest

## Setup

### 1. Clone and setup
```bash
git clone https://github.com/adswiderski/integration-task-manager.git
cd integration-task-manager
python -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies
```bash
pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] pytest httpx
```

### 3. Run the app
```bash
uvicorn app.main:app --reload
```

Open http://localhost:8000/docs for interactive API documentation.

## Testing

Run all tests:
```bash
python -m pytest app/tests/ -v
```

Run with coverage:
```bash
python -m pytest app/tests/ --cov=app --cov-report=html
```

## API Endpoints

### Auth
- `POST /register` - Create account
- `POST /login` - Get JWT token

### Tasks (authentication required)
- `GET /tasks/` - List your tasks
- `POST /tasks/` - Create task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### Quick Test
```bash
# Register
curl -X POST http://localhost:8000/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"pass"}'

# Login
curl -X POST http://localhost:8000/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"pass"}'

# Use the access_token from login response in Authorization header for other endpoints
```

## Project Structure
```
app/
├── main.py           # FastAPI app
├── db/               # Database models
├── schemas/          # Pydantic schemas
├── utils/            # Auth & JWT
└── tests/            # Test suite
```

## Progress

- [x] User authentication (JWT)
- [x] CRUD operations for tasks
- [x] User isolation
- [x] Test suite (100% passing)
TODO
- [ ] Docker setup
- [ ] Additional features
