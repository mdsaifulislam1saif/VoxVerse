from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.user import Token, UserCreate, User as UserSchema
from app.services.auth_service import AuthenticationService

router = APIRouter()

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user."""
    service = AuthenticationService(db)
    return service.register_user(user_in)

@router.post("/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    service = AuthenticationService(db)
    return service.login_user(form_data.username, form_data.password)
