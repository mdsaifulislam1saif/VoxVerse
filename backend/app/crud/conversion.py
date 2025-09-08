from typing import List
from sqlalchemy.orm import Session
from app.models.conversion import Conversion
from app.schemas.conversion import ConversionCreate, ConversionUpdate
from app.crud.base import CRUDBase

class CRUDConversion(CRUDBase[Conversion, ConversionCreate, ConversionUpdate]):
    """CRUD operations for Conversion model."""

    def create_with_owner(
        self, db: Session, *, obj_in: dict, user_id: int, audio_file_path: str
    ) -> Conversion:
        """
        Create a new conversion associated with a user.

        Args:
            db: SQLAlchemy session
            obj_in: Dictionary of conversion fields
            user_id: Owner's user ID
            audio_file_path: Path to generated audio file
        """
        db_obj = Conversion(
            **obj_in,
            user_id=user_id,
            audio_file_path=audio_file_path
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Conversion]:
        """
        Retrieve multiple conversions belonging to a specific user.

        Args:
            db: SQLAlchemy session
            user_id: Owner's user ID
            skip: Number of records to skip
            limit: Maximum number of records to return
        """
        return (
            db.query(Conversion)
            .filter(Conversion.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

# Instantiate a global CRUD object for conversions
conversion = CRUDConversion(Conversion)
