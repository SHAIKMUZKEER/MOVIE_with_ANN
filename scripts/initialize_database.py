from src.database.connection import engine , Base
import sys
from src.database.models import User,Movie,Rating
from src.logger import logging
from src.exception import CustomException

def database_initialize(): 
    logging.info("database is started to create the models and connect to the database to create the tables")
    try: 
        Base.metadata.create_all(bind = engine)
    except Exception as e: 
        print(CustomException(e , sys))


if __name__ == "__main__": 
    database_initialize()