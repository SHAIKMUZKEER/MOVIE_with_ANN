from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.services.auth_service import get_current_user
from src.logger import logging
from src.database.connection import get_db
from src.database.models import User
from src.schemas import (
    UserCreate,
    LoginRequest,
    TokenResponds,
    SignupResponse, 
    ForgotPasswordRequest, 
    VerifyOTPRequest, 
    ResetPasswordRequest
)
from src.services.password_reset_service import (
    request_password_reset,
    verify_password_reset_otp,
    reset_password
)
from src.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

logging.info("enters in user_route file")

# SIGNUP

@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED
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
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # 2. Hash password
    hashed_password = hash_password(user.password)

    # 3. Create new user
    new_user = User(
        user_name=user.user_name,
        email=user.email,
        password_hash=hashed_password,
        user_type="website"
    )

    db.add(new_user)

    # 4. Save user
    db.commit()

    # 5. Get MySQL-generated user_id
    db.refresh(new_user)

    logging.info(
        f"User created successfully: {new_user.user_id}"
    )

    # 6. Automatically create JWT
    access_token = create_access_token(
        new_user.user_id
    )

    logging.info(
        f"JWT created automatically for new user: {new_user.user_id}"
    )

    # 7. Return user details + JWT
    return {
        "user_id": new_user.user_id,
        "user_name": new_user.user_name,
        "email": new_user.email,
        "user_type": new_user.user_type,
        "access_token": access_token,
        "token_type": "bearer"
    }

# LOGIN

@router.post(
    "/login",
    response_model=TokenResponds
)
def login(
    user: LoginRequest,
    db: Session = Depends(get_db)
):

    logging.info("Login verification has started")

    # 1. Find user by email
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # 2. Verify password
    password_valid = verify_password(
        user.password,
        existing_user.password_hash
    )

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # 3. Create JWT
    access_token = create_access_token(
        existing_user.user_id
    )

    logging.info(
        f"Login completed by user id {existing_user.user_id}"
    )

    # 4. Return JWT
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    try:

        request_password_reset(
            db=db,
            email=request.email
        )

        return {
            "message": (
                "If the email is registered, "
                "a verification code has been sent."
            )
        }

    except Exception as e:

        logging.error(
            f"Forgot password error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process password reset request"
        )


@router.post("/verify-otp")
def verify_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db)
):

    is_valid = verify_password_reset_otp(
        db=db,
        email=request.email,
        otp=request.otp
    )

    if not is_valid:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code"
        )

    return {
        "message": "Verification code is valid"
    }


@router.post("/reset-password")
def reset_password_endpoint(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    # Check whether passwords match
    if request.new_password != request.confirm_password:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    try:

        reset_password(
            db=db,
            email=request.email,
            otp=request.otp,
            new_password=request.new_password
        )

        return {
            "message": "Password reset successfully"
        }

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:

        logging.error(
            f"Password reset error: {e}"
        )

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset password"
        )


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "user_id": current_user.user_id,
        "user_name": current_user.user_name,
        "email": current_user.email,
        "user_type": current_user.user_type,
    }