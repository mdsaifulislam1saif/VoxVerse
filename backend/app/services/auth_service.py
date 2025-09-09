from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import SecurityService
from app.crud.user import user as user_crud, authenticate_user
from app.database.database import get_db
from app.schemas.user import Token, UserCreate, User as UserSchema

class AuthenticationService:
    """Service class for user registration and authentication."""
    def __init__(self, db: Session):
        self.db = db
        self.security = SecurityService()

    def register_user(self, user_in: UserCreate) -> UserSchema:
        """Register a new user with unique email and username."""
        # Check if email exists
        if user_crud.get_by_email(self.db, email=user_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        # Check if username exists
        if user_crud.get_by_username(self.db, username=user_in.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        # Create and return new user
        return user_crud.create(self.db, obj_in=user_in)

    def login_user(self, username: str, password: str) -> Token:
        """Authenticate user and return access token."""
        db_user = authenticate_user(self.db, username, password)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = self.security.create_access_token(subject=db_user.username)
        return {"access_token": access_token, "token_type": "bearer"}

