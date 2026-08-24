// =====================================================
// MOVIE APPLICATION
// =====================================================


// =====================================================
// GLOBAL STATE
// =====================================================

let selectedMovie = null;

let selectedRating = 0;

let newMovieRating = 0;


// =====================================================
// DOM ELEMENTS
// =====================================================

const movieSearch =
    document.getElementById("movieSearch");

const movieGrid =
    document.getElementById("movieGrid");

const resultCount =
    document.getElementById("resultCount");

const notFoundPanel =
    document.getElementById("notFoundPanel");

const newMovieTitle =
    document.getElementById("newMovieTitle");

const addMovieBtn =
    document.getElementById("addMovieBtn");

const ratingModal =
    document.getElementById("ratingModal");

const selectedMovieTitle =
    document.getElementById("selectedMovieTitle");

const submitRatingBtn =
    document.getElementById("submitRatingBtn");

const closeModal =
    document.getElementById("closeModal");

const logoutBtn =
    document.getElementById("logoutBtn");

const userStatus =
    document.getElementById("userStatus");

const clearSearch =
    document.getElementById("clearSearch");

const toast =
    document.getElementById("toast");


// =====================================================
// AUTHENTICATION
// =====================================================

function getToken() {

    return localStorage.getItem(
        "access_token"
    );
}


function isLoggedIn() {

    return Boolean(
        getToken()
    );
}


// =====================================================
// USER STATUS
// =====================================================

function updateUserStatus() {

    if (isLoggedIn()) {

        userStatus.textContent =
            "Logged in";

        logoutBtn.style.display =
            "block";

    } else {

        userStatus.textContent =
            "Guest";

        logoutBtn.style.display =
            "none";
    }
}


updateUserStatus();


// =====================================================
// LOGOUT
// =====================================================

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "access_token"
        );

        window.location.href =
            "/login";
    }
);


// =====================================================
// LOAD MOVIES
// =====================================================

async function loadMovies(
    search = ""
) {

    try {

        movieGrid.innerHTML = `
            <div class="loading">
                Loading movies...
            </div>
        `;

        const params =
            new URLSearchParams();

        params.set(
            "limit",
            "20"
        );

        params.set(
            "offset",
            "0"
        );


        if (search.trim()) {

            params.set(
                "search",
                search.trim()
            );
        }


        const response =
            await fetch(
                `/movies/?${params.toString()}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch movies"
            );
        }


        const movies =
            await response.json();


        renderMovies(
            movies
        );


    } catch (error) {

        console.error(error);

        movieGrid.innerHTML = `
            <p>
                Unable to load movies.
                Please try again.
            </p>
        `;

        showToast(
            "Unable to load movies"
        );
    }
}


// =====================================================
// RENDER MOVIES
// =====================================================

function renderMovies(
    movies
) {

    movieGrid.innerHTML = "";

    resultCount.textContent =
        `${movies.length} movies`;


    if (
        movies.length === 0
    ) {

        notFoundPanel.classList.remove(
            "hidden"
        );

        return;
    }


    notFoundPanel.classList.add(
        "hidden"
    );


    movies.forEach(
        function (movie, index) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "movie-card";


            card.innerHTML = `

                <div class="movie-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div class="movie-icon">
                    🎬
                </div>

                <div class="movie-title">
                    ${escapeHtml(movie.title)}
                </div>

                <button
                    class="rate-movie-btn"
                    data-id="${movie.movie_id}"
                    data-title="${escapeHtml(movie.title)}"
                >
                    Rate this movie
                </button>
            `;


            movieGrid.appendChild(
                card
            );
        }
    );


    document
        .querySelectorAll(
            ".rate-movie-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const movie = {

                            movie_id:
                                button.dataset.id,

                            title:
                                button.dataset.title
                        };


                        openRatingModal(
                            movie
                        );
                    }
                );
            }
        );
}


// =====================================================
// SEARCH
// =====================================================

let searchTimer;


movieSearch.addEventListener(
    "input",
    function () {

        clearTimeout(
            searchTimer
        );


        const value =
            movieSearch.value;


        searchTimer =
            setTimeout(
                function () {

                    loadMovies(
                        value
                    );

                },
                350
            );
    }
);


// =====================================================
// CLEAR SEARCH
// =====================================================

clearSearch.addEventListener(
    "click",
    function () {

        movieSearch.value = "";

        notFoundPanel.classList.add(
            "hidden"
        );

        loadMovies();
    }
);


// =====================================================
// OPEN RATING MODAL
// =====================================================

function openRatingModal(
    movie
) {

    if (!isLoggedIn()) {

        showToast(
            "Please login before rating a movie"
        );

        setTimeout(
            function () {

                window.location.href =
                    "/login";

            },
            1000
        );

        return;
    }


    selectedMovie =
        movie;

    selectedRating =
        0;


    selectedMovieTitle.textContent =
        movie.title;


    resetStars(
        "existingMovieStars"
    );


    document.getElementById(
        "existingRatingValue"
    ).textContent =
        "Select a rating";


    ratingModal.classList.remove(
        "hidden"
    );
}


// =====================================================
// CLOSE MODAL
// =====================================================

closeModal.addEventListener(
    "click",
    function () {

        ratingModal.classList.add(
            "hidden"
        );
    }
);


ratingModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            ratingModal
        ) {

            ratingModal.classList.add(
                "hidden"
            );
        }
    }
);


// =====================================================
// EXISTING MOVIE STAR RATING
// =====================================================

document
    .querySelectorAll(
        "#existingMovieStars button"
    )
    .forEach(
        function (star) {

            star.addEventListener(
                "click",
                function () {

                    selectedRating =
                        Number(
                            star.dataset.rating
                        );


                    updateStars(
                        "existingMovieStars",
                        selectedRating
                    );


                    document.getElementById(
                        "existingRatingValue"
                    ).textContent =
                        `${selectedRating}.0 / 5.0`;
                }
            );
        }
    );


// =====================================================
// SUBMIT EXISTING MOVIE RATING
// =====================================================

submitRatingBtn.addEventListener(
    "click",
    async function () {

        if (
            selectedRating === 0
        ) {

            showToast(
                "Please select a rating"
            );

            return;
        }


        if (
            !selectedMovie
        ) {

            return;
        }


        await submitRating(
            selectedMovie.title,
            selectedRating
        );
    }
);


// =====================================================
// NEW MOVIE STAR RATING
// =====================================================

document
    .querySelectorAll(
        "#newMovieStars button"
    )
    .forEach(
        function (star) {

            star.addEventListener(
                "click",
                function () {

                    newMovieRating =
                        Number(
                            star.dataset.rating
                        );


                    updateStars(
                        "newMovieStars",
                        newMovieRating
                    );


                    document.getElementById(
                        "newMovieRatingValue"
                    ).textContent =
                        `${newMovieRating}.0 / 5.0`;
                }
            );
        }
    );


// =====================================================
// ADD NEW MOVIE + RATE
// =====================================================

addMovieBtn.addEventListener(
    "click",
    async function () {

        if (!isLoggedIn()) {

            showToast(
                "Please login first"
            );

            setTimeout(
                function () {

                    window.location.href =
                        "/login";

                },
                1000
            );

            return;
        }


        const title =
            newMovieTitle.value.trim();


        if (!title) {

            showToast(
                "Enter a movie title"
            );

            return;
        }


        if (
            newMovieRating === 0
        ) {

            showToast(
                "Select a rating"
            );

            return;
        }


        await submitRating(
            title,
            newMovieRating
        );
    }
);


// =====================================================
// SUBMIT RATING TO BACKEND
// =====================================================

async function submitRating(
    title,
    rating
) {

    const token =
        getToken();


    if (!token) {

        window.location.href =
            "/login";

        return;
    }


    try {

        const response =
            await fetch(
                "/ratings/",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({

                            title: title,

                            ratings: rating
                        })
                }
            );


        const data =
            await response.json();


        // -----------------------------------------
        // Authentication failed
        // -----------------------------------------

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "access_token"
            );

            showToast(
                "Session expired. Please login again."
            );

            setTimeout(
                function () {

                    window.location.href =
                        "/login";

                },
                1200
            );

            return;
        }


        // -----------------------------------------
        // Other error
        // -----------------------------------------

        if (
            !response.ok
        ) {

            showToast(
                data.detail ||
                "Unable to submit rating"
            );

            return;
        }


        // -----------------------------------------
        // SUCCESS
        // -----------------------------------------

        showToast(
            `Rating saved for ${data.title}`
        );


        ratingModal.classList.add(
            "hidden"
        );


        newMovieTitle.value =
            "";


        newMovieRating =
            0;


        resetStars(
            "newMovieStars"
        );


        notFoundPanel.classList.add(
            "hidden"
        );


        movieSearch.value =
            data.title;


        await loadMovies(
            data.title
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Server error. Please try again."
        );
    }
}


// =====================================================
// STAR HELPERS
// =====================================================

function updateStars(
    containerId,
    rating
) {

    const stars =
        document.querySelectorAll(
            `#${containerId} button`
        );


    stars.forEach(
        function (star) {

            const value =
                Number(
                    star.dataset.rating
                );


            if (
                value <= rating
            ) {

                star.classList.add(
                    "selected"
                );

            } else {

                star.classList.remove(
                    "selected"
                );
            }
        }
    );
}


function resetStars(
    containerId
) {

    const stars =
        document.querySelectorAll(
            `#${containerId} button`
        );


    stars.forEach(
        function (star) {

            star.classList.remove(
                "selected"
            );
        }
    );
}


// =====================================================
// TOAST
// =====================================================

function showToast(
    message
) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;
}


// =====================================================
// INITIAL LOAD
// =====================================================

loadMovies();