from sqlalchemy.orm import Session

from src.database.models import Movie, Rating


# CREATE SINGLE RATING

def create_rating(
    db: Session,
    user_id: int,
    title: str,
    ratings: float
):

    # --------------------------------------------------------
    # 1. Clean movie title
    # --------------------------------------------------------

    title = title.strip()

    if not title:
        raise ValueError("Movie title cannot be empty")

    # --------------------------------------------------------
    # 2. Search movie by title
    # --------------------------------------------------------

    movie = (
        db.query(Movie)
        .filter(Movie.title == title)
        .first()
    )

    # --------------------------------------------------------
    # 3. Movie doesn't exist
    # --------------------------------------------------------

    if movie is None:

        movie = Movie(
            title=title
        )

        db.add(movie)

        # MySQL generates movie_id
        db.flush()

    # --------------------------------------------------------
    # 4. Check whether user already rated this movie
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # 5. Create rating
    # --------------------------------------------------------

    new_rating = Rating(
        user_id=user_id,
        movie_id=movie.movie_id,
        ratings=ratings
    )

    db.add(new_rating)

    # --------------------------------------------------------
    # 6. Save to database
    # --------------------------------------------------------

    db.commit()

    db.refresh(new_rating)

    return new_rating


# PHASE 6
# CREATE MULTIPLE RATINGS

def create_bulk_ratings(
    db: Session,
    user_id: int,
    ratings_data
):

    created_ratings = []

    skipped_ratings = []

    try:

        for item in ratings_data:

            # 1. Get title and rating

            title = item.title.strip()

            rating_value = item.ratings

            if not title:
                continue

            # 2. Find movie

            movie = (
                db.query(Movie)
                .filter(
                    Movie.title == title
                )
                .first()
            )

            # ------------------------------------------------
            # 3. Create movie if it doesn't exist
            # ------------------------------------------------

            if movie is None:

                movie = Movie(
                    title=title
                )

                db.add(movie)

                # MySQL generates movie_id
                db.flush()

            # ------------------------------------------------
            # 4. Check duplicate rating
            # ------------------------------------------------

            existing_rating = (
                db.query(Rating)
                .filter(
                    Rating.user_id == user_id,
                    Rating.movie_id == movie.movie_id
                )
                .first()
            )

            if existing_rating:

                skipped_ratings.append(
                    {
                        "movie_id": movie.movie_id,
                        "title": movie.title,
                        "reason": "Already rated"
                    }
                )

                continue

            # ------------------------------------------------
            # 5. Create rating
            # ------------------------------------------------

            new_rating = Rating(
                user_id=user_id,
                movie_id=movie.movie_id,
                ratings=rating_value
            )

            db.add(new_rating)

            created_ratings.append(
                {
                    "movie_id": movie.movie_id,
                    "title": movie.title,
                    "ratings": float(rating_value)
                }
            )

        # ----------------------------------------------------
        # 6. Save all ratings
        # ----------------------------------------------------

        db.commit()

        return {
            "created": created_ratings,
            "skipped": skipped_ratings
        }

    except Exception:

        db.rollback()

        raise ValueError("Failed to create bulk ratings")