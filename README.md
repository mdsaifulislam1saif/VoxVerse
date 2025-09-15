# VoxVerse - Intelligent Text-to-Speech Platform

A complete end-to-end Text-to-Speech platform powered by AI, OCR, and advanced TTS technology, with FastAPI backend, ReactJS frontend, and Docker for seamless deployment.

[![Python Version](https://img.shields.io/badge/python-3.13%2B-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)](https://fastapi.tiangolo.com)
[![JWT](https://img.shields.io/badge/JWT-Python%20Jose-6664.svg)](https://python-jose.readthedocs.io/)
[![OCR](https://img.shields.io/badge/OCR-EasyOCR-AA61FF.svg)](https://github.com/JaidedAI/EasyOCR)
[![TTS](https://img.shields.io/badge/TTS-Coqui%20TTS-7B61FF.svg)](https://github.com/coqui-ai/TTS)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-FFB000.svg)](https://ai.google.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy-003B57.svg)](https://www.sqlalchemy.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB.svg)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4.svg)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React%20Router-DOM-CA4245.svg)](https://reactrouter.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://docker.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [License](#license)

## Overview

VoxVerse is an intelligent text-to-speech platform that converts text from various sources (PDFs, images, direct input) into high-quality audio with advanced features like AI-powered summarization and multi-language support. Built with modern technologies including Large Language Models (LLMs), OCR engines, and state-of-the-art TTS systems, it delivers natural-sounding speech from any text input.

### Key Capabilities
- **Intelligent Text Extraction**: Uses OCR technology to extract text from PDFs and images
- **AI-Powered Summarization**: Leverages Google's Gemini LLM for content summarization
- **Natural Speech Synthesis**: High-quality text-to-speech conversion with multiple voice options
- **User Management**: Secure authentication and personal audio libraries

## Features
- **Multi-Source Text Processing**: Extract text from PDFs, images, or direct input
- **Advanced OCR**: EasyOCR integration for accurate text extraction from PDFs and images
- **AI Summarization**: Generate concise summaries using Google Gemini
- **High-Quality TTS**: Natural-sounding speech synthesis with Coqui TTS
- **Multi-Language Support**: Process and convert text in multiple languages
- **User Authentication**: Secure JWT-based user management
- **Audio Library**: Personal storage and management of generated audio files
- **Real-time Processing**: Fast, efficient conversion with progress tracking

## Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ React Frontend  │────│ FastAPI Backend │────│   SQLite DB     │
│                 │    │                 │    │                 │
│  • Dashboard    │    │ • Authentication│    │  • User Data    │
│  • File Upload  │    │ • Text Extract  │    │  • Conversions  │
│  • Audio Player │    │ • AI Summary    │    │  • File Paths   │
│  • User Auth    │    │ • TTS Convert   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │            ┌─────────────────┐                │
         │            │Text Processing  │                │
         │            │                 │                │
         │            │  • PDF Loader   │                │
         │            │  • OCR Engine   │                │
         │            │  • Lang select  │                │
         │            │  • Text Clean   │                │
         │            └─────────────────┘                │
         │                       │                       │
         │                       ▼                       │
         │            ┌─────────────────┐                │
         │            │ AI Summarization│────────────────┘
         │            │                 │
         │            │  • Google Gemini│
         │            │  • Context Aware│
         │            │  • Multi-format │
         │            │  • Smart Summary│
         │            └─────────────────┘
         │                       │
         │                       ▼
         └────────────┌─────────────────┐
                      │ Coqui TTS Engine│
                      │                 │
                      │  • Multi-lang   │
                      │  • High Quality │
                      │  • mp3 Output   │
                      └─────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Data Flow Process                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Upload ──→ React Frontend ──→ FastAPI Backend      │
│                                                             │
│  2. Text Extract ──→ OCR/PDF Parser ──→ Clean Text          │
│                                                             │
│  3. AI Summary ──→ Google Gemini ──→ Processed Text         │
│                                                             │
│  4. TTS Convert ──→ Coqui Engine ──→ Audio File             │
│                                                             │
│  5. Store & Serve ──→ Database ──→ User Library             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Text Processing Flow                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Input Source ──→ Text Extraction ──→ Language Selectinon   │
│                                                             │
│  Text Cleaning ──→ AI Summarization ──→ TTS Processing      │
│                                                             │
│  Audio Generation ──→ File Storage ──→ Database Record      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping
- **Coqui TTS**: Advanced text-to-speech synthesis
- **EasyOCR**: Optical character recognition for PDF and image text extraction
- **PyMuPDF**: PDF document processing 
- **Google Generative AI**: AI-powered text summarization
- **PyTorch**: Deep learning framework for TTS models
- **Python-JOSE**: JWT token handling for authentication

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **Vite**: Next-generation frontend build tool
- **TailwindCSS**: Utility-first CSS framework
- **React Router DOM**: Declarative routing for React
- **Lucide React**: Beautiful icon library

### DevOps & Deployment
- **Docker**: Containerization platform
- **Docker Compose**: Multi-container deployment
- **Uvicorn**: Lightning-fast ASGI server
- **SQLite**: Lightweight database for development
- **Environment Variables**: Secure configuration management

## Prerequisites

Before setting up the project, ensure you have:

- **Python 3.13+** installed
- **Node.js 22.12+** and **npm/yarn** for frontend development
- **Docker** and **Docker Compose** (for containerized deployment)
- **API Keys** for the following services:
  - [Google AI Studio](https://aistudio.google.com/app/apikey) - Gemini API access

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Saif-000001/VoxVerse.git
cd VoxVerse
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend
 
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

## Project Structure

```
VoxVerse/
├── backend/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── __init__.py
│   │   │   ├── auth.py             # Authentication endpoints
│   │   │   ├── convert.py          # Text-to-speech conversion
│   │   │   ├── extract.py          # Text extraction endpoints
│   │   │   ├── summarize.py        # AI summarization endpoints
│   │   │   └── users.py            # User management endpoints
│   │   ├── core/                   # Core functionality
│   │   │   ├── __init__.py
│   │   │   ├── auth.py             # Authentication logic
│   │   │   └── security.py         # Security utilities
│   │   ├── crud/                   # Database operations
│   │   │   ├── __init__.py
│   │   │   ├── base.py             # Base CRUD operations
│   │   │   ├── conversion.py       # Conversion CRUD
│   │   │   └── user.py             # User CRUD
│   │   ├── database/               # Database configuration
│   │   │   ├── __init__.py
│   │   │   └── database.py         # Database setup
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── conversion.py       # Conversion model
│   │   │   └── user.py             # User model
│   │   ├── schemas/                # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── conversion.py       # Conversion schemas
│   │   │   ├── extract.py          # Extraction schemas
│   │   │   ├── summarization.py    # Summary schemas
│   │   │   └── user.py             # User schemas
│   │   ├── services/               # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py     # Authentication service
│   │   │   ├── conversion_service.py # Conversion service
│   │   │   ├── gemini_service.py   # AI service
│   │   │   ├── ocr_service.py      # OCR service
│   │   │   ├── tts_service.py      # TTS service
│   │   │   └── user_service.py     # User service
│   │   ├── config/                 # Configuration
│   │   │   ├── __init__.py
│   │   │   └── config.py           # App configuration
│   │   ├── __init__.py
│   │   └── main.py                 # FastAPI application
│   ├── data/                       # Storage directories
│   ├── uploads/                    # Temporary file storage
│   ├── temp/                       # Processing temp audio files
│   ├── .env                        # Environment variables
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Docker build file
│   ├── .dockerignore
│   └── setup.py
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── auth/               # Authentication components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── conversion/         # Conversion components
│   │   │   │   ├── AudioPlayer.jsx
│   │   │   │   ├── ConvertTab.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   └── LanguageSelector.jsx
│   │   │   ├── home/               # Homepage components
│   │   │   │   ├── CTASection.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   └── HowItWorks.jsx
│   │   │   ├── layout/             # Layout components
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── pages/              # Page components
│   │   │   │   ├── Converter.jsx
│   │   │   │   ├── History.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── progress/           # Loading components
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── LoadingOverlay.jsx
│   │   │   ├── store/              # State components
│   │   │   │   ├── ConversionCard.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── RefreshButton.jsx
│   │   │   └── summary/            # Summary components
│   │   │       ├── SummarizeSelector.jsx
│   │   │       ├── SummarizeTab.jsx
│   │   │       ├── SummaryControls.jsx
│   │   │       └── SummaryDisplay.jsx
│   │   ├── context/                # React context
│   │   │   └── AuthContext.jsx
│   │   ├── hook/                   # Custom hooks
│   │   │   ├── useAudioPlayer.js
│   │   │   ├── useFileUpload.js
│   │   │   ├── useHistory.js
│   │   │   ├── useLogin.js
│   │   │   ├── useRegister.js
│   │   │   ├── useSummarize.js
│   │   │   └── useTextToAudio.js
│   │   ├── services/               # API services
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── config/                 # Configuration
│   │   │   └── config.js
│   │   ├── routerprovider/         # Routing
│   │   │   └── Router.jsx
│   │   ├── root/                   # Root components
│   │   │   └── Root.jsx
│   │   ├── main.jsx                # ReactDOM entry point
│   │   └── index.css               # Global styles with Tailwind
│   ├── .env                        # Environment variables
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Project dependencies & scripts
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── vite.config.js              # Vite configuration
│   ├── Dockerfile                  # Frontend Docker build
│   └── .dockerignore
├── docker-compose.yml              # Docker Compose configuration
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
└── LICENSE                         # MIT License
```

## Configuration

### Environment Variables Backend

Create a `.env` file in the backend directory:

```env
# Application Settings
APP_NAME="Realistic Audio Generator"
APP_VERSION="1.0.0"
DEBUG=false
ENVIRONMENT="development"

# Security Configuration
SECRET_KEY="your-super-secret-key-replace-in-production-with-strong-random-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database Configuration
DATABASE_URL="sqlite:///./app.db"

# CORS Configuration
ALLOWED_ORIGINS="http://localhost:3000"

GEMINI_API_KEY="your_google_api_key_here"
```

### API Keys Setup

1. **Google AI API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the generated key

### Environment Variables Frontend

Create a `.env` file in the frontend directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

## Usage

### Development Mode

#### Start Backend Server

```bash
# From backend directory
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Start Frontend Development Server

```bash
# From frontend directory
cd frontend
npm run VoxVerse
# or
yarn run VoxVerse
```

### Application Flow

1. **User Registration/Login**: Create account or authenticate
2. **language Selection**: Choose language 
3. **Choose Input Method**:
   - Upload PDF document
   - Upload image with text
   - Enter text directly
4. **Text Processing**: System extracts and cleans text
5. **Optional Summary Selection**: Choose whether to summarize the content.
6. **Summarization**: AI-powered content summarization (if selected).
7. **Audio Generation**: Convert the (summarized or original) text into high-quality TTS audio.
8. **Playback & Download**: Listen and save generated audio

## API Documentation

### Endpoints

#### Authentication
```http
POST /auth/register     # User registration
POST /auth/token        # User login
```

#### Text Extraction
```http
POST /extract/pdf       # Extract text from PDF
POST /extract/image     # Extract text from image
```

#### AI Processing
```http
POST /summarize/summary # Generate text summary
```

#### Audio Conversion
```http
POST /convert/text      # Convert text to speech
GET  /convert           # List user conversions
GET  /convert/{id}      # Get specific conversion
GET  /convert/{id}/stream   # Stream audio file
GET  /convert/{id}/download # Download audio file
DELETE /convert/{id}    # Delete conversion
```
#### Users
```http
GET /users/me       # Get current user and find out token
PUT /users/me       # update user information (email, username, password)
```
### Example API Usage

#### Text-to-Speech Conversion
```bash
curl -X POST "http://localhost:8000/convert/text" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is VoxVerse!",
    "language": "en",
  }'
```

#### Response Format
```json
{
  "file_name": "Audio_en_20250915020050",
  "language": "en",
  "source_type": "text",
  "text_content": "Hello, this is VoxVerse!",
  "id": 113,
  "user_id": 3,
  "audio_file_path": "/home/saif/Projects/VoxVerse/backend/app/temp/audio/Audio_en_e0c2ed9b-948a-4537-bd51-7b6df2960011.wav",
  "created_at": "2025-09-14T20:00:50"
}
```

### Interactive API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build backend image
cd backend
docker build -t backend .

# Build frontend image
cd frontend
docker build -t frontend .

# Run with compose
docker-compose up --build

# Stop services
docker-compose down
```
## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.