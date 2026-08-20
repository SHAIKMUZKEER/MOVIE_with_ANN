import numpy as np 
import pandas as pd 
from src.logger import logging 
from src.exception import CustomException
import sys

class data_configure:
    def __init__(self):
        self.train_data = pd.read_csv("artifacts/train.csv")
        self.test_data = pd.read_csv("artifacts/test.csv")

class data_transformation(data_configure): 

    def initialize_transformation(self): 
        logging.info("entered into data transformation function")

        try:
            train_data = self.train_data
            test_data = self.test_data 
            train_data = train_data.drop(columns = ["title" ,"timestamp"])
            test_data = test_data.drop(columns = ["title" ,"timestamp"])

            user_encoded_train = train_data["user_encoded"].values
            movie_encoded_train = train_data["movie_encoded"].values
            y_train = train_data["rating"].values

            user_encoded_test = test_data["user_encoded"].values
            movie_encoded_test = test_data["movie_encoded"].values
            y_test = test_data["rating"].values

            training_list = [user_encoded_train, movie_encoded_train , y_train]

            testing_list = [user_encoded_test , movie_encoded_test , y_test]
            logging.info("out from data_transform file")
            return training_list , testing_list
        except Exception as e:
            print(CustomException(e , sys))

