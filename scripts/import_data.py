import os 
import sys
import pandas as pd 
from dotenv import load_dotenv
import mysql.connector

from src.logger import logging 

from src.exception import CustomException

## load env variables 

load_dotenv(".env")

## connecting to database 

connection = mysql.connector.connect(
    host = os.getenv("MYSQL_HOST"),
    user = os.getenv("MYSQL_USER"),
    password = os.getenv("MYSQL_PASSWORD"),
    database = os.getenv("MYSQL_DATABASE")
)

cursor = connection.cursor()  ## here the cursor is used to retrive the data from query

print("connected to mysql")


## importing the datasets 

movie_data = pd.read_csv("data/movie_data.csv")
ratings_data = pd.read_csv("data/user_data.csv")

print("movie shape : ", movie_data.shape)
print("ratings_shape : " , ratings_data.shape)


## validation of the data 

try:
    if not {"movie_id" , "title"}.issubset(movie_data.columns):
        raise ValueError("movie_id and title is not in columns of movie_data file" , sys)
    if not {"user_id" , "movie_id" , "rating"}.issubset(ratings_data.columns): 
        raise ValueError("the subset columns do not contain in the file columns" , sys)

except Exception as e:
    raise CustomException(str(e) , sys)


## inserting data into the tables 

movie_query = """
INSERT INTO movies(movie_id , title)
VALUES (%s,%s)
ON DUPLICATE KEY UPDATE
title = values(title)
"""

movie_data = [(int(row.movie_id) , str(row.title)) for row in movie_data.itertuples(index = False)]

cursor.executemany(movie_query , movie_data)

logging.info("inserted user_data into user tables")

print(f"movie data imported length : {len(movie_data)}")


## historical data insertion 
unique_users = ratings_data["user_id"].drop_duplicates()

user_query = """
INSERT INTO users(user_id , user_type)
VALUES (%s , 'historical')
ON DUPLICATE KEY UPDATE 
user_id = user_id
"""

user_data = [(int(user_id),) for user_id in unique_users]

cursor.executemany(user_query , user_data)

logging.info("inserted user_data into user tables")

print(f"user data imported length : {len(user_data)}")


### inserting the ratings table

ratings_query = """
INSERT INTO ratings(user_id , movie_id , rating)
VALUES (%s ,%s,%s)
ON DUPLICATE KEY UPDATE 
rating = VALUES(rating)
"""  ### on duplicated exist by same user_id and movie_id we have to update the ratings with current ratings 

ratings_data = [(int(row.user_id) , int(row.movie_id) , float(row.rating)) for row in ratings_data.itertuples(index = False)]

cursor.executemany(ratings_query , ratings_data)

logging.info("inserted the data into ratings tables")

print("ratings imported length : " , len(ratings_data))

## save the commits

connection.commit()
print("data is successfully inserted")


## close the connections and query functions 

cursor.close()
connection.close()

print("my sql is closed")
