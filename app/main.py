from fastapi import FastAPI

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