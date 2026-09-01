import os
import pickle
import numpy as np
import tensorflow as tf


# ARTIFACT PATHS

ARTIFACT_DIR = "artifacts"

MODEL_PATH = os.path.join(ARTIFACT_DIR,"movie_recommendation_model.keras")

USER_ENCODER_PATH = os.path.join(ARTIFACT_DIR,"user_encoder.pkl")

MOVIE_ENCODER_PATH = os.path.join(ARTIFACT_DIR,"movie_encoder.pkl")

# LOAD LATEST ARTIFACTS

def load_artifacts():

    if not os.path.exists(MODEL_PATH):

        raise FileNotFoundError(
            "ANN model not found. "
            "Train the model first."
        )

    if not os.path.exists(USER_ENCODER_PATH):

        raise FileNotFoundError(
            "User encoder not found. "
            "Train the model first."
        )

    if not os.path.exists(MOVIE_ENCODER_PATH):

        raise FileNotFoundError(
            "Movie encoder not found. "
            "Train the model first."
        )


    model = tf.keras.models.load_model(
        MODEL_PATH
    )


    with open(USER_ENCODER_PATH,"rb") as file:
        user_encoder = pickle.load(file)


    with open(MOVIE_ENCODER_PATH,"rb") as file:
        movie_encoder = pickle.load(file)


    return (
        model,
        user_encoder,
        movie_encoder
    )

# PREDICT RATINGS


def predict_ratings(
    user_id,
    movie_ids
):

    # LOAD THE LATEST MODEL

    (model,user_encoder,movie_encoder) = load_artifacts()

    # CHECK USER

    if user_id not in user_encoder.classes_:

        raise ValueError(
            f"User ID {user_id} not found in "
            f"user encoder."
        )

    # CHECK MOVIES

    unknown_movies = [
        movie_id
        for movie_id in movie_ids
        if movie_id not in movie_encoder.classes_
    ]

    if unknown_movies:

        raise ValueError(
            f"Movie IDs {unknown_movies} "
            f"not found in movie encoder."
        )

    # ENCODE USER

    encoded_user = user_encoder.transform(
        [user_id]
    )[0]

    # ENCODE MOVIES

    encoded_movies = movie_encoder.transform(
        movie_ids
    )

    user_array = np.array(
        [encoded_user] * len(encoded_movies),
        dtype=np.int32
    )

    movie_array = np.array(
        encoded_movies,
        dtype=np.int32
    )

    predictions = model.predict(
        [
            user_array,
            movie_array
        ],
        verbose=0
    )

    predictions = predictions.flatten().tolist()
    
    return predictions