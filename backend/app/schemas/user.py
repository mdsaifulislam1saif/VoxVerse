from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Shared fields
class UserBase(BaseModel):
    email: EmailStr = Field(..., example="user@example.com")
    username: str = Field(..., min_length=3, max_length=50, example="john_doe")

# Create schema (for registration)
class UserCreate(UserBase):
    password: str = Field(..., min_length=4, example="securepassword123")

# Update schema (for profile update)
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(None, example="new_email@example.com")
    username: Optional[str] = Field(None, min_length=3, max_length=50, example="new_username")
    password: Optional[str] = Field(None, min_length=4, example="newpassword456")

# Base schema for DB responses
class UserInDBBase(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # allows ORM -> Pydantic conversion

# API response schema (excludes password)
class User(UserInDBBase):
    pass

# Internal DB schema (includes hashed password)
class UserInDB(UserInDBBase):
    hashed_password: str

# Token response schema
class Token(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOi...")
    token_type: str = Field(..., example="bearer")

# Token payload (for decoding JWT)
class TokenData(BaseModel):
    username: Optional[str] = Field(None, example="john_doe")