import random
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.backend.schemas import GuessRequest


from .config_dir import settings

app = FastAPI(title="BIT-BULLET", description="Training program")

app.mount("/static", StaticFiles(directory=str(settings.STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(settings.TEMPLATES_DIR))


@app.get("/", response_class=HTMLResponse) 
async def home(request: Request): 
    initial_number = random.randint(1, 15)
    return templates.TemplateResponse("index.html", {
        "request": request, 
        "target_value": initial_number
    })


@app.post("/verify")
async def verify_answer(data: GuessRequest):
    
    try:
        user_decimal = int(data.binary_in, 2)
    except ValueError:
        return {"status": "error", "message": "INVALID BINARY"}

    if user_decimal == data.target:
        next_target = random.randint(1, 15)
        return {
            "status": "success",
            "message": "ACCESS GRANTED",
            "next_target": next_target
        }
    else:
        return {"status": "wrong", "message": "WRONG VALUE"}