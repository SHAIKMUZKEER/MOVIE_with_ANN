from sqlalchemy.orm import Session

from src.pipeline.train_pipeline import train_model
from src.database.models import Movie, Rating
from src.schemas import RatingCreate
from src.exception import CustomException

import sys

# CREATE SINGLE RATING

def create_rating(
    db: Session,
    user_id: int,
    title: str,
    ratings: float
):

    try:
        # 1. CLEAN MOVIE TITLE

        title = title.strip()

        if not title:
            raise ValueError("Movie title cannot be empty")

        # 2. SEARCH MOVIE BY TITLE

        movie = (
            db.query(Movie)
            .filter(Movie.title == title)
            .first()
        )
        # 3. CREATE MOVIE IF IT DOES NOT EXIST

        if movie is None:

            movie = Movie(
                title=title
            )

            db.add(movie)

            # MySQL generates movie_id
            db.flush()

        # 4. CHECK EXISTING RATING

        existing_rating = (
            db.query(Rating)
            .filter(
                Rating.user_id == user_id,
                Rating.movie_id == movie.movie_id
            )
            .first()
        )

        if existing_rating:

            raise ValueError(
                "User has already rated this movie"
            )

        # 5. CREATE RATING

        new_rating = Rating(
            user_id=user_id,
            movie_id=movie.movie_id,
            ratings=ratings
        )

        db.add(new_rating)

        # 6. SAVE TO MYSQL

        db.commit()

        db.refresh(new_rating)

        return new_rating

    except ValueError:
        db.rollback()
        raise

    except Exception as e:

        db.rollback()

        print(
            "🔥 SINGLE RATING ERROR:",
            repr(e)
        )

        raise CustomException(e, sys)

# CREATE MULTIPLE MOVIE RATINGS

def create_bulk_ratings(
    ratings: list[RatingCreate],
    user_id: int,
    db: Session
):

    created = []
    skipped = []

    try:

        # PROCESS EVERY MOVIE RATING

        for item in ratings:

            # 1. CLEAN TITLE

            title = item.title.strip()

            if not title:

                skipped.append({
                    "title": item.title,
                    "reason": "Movie title cannot be empty"
                })

                continue
            # 2. SEARCH MOVIE BY TITLE

            movie = (
                db.query(Movie)
                .filter(Movie.title == title)
                .first()
            )

            # 3. MOVIE DOES NOT EXIST


            if movie is None:

                movie = Movie(
                    title=title
                )

                db.add(movie)

                # MySQL generates movie_id
                db.flush()

            # 4. CHECK WHETHER USER ALREADY RATED MOVIE

            existing_rating = (
                db.query(Rating)
                .filter(
                    Rating.user_id == user_id,
                    Rating.movie_id == movie.movie_id
                )
                .first()
            )

            # 5. UPDATE EXISTING RATING

            if existing_rating:

                existing_rating.ratings = item.ratings

                created.append({
                    "movie_id": movie.movie_id,
                    "title": movie.title,
                    "ratings": item.ratings,
                    "action": "updated"
                })

            # 6. CREATE NEW RATING

            else:

                new_rating = Rating(
                    user_id=user_id,
                    movie_id=movie.movie_id,
                    ratings=item.ratings
                )

                db.add(new_rating)

                created.append({
                    "movie_id": movie.movie_id,
                    "title": movie.title,
                    "ratings": item.ratings,
                    "action": "created"
                })

        # 7. SAVE ALL RATINGS TO MYSQL

        db.commit()

        print("✅ Ratings successfully stored in MySQL")


        # 8. RETRAIN ANN MODEL

        print("🔄 Starting ANN model retraining...")

        training_result = train_model()

        print("✅ ANN model retraining completed")


        # 9. RETURN RESULT

        return {
            "created": created,
            "skipped": skipped,
            "training": training_result
        }

    except Exception as e:

        # ROLLBACK DATABASE TRANSACTION

        db.rollback()

        print(
            "🔥 BULK RATING ERROR:",
            repr(e)
        )

        print(
            CustomException(e, sys)
        )

        raise