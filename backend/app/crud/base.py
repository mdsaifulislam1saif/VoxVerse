from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.database import Base

# Define generic types so this CRUD class can work with any model and schemas
ModelType = TypeVar("ModelType", bound=Base)          # SQLAlchemy model
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)  # Pydantic schema for creating
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)  # Pydantic schema for updating

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """This is a base class that handles common database operations like create, read, update, delete."""
    def __init__(self, model: Type[ModelType]):
        # Store the model we will be working with
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        # Get a single record by its ID
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        # Get multiple records, with options to skip some and limit the number returned
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        # Create a new record in the database
        # Convert the Pydantic object to a dictionary
        obj_data = jsonable_encoder(obj_in)
        # Create the SQLAlchemy object
        db_obj = self.model(**obj_data)
        db.add(db_obj)       # Add it to the session
        db.commit()          # Save it in the database
        db.refresh(db_obj)   # Refresh to get things like the new ID
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        # Update an existing record
        # If obj_in is a dict, use it directly, otherwise convert Pydantic object to dict
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)  # Only update fields that are provided
        # Set each field on the database object
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)       
        db.commit()          
        db.refresh(db_obj)   
        return db_obj

    def remove(self, db: Session, *, id: int) -> ModelType:
        # Delete a record by its ID
        obj = db.query(self.model).get(id)  # Get the record
        if obj:
            db.delete(obj)  # Remove it from the database
            db.commit()     # Save changes
        return obj
