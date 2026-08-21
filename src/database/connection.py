import os
import sys
from src.logger import logging

from src.exception import CustomException 
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy import URL
from sqlalchemy.orm import sessionmaker, declarative_base

logging.info("enters into database connection file")

## loading the env file for the database details
load_dotenv(".env")


## configure

MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")


## check that is any enenvironment variable is missing 

try: 
    if not all([MYSQL_HOST,MYSQL_USER,MYSQL_PORT,MYSQL_PASSWORD,MYSQL_DATABASE]):
        raise ValueError("some variables ")

except Exception as e: 
    print(CustomException(e , sys))


## MYSQL connction URL 
DATABASE_URL = URL.create(
    drivername="mysql+pymysql", 
    username = MYSQL_USER,
    host = MYSQL_HOST, 
    port = MYSQL_PORT,
    password = MYSQL_PASSWORD,
    database = MYSQL_DATABASE
)



## creatings the MYSQL engine 
engine = create_engine(DATABASE_URL , echo = True) ## it is used to connect the database by creating the engine with logging detail in the terminals by echo = True


### creatings the database session to start the connect between the python backend and mysql DB ny sql engine 
SessionLocal = sessionmaker(
    autocommit=False,   ## autocommit is used to prevent from unessecary commits 
    autoflush=False,    ## autoflush is used for uncessacry previous commits 
    bind=engine    ## used the created engone ny url and echo
)


# Base class for SQLAlchemy models
Base = declarative_base()    ### this is the base model that inherit the tables form the database 


# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()  ### his starts a new session when the user click the new information to store in the MYSQL 

    try:
        yield db  ### it is used to make api endpoint to make it work with DATABASE 

    finally:
        db.close()  ## it safely close the DATABASE session after api completing its work .