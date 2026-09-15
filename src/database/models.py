from datetime import datetime
from src.logger import logging
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    ForeignKey,
    Enum,
    Boolean,
    UniqueConstraint
)

from sqlalchemy.orm import relationship

from .connection import Base

logging.info("enters into models file")

class User(Base):

    __tablename__ = "users"

    user_id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    user_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(60),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String(200),
        nullable=False
    )

    user_type = Column(
        Enum("historical", "website"),
        nullable=False,
        default="website"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    ratings = relationship(
        "Rating",
        back_populates="user"
    )

    password_reset_tokens = relationship(
        "PasswordReset",
        back_populates="user",
        cascade="all, delete-orphan"
    )   

class Movie(Base):

    __tablename__ = "movies"

    movie_id = Column(
        Integer,
        primary_key=True,
        index=True, 
        autoincrement=True
    )

    title = Column(
        String(100),
        nullable=False,
        index=True 
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    ratings = relationship(
        "Rating",
        back_populates="movie"
    )


class Rating(Base):

    __tablename__ = "ratings"
    
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "movie_id",
            name="uq_user_movie_rating"
        ),
    )

    ratings_id = Column(
        Integer,
        autoincrement=True,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    movie_id = Column(
        Integer,
        ForeignKey("movies.movie_id"),
        nullable=False
    )

    ratings = Column(
        Numeric(2,1),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="ratings"
    )

    movie = relationship(
        "Movie",
        back_populates="ratings"
    )

class PasswordReset(Base):

    __tablename__ = "password_reset_tokens"

    reset_id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.user_id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    otp_hash = Column(
        String(64),
        nullable=False
    )

    expires_at = Column(
        DateTime,
        nullable=False
    )

    is_used = Column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="password_reset_tokens"
    )