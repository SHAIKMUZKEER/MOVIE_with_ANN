import logging 
import os 
from datetime import datetime

LOG_FILENAME = f"{datetime.now().strftime('%m_%d_%y_%H_%M_%S')}.log"  ## used to create the file name by current time

log_path = os.path.join(os.getcwd() , "logs" , LOG_FILENAME)  ##creates the folder path with folder name "logs" and file name is LOG_FILENAME

os.makedirs(os.path.dirname(log_path) , exist_ok = True) ##remove the file name and create the logs foldet in the project folder

logging.basicConfig(
    filename=log_path, 
    level = logging.INFO, 
    format = "[ %(asctime)s ] %(lineno)d %(name)s - %(levelname)s - %(message)s"
)  ## this function config the logging engine to create in this format .
