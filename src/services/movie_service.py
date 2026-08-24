from sqlalchemy.orm import Session

from src.database.models import Movie


def get_movies(
    db: Session,
    search: str | None = None,
    limit: int = 20,
    offset: int = 0
):

    query = db.query(Movie)

    # -----------------------------------------
    # Search movies if search text is provided
    # -----------------------------------------

    if search:

        search = search.strip()

        if search:

            query = query.filter(
                Movie.title.ilike(f"%{search}%")
            )

    # -----------------------------------------
    # Sort movies alphabetically
    # -----------------------------------------

    query = query.order_by(
        Movie.title.asc()
    )

    # -----------------------------------------
    # Pagination
    # -----------------------------------------

    movies = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return movies