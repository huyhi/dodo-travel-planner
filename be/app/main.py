"""
Alternative main entry point using modular structure
This is an alternative to main.py that shows how to organize the code with routers
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import travel

from dotenv import load_dotenv

load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="FastAPI Backend (Modular)",
    description="A clean FastAPI backend application with modular structure",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/health")
async def health():
    return 'service up'

# Include routers
app.include_router(travel.router, prefix="/api/v1")
