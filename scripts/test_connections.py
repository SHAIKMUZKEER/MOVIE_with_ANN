from src.database.connection import engine
from src.exception import CustomException
import sys

def test_engine(): 
    try: 
        with engine.connect() as connection: 
            print("connection is working")
    except Exception as e: 
        print(CustomException(e , sys))

test_engine()