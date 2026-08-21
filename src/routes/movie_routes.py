from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys
from src.database.connection import get_db
from src.database.models import Movie
from src.schemas import MovieCreate, MovieResponse
from src.exception import CustomException
from src.logger import logging

router = APIRouter(
    prefix="/movies",
    tags=["Movies"]
)

logging.info("enters in movie_route file")
@router.post(
    "/",
    response_model=MovieResponse
)
def create_movie(
    movie: MovieCreate,
    db: Session = Depends(get_db)
):
    try:
                
        # Create a new Movie object
        new_movie = Movie(
            title=movie.title
        )
        
        # Add movie to database session
        db.add(new_movie)

        # Save movie permanently in MySQL
        db.commit()

        # Get the auto-generated movie_id and created_at
        db.refresh(new_movie)

        # Return the created movie
        return new_movie
    except Exception as e:

        print(CustomException("cannot create the movie database ") , sys)