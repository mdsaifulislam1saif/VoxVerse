from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.config.config import settings
from app.crud.user import get_user_by_username
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import TokenData

class AuthService:
    """
    Service class to handle user authentication and token validation.
    """
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

    async def get_current_user(
        self,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
    ) -> User:
        """
        Retrieve the currently authenticated user from the JWT token.
        Raises HTTPException if token is invalid or user does not exist.
        """
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

        user = get_user_by_username(db, username=token_data.username)
        if user is None:
            raise credentials_exception
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        return user

    async def get_current_active_user(
        self,
        current_user: User = Depends(get_current_user)
    ) -> User:
        """
        Ensure the user is active.
        Raises HTTPException if the user is inactive.
        """
        if not current_user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user
