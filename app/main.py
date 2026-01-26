from fastapi import FastAPI

app = FastAPI(title="Integration task manago")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/mental")
def health():
    return {"status": "dead"}