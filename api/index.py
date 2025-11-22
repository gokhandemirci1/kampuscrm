# Vercel serverless function entry point
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.main import app

# For Vercel deployment
# The app is the ASGI application

