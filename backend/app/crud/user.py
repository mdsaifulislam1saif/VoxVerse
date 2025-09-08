from typing import Optional
from sqlalchemy.orm import Session
from app.core.security import SecurityService
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.crud.base import CRUDBase

security = SecurityService()

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    """CRUD operations for User model."""

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        """Create a new user with hashed password."""
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=security.get_password_hash(obj_in.password),
            is_active=True,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: User, obj_in: UserUpdate) -> User:
        """Update a user, hashing password if provided."""
        update_data = obj_in.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = security.get_password_hash(update_data.pop("password"))
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, username: str, password: str) -> Optional[User]:
        """Authenticate a user by username and password."""
        user_obj = self.get_by_username(db, username=username)
        if user_obj and security.verify_password(password, user_obj.hashed_password):
            return user_obj
        return None

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        """Retrieve a user by email."""
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        """Retrieve a user by username."""
        return db.query(User).filter(User.username == username).first()

    def is_active(self, user: User) -> bool:
        """Check if a user is active."""
        return user.is_active

# Instantiate CRUDUser for general use
user = CRUDUser(User)

# Convenience functions for authentication
def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return user.get_by_username(db, username=username)

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    return user.authenticate(db, username=username, password=password)
