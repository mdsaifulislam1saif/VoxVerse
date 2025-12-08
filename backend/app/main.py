import os
import logging
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from app.api import auth, users, convert, summarize, extract
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
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(convert.router, prefix="/convert", tags=["conversions"])
app.include_router(summarize.router, prefix="/summarize", tags=["summarization"])
app.include_router(extract.router, prefix="/extract", tags=["extraction"])

@app.get("/health")
async def health():
    return {"status": "healthy"}