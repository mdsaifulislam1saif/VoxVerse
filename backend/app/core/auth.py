from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.config.config import settings
from app.crud.user import user as user_crud
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import TokenData

# tokenUrl points to the login endpoint (/auth/token) used to obtain tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Retrieve the current authenticated user from the JWT token.
    Steps:
    1. Extract JWT token from Authorization header (using oauth2_scheme).
    2. Decode the token using SECRET_KEY and ALGORITHM.
    3. Extract the 'sub' claim (username) from token payload.
    4. Fetch user from the database by username.
    5. Ensure user exists and is active.
    """
    # Define a reusable exception for invalid credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode JWT token and extract username 
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        # Raised if token is invalid 
        raise credentials_exception
    # Fetch user from DB
    db_user = user_crud.get_by_username(db, username=token_data.username)
    if db_user is None:
        raise credentials_exception
    # Ensure the user is active
    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return db_user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Ensure that the current authenticated user is active.
    - Uses get_current_user to fetch user from token.
    - Raises error if user is inactive.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

class AuthService:
    """
    Service class to encapsulate authentication-related helpers.
    Provides:
    - oauth2_scheme: Extract JWT tokens from headers.
    - get_current_user: Retrieve user from token.
    - get_current_active_user: Ensure user is active.
    """
    def __init__(self):
        self.oauth2_scheme = oauth2_scheme
        self.get_current_user = get_current_user
        self.get_current_active_user = get_current_active_user

# Singleton instance of AuthService, used across the application
auth_service = AuthService()
