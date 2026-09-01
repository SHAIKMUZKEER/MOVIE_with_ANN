from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.utils import get_current_user
from src.database.connection import get_db
from src.schemas import RecommendationResponse
from src.services.recommendation_service import (
    get_recommendations
)


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
    user_id: int = Depends(get_current_user)
):

    try:

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
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {str(e)}"
        )