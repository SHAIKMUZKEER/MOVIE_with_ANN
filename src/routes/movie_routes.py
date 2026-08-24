from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status
)

from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.database.models import Movie
from src.schemas import MovieCreate, MovieResponse
from src.services.movie_service import get_movies
from src.logger import logging


router = APIRouter(
    prefix="/movies",
    tags=["Movies"]
)

logging.info("enters in movie_route file")


# =====================================================
# CREATE MOVIE
# =====================================================

@router.post(
    "/",
    response_model=MovieResponse,
    status_code=status.HTTP_201_CREATED
)
def create_movie(
    movie: MovieCreate,
    db: Session = Depends(get_db)
):

    try:

        # Check whether movie already exists
        existing_movie = (
            db.query(Movie)
            .filter(Movie.title == movie.title)
            .first()
        )

        if existing_movie:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Movie already exists"
            )

        # Create new Movie object
        new_movie = Movie(
            title=movie.title.strip()
        )

        # Add movie to database session
        db.add(new_movie)

        # Save movie permanently
        db.commit()

        # Get generated movie_id
        db.refresh(new_movie)

        return new_movie

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        logging.error(
            f"Cannot create movie: {str(e)}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cannot create movie"
        )


# =====================================================
# GET MOVIES
# =====================================================

@router.get(
    "/",
    response_model=list[MovieResponse]
)
def get_movie_list(
    search: str | None = Query(
        default=None,
        description="Search movies by title"
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100
    ),
    offset: int = Query(
        default=0,
        ge=0
    ),
    db: Session = Depends(get_db)
):

    logging.info(
        f"Movie search request: "
        f"search={search}, "
        f"limit={limit}, "
        f"offset={offset}"
    )

    movies = get_movies(
        db=db,
        search=search,
        limit=limit,
        offset=offset
    )

    return movies
