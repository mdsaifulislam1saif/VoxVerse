from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config.config import settings

# Create SQLAlchemy engine
engine = create_engine(settings.DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency function to get DB session (for FastAPI routes)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
