from fastapi import FastAPI
from src.logger import logging
from fastapi.middleware.cors import CORSMiddleware

from src.routes.auth_routes import router as user_router
from src.routes.movie_routes import router as movie_router 
from src.routes.rating_routes import router as rating_router


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


@app.get("/")
def root():

    return {
        "message": "Movie Recommendation API is running"
    }

logging.info("closed the fastapi backend")