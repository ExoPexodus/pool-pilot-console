
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Node

# Define API key security scheme
api_key_header = APIKeyHeader(name="X-API-Key")

def get_api_key(
    api_key: str = Depends(api_key_header),
    db: Session = Depends(get_db)
):
    # Check if API key exists in database
    node = db.query(Node).filter(Node.api_key == api_key).first()
    
    if not node:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
        
    return api_key
