
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.database import get_db
from routes import nodes, auth, configs, metrics
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="OCI Autoscaler Central Management",
    description="API for managing distributed OCI autoscalers",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["Authentication"], prefix="/api")
app.include_router(nodes.router, tags=["Nodes"], prefix="/api")
app.include_router(configs.router, tags=["Configurations"], prefix="/api")
app.include_router(metrics.router, tags=["Metrics"], prefix="/api")

@app.get("/")
def read_root():
    return {"message": "OCI Autoscaler Central Management API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("API_PORT", "8000")),
        reload=True if os.getenv("ENVIRONMENT") == "development" else False,
    )
