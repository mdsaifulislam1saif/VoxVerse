from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.auth import auth_service
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate
from app.services.user_service import UserService

# Router for user profile-related endpoints
router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_current_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_active_user)
):
    """
    Get the profile of the currently authenticated user.
    - Requires authentication (JWT token).
    - Fetches user details from the database.
    - Returns user profile info (without sensitive fields like password).
    """
    service = UserService(db=db, current_user=current_user)
    return service.get_me()

@router.put("/me", response_model=UserSchema)
def update_current_user(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_active_user)
):
    """
    Update the profile of the currently authenticated user.
    - Requires authentication (JWT token).
    - Accepts fields such as `username`, `email`, possword.
    - Updates database record and returns updated profile.
    """
    service = UserService(db=db, current_user=current_user)
    return service.update_me(user_in)
