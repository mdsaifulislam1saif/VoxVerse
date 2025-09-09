from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud.user import user as user_crud
from app.models.user import User
from app.schemas.user import UserUpdate

class UserService:
    """Service class for user-related operations."""
    def __init__(self, db: Session, current_user: User):
        self.db = db
        self.current_user = current_user

    def get_me(self) -> User:
        """Get current user profile."""
        return self.current_user

    def update_me(self, user_in: UserUpdate) -> User:
        """Update current user profile."""
        # Check if email is being changed and is unique
        if user_in.email and user_in.email != self.current_user.email:
            db_user = user_crud.get_by_email(self.db, email=user_in.email)
            if db_user:
                raise HTTPException(status_code=400, detail="Email already registered")
        # Check if username is being changed and is unique
        if user_in.username and user_in.username != self.current_user.username:
            db_user = user_crud.get_by_username(self.db, username=user_in.username)
            if db_user:
                raise HTTPException(status_code=400, detail="Username already taken")
        return user_crud.update(self.db, db_obj=self.current_user, obj_in=user_in)
