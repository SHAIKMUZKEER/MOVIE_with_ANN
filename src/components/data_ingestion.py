import os
import sys
import numpy as np 
import pandas as pd 

from sklearn.model_selection import train_test_split

from src.exception import CustomException

from src.logger import logging

from src.utils import save_object

class data_configure():
    def __init__(self): 
        self.train_data_path = os.path.join('artifacts' , 'train.csv')
        self.test_data_path = os.path.join('artifacts' , 'test.csv')
        
class data_initialize(data_configure): 

    def data_initial(self):
        logging.info("entered into the data ingestion file")

        try: 
            user_data = pd.read_csv("data/user_data.csv")
            movie_data = pd.read_csv("data/movie_data.csv")

            data = pd.merge(user_data , movie_data , on = "movie_id" , how = "inner")

            unique_user = data["user_id"].unique()
            unique_movie = data["movie_id"].unique()

            user_idx = {v:i for i,v in enumerate(unique_user)}
            movie_idx = {v:i for i ,v in enumerate(unique_movie)}

            save_object("artifacts/user_encoder.pkl" , user_idx)
            save_object("artifacts/movie_encoder.pkl" , movie_idx)

            user_encoded = data["user_id"].map(user_idx)
            movie_encoded = data["movie_id"].map(movie_idx)

            data["user_encoded"] = user_encoded
            data["movie_encoded"] = movie_encoded

            train_data , test_data = train_test_split(data , test_size = 0.2 , random_state = 42)

            os.makedirs(os.path.dirname(self.train_data_path) , exist_ok=True)

            train_data.to_csv(self.train_data_path , index = False , header = True)

            test_data.to_csv(self.test_data_path , index = False , header = True)

            logging.info("data is injected into the train and test file")

            return self.train_data_path , self.test_data_path
        
        
        except Exception as e:
            raise CustomException(e , sys)

if __name__ == "__main__":
    obj = data_initialize()

    train_path , test_path = obj.data_initial()
    print(train_path)
    print(test_path)
