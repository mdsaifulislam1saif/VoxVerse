from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import SecurityService
from app.crud.user import user as user_crud, authenticate_user
from app.database.database import get_db
from app.schemas.user import Token, UserCreate, User as UserSchema

class AuthenticationService:
    """Service class to handle user registration and login/authentication."""
    def __init__(self, db: Session):
        # Store the database session
        self.db = db
        # Security helper for hashing passwords and creating tokens
        self.security = SecurityService()

    def register_user(self, user_in: UserCreate) -> UserSchema:
        # Check if email is already in use
        if user_crud.get_by_email(self.db, email=user_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        # Check if username is already taken
        if user_crud.get_by_username(self.db, username=user_in.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        # Create the user and return the new user object
        return user_crud.create(self.db, obj_in=user_in)

    def login_user(self, username: str, password: str) -> Token:
        # Verify username and password
        db_user = authenticate_user(self.db, username, password)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},  # For browser/API clients
            )
        # Generate a JWT access token for the user
        access_token = self.security.create_access_token(subject=db_user.username)
        return {"access_token": access_token, "token_type": "bearer"}
