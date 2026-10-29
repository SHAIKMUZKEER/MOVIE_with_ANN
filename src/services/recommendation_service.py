from sqlalchemy.orm import Session

from src.database.models import Rating, Movie
from src.pipeline.predict_pipeline import predict_ratings


# GET MOVIES ALREADY RATED BY USER

def get_watched_movie_ids(
    db: Session,
    user_id: int
):

    ratings = (
        db.query(Rating.movie_id)
        .filter(
            Rating.user_id == user_id
        )
        .all()
    )

    return {
        movie_id
        for movie_id, in ratings
    }


# GET RECOMMENDATIONS

def get_recommendations(
    db: Session,
    user_id: int
):

    # 1. FIND MOVIES RATED BY USER

    watched_movie_ids = get_watched_movie_ids(
        db=db,
        user_id=user_id
    )


    # 2. NEW USER CHECK

    if not watched_movie_ids:

        raise ValueError(
            "You have not rated any movies yet. "
            "Please rate some movies first."
        )


    # 3. FIND MOVIES NOT YET RATED BY USER

    candidate_movies = (
        db.query(Movie)
        .filter(
            ~Movie.movie_id.in_(
                watched_movie_ids
            )
        )
        .all()
    )


    # 4. CHECK WHETHER UNWATCHED MOVIES EXIST

    if not candidate_movies:

        return []


    # 5. EXTRACT MOVIE IDs

    candidate_movie_ids = [
        movie.movie_id
        for movie in candidate_movies
    ]

    # 6. SEND USER + MOVIES TO ANN

    predictions = predict_ratings(
        user_id=user_id,
        movie_ids=candidate_movie_ids
    )


    # 7. CREATE RECOMMENDATION RESULT

    recommendations = []

    for movie, predicted_rating in zip(
        candidate_movies,
        predictions
    ):

        recommendations.append(
            {
                "title": movie.title,
                "predicted_rating": round(
                    float(predicted_rating),
                    2
                )
            }
        )


    # 8. SORT BY PREDICTED RATING

    recommendations.sort(
        key=lambda x: x["predicted_rating"],
        reverse=True
    )

    # 9. RETURN TOP 3

    return recommendations[:3]