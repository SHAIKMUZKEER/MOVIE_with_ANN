from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import sys
from src.exception import CustomException
from src.database.connection import get_db
from src.database.models import Rating, User, Movie
from src.schemas import RatingCreate, RatingResponse
from src.logger import logging

router = APIRouter(
    prefix="/ratings",
    tags=["Ratings"]
)

logging.info("enters in rating_route file")

@router.post(
    "/",
    response_model=RatingResponse,
    status_code=status.HTTP_201_CREATED
)
def create_rating(
    rating: RatingCreate,
    db: Session = Depends(get_db)
):
    #Check whether the user exists
    user = (
        db.query(User)
        .filter(User.user_id == rating.user_id)
        .first()
    )

    try:

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
    except HTTPException as e:
        print(CustomException(e , sys))

    #Check whether the movie exists
    movie = (
        db.query(Movie)
        .filter(Movie.movie_id == rating.movie_id)
        .first()
    )

    try:
        if not movie:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Movie not found"
                )
    except HTTPException as e:
        print(CustomException(e , sys))

    #Check whether this user has already rated this movie
    existing_rating = (
        db.query(Rating)
        .filter(
            Rating.user_id == rating.user_id,
            Rating.movie_id == rating.movie_id
        )
        .first()
    )

    try:
        if existing_rating:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User has already rated this movie"
                )
    except HTTPException as e: 
        print(CustomException(e , sys))

    #Create new rating (Fixed attribute name: rating.ratings)
    new_rating = Rating(
        user_id=rating.user_id,
        movie_id=rating.movie_id,
        ratings=rating.ratings
    )

    try:
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create rating: {str(e)}"
        )

    return new_rating