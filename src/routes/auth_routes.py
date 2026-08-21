from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.logger import logging
from src.database.connection import get_db
from src.database.models import User
from src.schemas import UserCreate, UserResponse
from src.exception import CustomException
import sys
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

logging.info("enters in user_route file")

@router.post("/",response_model=UserResponse)
def create_user(user: UserCreate,db: Session = Depends(get_db)):

    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        try: 
            raise HTTPException(
                        status_code=400,
                        detail="Email already registered"
                    )
        except HTTPException as e: 
            print(CustomException(e , sys))

    # Create a new User object
    new_user = User(
        user_name=user.user_name,
        email=user.email,
        password_hash=user.password,
        user_type="website"
    )

    # Add the user to the current database session
    db.add(new_user)

    # Save the user permanently in MySQL
    db.commit()

    # Get the generated user_id and other database values
    db.refresh(new_user)

    # Return the created user
    return new_user