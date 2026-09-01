import os 
import sys 
import dill
from src.exception import CustomException
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
import os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


security = HTTPBearer()


SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    try:

        token = credentials.credentials

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        return int(user_id)

    except (JWTError, ValueError):

        raise credentials_exception
    
def save_object(file_path , obj):

    try:
        dir_path = os.path.dirname(file_path)
        
        os.makedirs(dir_path , exist_ok=True)

        if file_path.endswith('keras') or file_path.endswith('h5'):
            obj.save(file_path)
        else: 
            with open(file_path , "wb") as file_obj:
                dill.dump(obj , file_obj)
    except Exception as e:
        print(CustomException(e , sys))

def load_object(file_path): 
    try: 
        with open(file_path , "rb") as file_obj: 
            return dill.load(file_obj)
    except Exception as e:
        print(CustomException(e , sys))
        
