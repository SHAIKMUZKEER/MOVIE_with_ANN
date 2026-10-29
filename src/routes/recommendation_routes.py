from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.database.models import User
from src.schemas import RecommendationResponse
from src.services.auth_service import get_current_user
from src.services.recommendation_service import get_recommendations


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get(
    "/",
    response_model=RecommendationResponse
)
def recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        # Get user_id from JWT authenticated user
        user_id = current_user.user_id

        recommendations = get_recommendations(
            db=db,
            user_id=user_id
        )

        return {
            "user_id": user_id,
            "recommendations": recommendations
        }

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recommendation failed: {str(e)}"
        )