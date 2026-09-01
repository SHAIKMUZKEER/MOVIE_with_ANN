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

#LOGIN SCHEMAS 

# login verificationn

class LoginRequest(BaseModel): 
    email : EmailStr 
    password : str

class TokenResponds(BaseModel): 
    access_token: str
    token_type: str

class SignupResponse(BaseModel):

    user_id: int
    user_name: str
    email: EmailStr
    user_type: UserType

    access_token: str
    token_type: str


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
    title : str = Field(..., max_length=100)
    ratings: float = Field(..., ge=0.0, le=5.0)


class RatingResponse(BaseModel):
    ratings_id: int  
    user_id: int
    movie_id: int
    title: str
    ratings: float   

    class Config:
        from_attributes = True


# PHASE 6 — BULK RATING SCHEMAS

class RatingItem(BaseModel):

    title: str = Field(
        ...,
        max_length=100
    )

    ratings: float = Field(
        ...,
        ge=0.0,
        le=5.0
    )


class BulkRatingCreate(BaseModel):

    ratings: list[RatingItem]


# RECOMMENDATION SCHEMAS

class RecommendationItem(BaseModel):
    title: str
    predicted_rating: float


class RecommendationResponse(BaseModel):
    user_id: int
    recommendations: list[RecommendationItem]