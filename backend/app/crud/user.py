from typing import Optional
from sqlalchemy.orm import Session
from app.core.security import SecurityService
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.crud.base import CRUDBase

# Security helper to hash and verify passwords
security = SecurityService()

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    """Handles all database operations for the User model."""
    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        # Create the user object, hashing the password
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=security.get_password_hash(obj_in.password),
            is_active=True,  # New users are active by default
        )
        db.add(db_obj)    
        db.commit()         
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: User, obj_in: UserUpdate) -> User:
        # Only get fields that were actually set in the update
        update_data = obj_in.dict(exclude_unset=True)
        # If password is included, hash it before saving
        if "password" in update_data:
            update_data["hashed_password"] = security.get_password_hash(update_data.pop("password"))
        # Use the base class update method for the actual database update
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, username: str, password: str) -> Optional[User]:
        # Authenticate a user by checking username and password.
        user_obj = self.get_by_username(db, username=username)
        if user_obj and security.verify_password(password, user_obj.hashed_password):
            return user_obj
        return None

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        """Get a user by their email address."""
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        """Get a user by their username."""
        return db.query(User).filter(User.username == username).first()

    def is_active(self, user: User) -> bool:
        """Check if a user account is active."""
        return user.is_active

# Create a global CRUDUser object for easy access elsewhere
user = CRUDUser(User)

# Simple helper functions for authentication
def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Fetch a user by username using the global CRUDUser object."""
    return user.get_by_username(db, username=username)

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Authenticate a user using the global CRUDUser object."""
    return user.authenticate(db, username=username, password=password)
