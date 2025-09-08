from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.config.config import settings
from app.crud.user import CRUDUser 
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import TokenData

security = SecurityService()
user = CRUDUser()

class JWTService:
    """
    Service class to handle JWT authentication and user retrieval.
    """

    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    async def get_current_user(self, token: str = Depends(oauth2_scheme)) -> User:
        """Get the current authenticated user from JWT token."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
        except JWTError:
            raise credentials_exception

        user = user.get_user_by_username(self.db, username=token_data.username)
        if user is None:
            raise credentials_exception
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        return user

    async def get_current_active_user(self, current_user: User = Depends(get_current_user)) -> User:
        """Ensure the current user is active."""
        if not current_user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user
