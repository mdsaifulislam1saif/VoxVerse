import os
import logging
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from app.api.routes import auth_router, users_router, convert_router
from app.config.config import settings
from app.database.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title=settings.APP_NAME)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix=f"/auth", tags=["authentication"])
app.include_router(users_router, prefix=f"/users", tags=["users"])
app.include_router(convert_router, prefix=f"/convert", tags=["conversions"])
