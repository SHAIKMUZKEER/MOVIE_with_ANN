import hashlib
import secrets
from src.logger import logging
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from src.database.models import User, PasswordReset
from src.services.email_service import send_otp_email
from src.services.auth_service import hash_password


OTP_EXPIRATION_MINUTES = 10


# Generate 6-digit OTP

def generate_otp():

    otp = f"{secrets.randbelow(1_000_000):06d}"  ## this code generate the 6 digit secure number from the python secret module 

    return otp


# Hash OTP

def hash_otp(otp: str):

    return hashlib.sha256(
        otp.encode()
    ).hexdigest()


# Request Password Reset

def request_password_reset(
    db: Session,
    email: str
):

    try:

        # 1. Find user using email
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        # User does not exist
        if not user:
            logging.info(
                f"Password reset requested for unknown email: {email}"
            )
            return

        # 2. Generate OTP
        otp = generate_otp()

        logging.info(
            "OTP generated successfully"
        )

        # 3. Hash OTP
        otp_hash = hash_otp(otp)

        # 4. Set expiration time
        expires_at = (
            datetime.utcnow()
            + timedelta(
                minutes=OTP_EXPIRATION_MINUTES
            )
        )

        # 5. Invalidate previous OTPs
        db.query(PasswordReset).filter(
            PasswordReset.user_id == user.user_id,
            PasswordReset.is_used == False
        ).update(
            {
                PasswordReset.is_used: True
            }
        )

        # 6. Create new reset record
        reset_token = PasswordReset(
            user_id=user.user_id,
            otp_hash=otp_hash,
            expires_at=expires_at,
            is_used=False
        )

        db.add(reset_token)

        # 7. Save OTP information
        db.commit()

        logging.info(
            f"Password reset OTP record created for user: {user.user_id}"
        )

        # 8. Send OTP email
        send_otp_email(
            receiver_email=user.email,
            otp=otp
        )

        logging.info(
            f"Password reset OTP email sent to: {user.email}"
        )

    except Exception as e:

        # Rollback only if transaction is still active
        db.rollback()

        # Print the REAL error in terminal
        print(
            f"\nPASSWORD RESET ERROR: "
            f"{type(e).__name__}: {e}\n"
        )

        logging.error(
            f"Password reset error: {type(e).__name__}: {e}"
        )

        raise
    
# Verify OTP

def verify_password_reset_otp(
    db: Session,
    email: str,
    otp: str
):

    # 1. Find user
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return False


    # 2. Get latest unused OTP
    reset_token = (
        db.query(PasswordReset)
        .filter(
            PasswordReset.user_id == user.user_id,
            PasswordReset.is_used == False
        )
        .order_by(
            PasswordReset.created_at.desc()
        )
        .first()
    )


    if not reset_token:
        return False


    # 3. Check expiration
    if datetime.utcnow() > reset_token.expires_at:

        reset_token.is_used = True

        db.commit()

        return False


    # 4. Hash OTP entered by user
    entered_otp_hash = hash_otp(otp)


    # 5. Compare OTP hashes
    if entered_otp_hash != reset_token.otp_hash:

        return False


    # OTP is correct
    return True


# Reset Password

def reset_password(
    db: Session,
    email: str,
    otp: str,
    new_password: str
):

    # 1. Find user
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise ValueError(
            "Invalid password reset request"
        )


    # 2. Get latest unused OTP
    reset_token = (
        db.query(PasswordReset)
        .filter(
            PasswordReset.user_id == user.user_id,
            PasswordReset.is_used == False
        )
        .order_by(
            PasswordReset.created_at.desc()
        )
        .first()
    )


    if not reset_token:

        raise ValueError(
            "Invalid or expired OTP"
        )


    # 3. Check expiration
    if datetime.utcnow() > reset_token.expires_at:

        reset_token.is_used = True

        db.commit()

        raise ValueError(
            "OTP has expired"
        )


    # 4. Verify OTP
    entered_otp_hash = hash_otp(otp)

    if entered_otp_hash != reset_token.otp_hash:

        raise ValueError(
            "Invalid OTP"
        )


    # 5. Hash new password
    hashed_password = hash_password(
        new_password
    )


    # 6. Update user's password
    user.password_hash = hashed_password


    # 7. Make OTP unusable
    reset_token.is_used = True


    # 8. Save changes
    db.commit()

    db.refresh(user)