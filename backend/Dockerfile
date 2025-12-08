# Use Python 3.12.3 slim image for smaller size
FROM python:3.12.3-slim

# Set environment variables for better Python behavior
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

# Set working directory
WORKDIR /app

# Install system dependencies including build tools for compilation
RUN apt-get update && apt-get install -y \
    ffmpeg \
    tesseract-ocr \
    poppler-utils \
    gcc \
    g++ \
    make \
    curl \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && . $HOME/.cargo/env \
    && rm -rf /var/lib/apt/lists/*

# Add Rust to PATH
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy environment file and application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads temp output

# Expose the port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]