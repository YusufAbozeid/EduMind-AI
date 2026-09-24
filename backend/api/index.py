"""
Vercel Serverless Entry Point for SHAGHOOF AI Backend.
This module exposes the FastAPI app to Vercel's Python runtime.
"""
import sys
import os

# Add backend directory to Python path so imports work correctly
backend_dir = os.path.join(os.path.dirname(__file__), '..')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import the FastAPI app from app.main
from app.main import app

handler = app

