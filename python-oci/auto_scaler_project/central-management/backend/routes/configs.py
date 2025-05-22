
from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Node, NodeConfig
from schemas.config import ConfigCreate, ConfigResponse, ConfigUpdate
from utils.auth import get_api_key
from datetime import datetime

router = APIRouter()

# Get node configuration
@router.get("/nodes/{node_id}/config", response_model=ConfigResponse)
def get_node_config(
    node_id: str,
    db: Session = Depends(get_db)
):
    # Find the node
    db_node = db.query(Node).filter(Node.node_id == node_id).first()
    
    if not db_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )
        
    # Get the active configuration
    config = db.query(NodeConfig).filter(
        NodeConfig.node_id == db_node.id,
        NodeConfig.is_active == True
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active configuration found for this node"
        )
        
    return {
        "config_id": config.id,
        "node_id": node_id,
        "version": config.version,
        "config": config.config_yaml,
        "created_at": config.created_at,
        "applied_at": config.applied_at
    }

# Create or update node configuration
@router.post("/nodes/{node_id}/config", response_model=ConfigResponse)
def update_node_config(
    node_id: str,
    config: ConfigCreate,
    db: Session = Depends(get_db)
):
    # Find the node
    db_node = db.query(Node).filter(Node.node_id == node_id).first()
    
    if not db_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )
        
    # Get current active configuration
    current_config = db.query(NodeConfig).filter(
        NodeConfig.node_id == db_node.id,
        NodeConfig.is_active == True
    ).first()
    
    # Determine new version number
    new_version = 1 if not current_config else current_config.version + 1
    
    # Create new configuration
    new_config = NodeConfig(
        node_id=db_node.id,
        version=new_version,
        config_yaml=config.config,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    # If there was a previous config, mark it as inactive
    if current_config:
        current_config.is_active = False
        
    db.add(new_config)
    db.commit()
    db.refresh(new_config)
    
    return {
        "config_id": new_config.id,
        "node_id": node_id,
        "version": new_config.version,
        "config": new_config.config_yaml,
        "created_at": new_config.created_at,
        "applied_at": None
    }

# Notify that config was applied
@router.put("/nodes/{node_id}/config/{config_id}/applied")
def config_applied(
    node_id: str,
    config_id: int,
    api_key: str = Security(get_api_key),
    db: Session = Depends(get_db)
):
    # Find the node
    db_node = db.query(Node).filter(Node.node_id == node_id).first()
    
    if not db_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )
        
    # Find the configuration
    config = db.query(NodeConfig).filter(
        NodeConfig.id == config_id,
        NodeConfig.node_id == db_node.id
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration not found"
        )
        
    # Mark as applied
    config.applied_at = datetime.utcnow()
    db.commit()
    
    return {"status": "applied", "config_id": config_id}
