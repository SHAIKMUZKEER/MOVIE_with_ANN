import numpy as np 
import sys
from sklearn.metrics import mean_squared_error , r2_score
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input , Embedding , Flatten , Dense , Concatenate , Dropout
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping
from src.components.data_transformation import data_transformation
from src.logger import logging
from src.exception import CustomException
from src.utils import save_object

 
class data_configure: 
    def __init__(self):
        self.train_list, self.test_list = data_transformation().initialize_transformation()

class model_trainer(data_configure): 
    def initialize_model(self): 
        logging.info("entered model training function")
        try :
            train_list = self.train_list
            test_list = self.test_list

            user_data_train = train_list[0]
            movie_data_train = train_list[1]
            y_train = train_list[2]

            user_data_test = test_list[0]
            movie_data_test = test_list[1]
            y_test = test_list[2]

            user_data_train = user_data_train.reshape(-1,1)
            movie_data_train = movie_data_train.reshape(-1,1)

            user_data_test = user_data_test.reshape(-1,1)
            movie_data_test = movie_data_test.reshape(-1,1)

            call_back = EarlyStopping(
                    monitor="val_loss",
                    patience=3,
                    mode="min",
                    min_delta=0.001,
                    restore_best_weights=True,
                    verbose=1
            )
            user_input = Input(shape = (1,))
            movie_input = Input(shape = (1,))

            user_embedding = Embedding(943 , 32 , embeddings_regularizer=l2(1e-3))(user_input)
            movie_embedding = Embedding(1683 , 32 , embeddings_regularizer=l2(1e-3))(movie_input)

            user_flat = Flatten()(user_embedding)
            movie_flat = Flatten()(movie_embedding)

            concate = Concatenate()([user_flat , movie_flat])

            #layers
            hidden1 = Dense(128 , activation = "relu" , kernel_regularizer = l2(1e-5))(concate)
            hidden1 = Dropout(0.4)(hidden1)

            hidden2 = Dense(64 , activation = "relu" , kernel_regularizer = l2(1e-5))(hidden1)
            hidden2 = Dropout(0.4)(hidden2)

            hidden3 = Dense(32 , activation = "relu" , kernel_regularizer = l2(1e-5))(hidden2)
            hidden3 = Dropout(0.4)(hidden3)

            hidden4 = Dense(8 , activation = "relu" , kernel_regularizer = l2(1e-5))(hidden3)
            hidden4 = Dropout(0.4)(hidden4)

            #output
            output = Dense(1)(hidden4)

            model = Model(inputs = [user_input , movie_input] , outputs = output)

            #compile the model 

            model.compile(optimizer= tf.keras.optimizers.Adam(0.0005) , loss = tf.keras.losses.Huber() , metrics = ["mae"])

            history = model.fit([user_data_train,movie_data_train] , y_train , validation_data= ([user_data_test, movie_data_test] , y_test) , epochs = 30 , callbacks = call_back , batch_size = 64)
            logging.info("model training is completed")

            y_pred = model.predict([user_data_test , movie_data_test])

            save_object(file_path = "artifacts/movie_recommendation_model.keras" , obj = model)

            mse = mean_squared_error(y_test , y_pred)
            r2 = r2_score(y_test , y_pred)

            print("mse : ",mse)
            print("r2 : ", r2)
            logging.info("model saving has done")

        except Exception as e:
            print(CustomException(e , sys))

if __name__ == "__main__": 
    obj = model_trainer()
    obj.initialize_model()