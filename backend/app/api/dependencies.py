from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.conversion import Conversion
from app.core.auth import AuthService
from app.crud.conversion import conversion

auth = AuthService()

class ConversionService:
    """
    Service class to handle conversion-related operations,
    including access control by the authenticated user.
    """

    def __init__(self, db: Session, current_user: User):
        self.db = db
        self.current_user = current_user

    def get_conversion_by_id(
        self,
        conversion_id: int,
        current_user: User = Depends(auth.get_current_active_user),
    ) -> Conversion:
        """
        Get a conversion by ID if it belongs to the current user.
        Raises 404 if not found and 403 if the user doesn't own it.
        """
        conv = conversion.get(self.db, conversion_id)
        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversion not found"
            )
        if conv.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return conv
