from sqlalchemy.orm import Session

from src.database.models import Rating, Movie

## this file is mainly used to get the watched and unwatched movies from the database by using the simple queries. 
def get_watched_movie_ids(
    db: Session,
    user_id: int
) -> set[int]:

    ratings = (
        db.query(Rating.movie_id)
        .filter(
            Rating.user_id == user_id
        )
        .all()
    )

    return {
        movie_id
        for (movie_id,) in ratings
    }

def get_unwatched_movies(
    db: Session,
    watched_movie_ids: set[int]
):

    query = db.query(Movie)

    if watched_movie_ids:

        query = query.filter(
            ~Movie.movie_id.in_(watched_movie_ids)
        )

    return query.all()