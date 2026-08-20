from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Enum
)

from sqlalchemy.orm import relationship

from .connection import Base


class User(Base):

    __tablename__ = "users"

    user_id = Column(
        Integer,
        primary_key=True,
        index=True
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


class Movie(Base):

    __tablename__ = "movies"

    movie_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(100),
        nullable=False
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

    ratings_id = Column(
        Integer,
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
        Float,
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