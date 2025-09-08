from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.crud.user import user as user_crud
from app.core.auth import AuthService
from app.schemas.user import User as UserSchema, UserUpdate

router = APIRouter()
auth = AuthService()

class UserService:
    def __init__(self, db: Session, current_user: User):
        self.db = db
        self.current_user = current_user

    def get_me(self) -> User:
        return self.current_user

    def update_me(self, user_in: UserUpdate) -> User:
        if user_in.email and user_in.email != self.current_user.email:
            db_user = user_crud.get_by_email(self.db, email=user_in.email)
            if db_user:
                raise HTTPException(status_code=400, detail="Email already registered")
        if user_in.username and user_in.username != self.current_user.username:
            db_user = user_crud.get_by_username(self.db, username=user_in.username)
            if db_user:
                raise HTTPException(status_code=400, detail="Username already taken")
        return user_crud.update(self.db, db_obj=self.current_user, obj_in=user_in)

# Routes
@router.get("/me", response_model=UserSchema)
def read_current_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_active_user)
):
    service = UserService(db=db, current_user=current_user)
    return service.get_me()

@router.put("/me", response_model=UserSchema)
def update_current_user(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_active_user)
):
    service = UserService(db=db, current_user=current_user)
    return service.update_me(user_in)
