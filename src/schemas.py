from enum import Enum
from pydantic import BaseModel, EmailStr, Field
from src.logger import logging


# ENUMS

logging.info("entered into schemas(which type of data enter through API endpoint) file")

class UserType(str, Enum):
    HISTORICAL = "historical"
    WEBSITE = "website"



# USER SCHEMAS


class UserCreate(BaseModel):
    user_name: str = Field(..., max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    user_id: int
    user_name: str
    email: EmailStr
    user_type: UserType

    class Config:
        from_attributes = True


# MOVIE SCHEMAS


class MovieCreate(BaseModel):
    title: str = Field(..., max_length=100)


class MovieResponse(BaseModel):
    movie_id: int
    title: str

    class Config:
        from_attributes = True


# RATING SCHEMAS


class RatingCreate(BaseModel):
    user_id: int
    movie_id: int
    ratings: float = Field(..., ge=0.0, le=5.0)


class RatingResponse(BaseModel):
    ratings_id: int  
    user_id: int
    movie_id: int
    ratings: float   

    class Config:
        from_attributes = True