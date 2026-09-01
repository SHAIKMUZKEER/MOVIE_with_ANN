from fastapi import FastAPI , Request
from src.logger import logging
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from src.routes.auth_routes import router as user_router
from src.routes.movie_routes import router as movie_router 
from src.routes.rating_routes import router as rating_router
from src.routes.recommendation_routes import router as recommendation_router


logging.info("enters into app.py file")
# Create FastAPI application
app = FastAPI(
    title="Movie Recommendation API",
    description="Backend API for the Movie Recommendation System",
    version="1.0.0"
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(user_router)
app.include_router(movie_router)
app.include_router(rating_router)
app.include_router(recommendation_router)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


templates = Jinja2Templates(
    directory="templates"
)

@app.get("/")
def root(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request
        }
    )

@app.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={
            "request": request
        }
    )


@app.get("/signup")
def signup_page(request: Request):

    return templates.TemplateResponse(
        request = request,
        name = "signup.html",
        context = {
            "request": request
        }
    )

@app.get("/movies")
def movies_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="movies.html",
        context={
            "request": request
        }
    )

@app.get("/recommendations")
def recommendations_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="recommendations.html",
        context={
            "request": request
        }
    )

logging.info("closed the fastapi backend")