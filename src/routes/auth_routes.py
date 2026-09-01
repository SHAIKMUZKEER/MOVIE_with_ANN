from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.logger import logging
from src.database.connection import get_db
from src.database.models import User
from src.schemas import UserCreate, UserResponse , LoginRequest , TokenResponds , SignupResponse
from src.services.auth_service import hash_password , verify_password , create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

logging.info("enters in user_route file")

@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=201
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    logging.info("Signup request received")


    # 1. Check whether email already exists
   
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    # 2. Hash the password


    hashed_password = hash_password(user.password)

    # creating the new user 
    new_user = User(
        user_name=user.user_name,
        email=user.email,
        password_hash=hashed_password,
        user_type="website"
    )

    db.add(new_user)

    db.commit()


    db.refresh(new_user)

    logging.info(
        f"User created successfully: {new_user.user_id}"
    )

# Create JWT automatically after signup
    access_token = create_access_token(
        new_user.user_id
    )

    logging.info(
        f"JWT created automatically for new user: {new_user.user_id}"
    )

    return {
        "user_id": new_user.user_id,
        "user_name": new_user.user_name,
        "email": new_user.email,
        "user_type": new_user.user_type,
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login",response_model=TokenResponds)
def login(user : LoginRequest , db : Session = Depends(get_db)): 
    logging.info("login verificatio has started")

    existing_user = (db.query(User).filter(User.email == user.email).first())

    if not existing_user: 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            details = "Invaild email or password"
        )

    # verify the password 
    password_valid = verify_password(user.password , existing_user.password_hash)

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # create JWT token

    access_token = create_access_token(existing_user.user_id)

    logging.info(f"logging is completed by user id {existing_user.user_id}")

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }