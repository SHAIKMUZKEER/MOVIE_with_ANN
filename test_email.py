# from src.services.email_service import send_otp_email

# send_otp_email(
#     receiver_email="shaikmuzkeer008@gmail.com", 
#     otp=100108
# )

# print("successfully sent")



import numpy as np
import random

otp = f"{np.random.randint(0 , 1_000_000):06d}"
print(otp)