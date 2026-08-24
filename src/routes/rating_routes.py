from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.database.models import User

from src.schemas import (
    RatingCreate,
    RatingResponse, 
    BulkRatingCreate
)

from src.services.auth_service import (
    get_current_user
)

from src.services.rating_service import (
    create_rating
)
from src.services.rating_service import (
    create_bulk_ratings
)

from src.logger import logging


router = APIRouter(
    prefix="/ratings",
    tags=["Ratings"]
)


logging.info(
    "enters in rating_route file"
)

@router.post(
    "/",
    response_model=RatingResponse,
    status_code=status.HTTP_201_CREATED
)
def create_single_rating(
    rating: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        new_rating = create_rating(
            db=db,
            user_id=current_user.user_id,
            title=rating.title,
            ratings=rating.ratings
        )

        return new_rating

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create rating"
        )

# PHASE 6
# MULTIPLE MOVIE RATINGS

@router.post(
    "/bulk",
    status_code=status.HTTP_201_CREATED
)
def create_bulk_movie_ratings(
    rating_data: BulkRatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        if not rating_data.ratings:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No movie ratings provided"
            )

        user_id = current_user.user_id

        result = create_bulk_ratings(
            db=db,
            user_id=user_id,
            ratings_data=rating_data.ratings
        )

        return {
            "message": "Movie ratings processed successfully",
            "user_id": user_id,
            "created_count": len(result["created"]),
            "skipped_count": len(result["skipped"]),
            "created": result["created"],
            "skipped": result["skipped"]
        }

    except HTTPException:
        raise

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process movie ratings"
        )