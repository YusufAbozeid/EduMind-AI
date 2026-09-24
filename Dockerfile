# Hugging Face Spaces – SHAGHOOF AI Backend
# This Dockerfile is optimized for HF Spaces (Docker SDK)
# The app MUST listen on port 7860 for HF Spaces to work

# Stage 1: Install Python Dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Production Runtime
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Copy installed dependencies from builder
COPY --from=builder /install /usr/local

# Copy backend source code
COPY backend/ .

# HF Spaces requires port 7860
EXPOSE 7860

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]
