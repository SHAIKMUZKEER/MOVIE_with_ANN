import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta, timezone
from src.logger import logging
from src.exception import CustomException
from src.database.models import User
from sqlalchemy.orm import Session
from src.database.connection import get_db
import jwt
import sys
from dotenv import load_dotenv
from pwdlib import PasswordHash

logging.info("enters into the auth_service file for jwt and password hashing")

# Load environment variables from .env
load_dotenv()


# Password Hashing


password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """
    Hash a plain-text password.
    """

    return password_hash.hash(password)


def verify_password(plain_password: str,hashed_password: str) -> bool:
    """
    Verify a plain-text password against
    the stored password hash.
    """

    return password_hash.verify(
        plain_password,
        hashed_password
    )

# JWT Configuration


SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "30"
    )
)

# Create JWT Access Token


def create_access_token(user_id: int,expires_delta: timedelta | None = None) -> str:
    try:
        if SECRET_KEY is None:
                raise RuntimeError(
                    "SECRET_KEY is not configured in .env"
                )
    except RuntimeError as e: 
         print(CustomException(e , sys))

    if expires_delta is None:
        expires_delta = timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    expire = datetime.now(
        timezone.utc
    ) + expires_delta

    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# Decode JWT Access Token


def decode_access_token(token: str) -> dict:

    try: 
        if SECRET_KEY is None:
                raise RuntimeError(
                    "SECRET_KEY is not configured in .env"
                )
    except RuntimeError as e: 
        print(CustomException(e , sys))

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    return payload


## get the current user if he get authorized 

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    try:

        payload = decode_access_token(token)

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )

        user_id = int(user_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user = (
        db.query(User)
        .filter(User.user_id == user_id)
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user