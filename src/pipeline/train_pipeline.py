import os
import pickle
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

from tensorflow.keras.models import Model
from tensorflow.keras.layers import (Input,Embedding,Flatten,Dense,Concatenate,Dropout)
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping

from src.database.connection import SessionLocal
from src.database.models import Rating

from src.logger import logging


# ARTIFACT PATHS

ARTIFACT_DIR = "artifacts"

os.makedirs(ARTIFACT_DIR, exist_ok=True)

MODEL_PATH = os.path.join(
    ARTIFACT_DIR,
    "movie_recommendation_model.keras"
)

USER_ENCODER_PATH = os.path.join(
    ARTIFACT_DIR,
    "user_encoder.pkl"
)

MOVIE_ENCODER_PATH = os.path.join(
    ARTIFACT_DIR,
    "movie_encoder.pkl"
)


# LOAD RATINGS FROM MYSQL

def load_training_data():

    db = SessionLocal()

    try:

        ratings = db.query(Rating).all()

        if not ratings:
            raise ValueError(
                "No ratings found in database. "
                "Cannot train the recommendation model."
            )

        data = [
            {
                "user_id": rating.user_id,
                "movie_id": rating.movie_id,
                "ratings": float(rating.ratings)
            }
            for rating in ratings
        ]

        return pd.DataFrame(data)

    finally:

        db.close()


# BUILD ANN MODEL

def build_model(num_users, num_movies):


    # INPUTS

    user_input = Input(
        shape=(1,),
        name="user_input"
    )

    movie_input = Input(
        shape=(1,),
        name="movie_input"
    )



    # USER EMBEDDING


    user_emb = Embedding(
        input_dim=num_users,
        output_dim=32,
        embeddings_regularizer=l2(1e-3),
        name="user_embedding"
    )(user_input)



    # MOVIE EMBEDDING

    movie_emb = Embedding(
        input_dim=num_movies,
        output_dim=32,
        embeddings_regularizer=l2(1e-3),
        name="movie_embedding"
    )(movie_input)



    # FLATTEN


    user_emb = Flatten()(user_emb)

    movie_emb = Flatten()(movie_emb)



    # CONCATENATE

    concat_result = Concatenate()(
        [user_emb, movie_emb]
    )


    # HIDDEN LAYERS

    hidden1 = Dense(
        128,
        activation="relu",
        kernel_regularizer=l2(1e-5)
    )(concat_result)

    hidden1 = Dropout(0.4)(hidden1)


    hidden2 = Dense(
        64,
        activation="relu",
        kernel_regularizer=l2(1e-5)
    )(hidden1)

    hidden2 = Dropout(0.4)(hidden2)


    hidden3 = Dense(
        32,
        activation="relu",
        kernel_regularizer=l2(1e-5)
    )(hidden2)

    hidden3 = Dropout(0.4)(hidden3)


    hidden4 = Dense(
        8,
        activation="relu",
        kernel_regularizer=l2(1e-5)
    )(hidden3)

    hidden4 = Dropout(0.4)(hidden4)

    # OUTPUT

    output = Dense(
        1,
        name="rating_output"
    )(hidden4)


    # MODEL

    model = Model(
        inputs=[user_input, movie_input],
        outputs=output
    )


    # COMPILE

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=0.0005
        ),
        loss=tf.keras.losses.Huber(),
        metrics=["mae"]
    )

    return model


# TRAIN 

def train_model():

    logging.info("Starting ANN training...")


    # 1. LOAD DATA FROM MYSQL

    df = load_training_data()

    logging.info(
        f"Training records loaded: {len(df)}"
    )


    user_encoder = LabelEncoder()
    movie_encoder = LabelEncoder()


    user_encoder.fit(df["user_id"])
    movie_encoder.fit(df["movie_id"])


    # 3. ENCODE USER AND MOVIE IDs


    df["user_encoded"] = user_encoder.transform(
        df["user_id"]
    )

    df["movie_encoded"] = movie_encoder.transform(
        df["movie_id"]
    )


    # 4. GET DYNAMIC SIZES


    num_users = len(
        user_encoder.classes_
    )

    num_movies = len(
        movie_encoder.classes_
    )


    logging.info(
        f"Number of users: {num_users}"
    )

    logging.info(
        f"Number of movies: {num_movies}"
    )


    # 5. CREATE X AND Y

    X_user = df["user_encoded"].values

    X_movie = df["movie_encoded"].values

    y = df["ratings"].values.astype(np.float32)

    # 6. TRAIN / TEST SPLIT

    (x_user_train,x_user_test,x_movie_train,x_movie_test,y_train,y_test) = train_test_split(X_user,X_movie,y,test_size=0.2,random_state=42)


    x_user_train = x_user_train.reshape(-1, 1)

    x_movie_train = x_movie_train.reshape(-1, 1)

    x_user_test = x_user_test.reshape(-1, 1)

    x_movie_test = x_movie_test.reshape(-1, 1)


    model = build_model(
        num_users=num_users,
        num_movies=num_movies
    )

    callback = EarlyStopping(
        monitor="val_loss",
        patience=3,
        mode="min",
        restore_best_weights=True
    )


    model.fit(
        [x_user_train, x_movie_train],
        y_train,
        epochs=30,
        batch_size= 256,
        validation_data=(
            [x_user_test, x_movie_test],
            y_test
        ),
        callbacks= callback,
        verbose=1
    )

    model.save(MODEL_PATH)

    with open(USER_ENCODER_PATH,"wb") as file:
        pickle.dump(user_encoder,file)

    with open(MOVIE_ENCODER_PATH,"wb") as file:
        pickle.dump(movie_encoder,file)


    logging.info(
        "ANN model and encoders saved successfully."
    )

    return {
        "users": num_users,
        "movies": num_movies,
        "ratings": len(df)
    }