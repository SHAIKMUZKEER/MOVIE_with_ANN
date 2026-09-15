import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv

from src.logger import logging


load_dotenv()


MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")


def send_otp_email(
    receiver_email: str,
    otp: str
):

    try:

        # Check email configuration
        if not MAIL_USERNAME or not MAIL_PASSWORD or not MAIL_FROM:
            raise RuntimeError(
                "Email configuration is missing in .env"
            )

        subject = "Movie Recommendation - Password Reset"

        body = f"""
Hello,

We received a request to reset your password.

Your verification code is:

{otp}

This code is valid for 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
Movie Recommendation System
"""

        # Create email
        message = MIMEMultipart()

        message["From"] = MAIL_FROM
        message["To"] = receiver_email
        message["Subject"] = subject

        message.attach(
            MIMEText(body, "plain")
        )

        # Connect to Gmail SMTP server
        with smtplib.SMTP(
            "smtp.gmail.com",
            587
        ) as server:

            # Secure the connection
            server.starttls()

            # Login to Gmail
            server.login(
                MAIL_USERNAME,
                MAIL_PASSWORD
            )

            # Send email
            server.sendmail(
                MAIL_FROM,
                receiver_email,
                message.as_string()
            )

        logging.info(
            f"Password reset OTP sent to {receiver_email}"
        )

    except Exception as e:

        logging.error(
            f"Failed to send OTP email: {e}"
        )

        raise


