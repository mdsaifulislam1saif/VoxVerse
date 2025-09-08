from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt
from passlib.context import CryptContext
from app.config.config import settings

class SecurityService:
    """
    Service class to handle password hashing, verification, and JWT token creation.
    """
    def __init__(self):
        # Password hashing context
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # ---------------- Password Utilities ----------------
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain password against its hashed version.
        """
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """
        Hash a plain password.
        """
        return self.pwd_context.hash(password)

    # ---------------- JWT Token Utilities ----------------
    def create_access_token(
        self, subject: Union[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a JWT access token with an optional expiration timedelta.
        """
        expire = (
            datetime.utcnow() + expires_delta
            if expires_delta
            else datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        to_encode = {"exp": expire, "sub": str(subject)}
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
