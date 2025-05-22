
from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Node, InstancePool, NodeConfig
from schemas.node import (
    NodeCreate, NodeResponse, NodeUpdate, NodeList,
    InstancePoolCreate, InstancePoolResponse
)
from schemas.auth import ApiKey
from typing import List
import uuid
from datetime import datetime
import secrets
from utils.auth import get_api_key

router = APIRouter()

# Node registration endpoint (used by autoscaler nodes)
@router.post("/register", response_model=NodeResponse)
def register_node(node: NodeCreate, db: Session = Depends(get_db)):
    # Generate a unique node_id
    node_id = str(uuid.uuid4())
    
    # Generate an API key for this node
    api_key = secrets.token_urlsafe(32)
    
    # Create the node
    db_node = Node(
        node_id=node_id,
        hostname=node.hostname,
        ip_address=node.ip_address,
        status="REGISTERED",
        api_key=api_key
    )
    
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    
    # If configuration is provided, save it
    if node.config:
        config = NodeConfig(
            node_id=db_node.id,
            config_yaml=node.config,
            version=1,
            is_active=True,
        )
        
        db.add(config)
        
        # Process instance pools from the configuration
        if node.instance_pools:
            for pool in node.instance_pools:
                db_pool = InstancePool(
                    node_id=db_node.id,
                    pool_id=pool.pool_id,
                    display_name=pool.display_name,
                    region=pool.region,
                    compartment_id=pool.compartment_id,
                    min_instances=pool.min_instances,
                    max_instances=pool.max_instances,
                    current_instances=pool.current_instances
                )
                db.add(db_pool)
    
    db.commit()
    
    return {
        "node_id": node_id,
        "api_key": api_key,
        "status": "REGISTERED"
    }

# Node heartbeat endpoint
@router.post("/nodes/{node_id}/heartbeat")
def node_heartbeat(
    node_id: str,
    metrics: dict = None,
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

    # Update the last_seen timestamp and status
    db_node.last_seen = datetime.utcnow()
    db_node.status = "ACTIVE"
    
    # Update instance counts if provided
    if metrics and "instance_counts" in metrics:
        for pool_id, count in metrics["instance_counts"].items():
            pool = db.query(InstancePool).filter(
                InstancePool.node_id == db_node.id,
                InstancePool.pool_id == pool_id
            ).first()
            
            if pool:
                pool.current_instances = count
    
    db.commit()
    
    return {"status": "acknowledged"}

# List all nodes (admin interface)
@router.get("/nodes", response_model=List[NodeList])
def list_nodes(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    nodes = db.query(Node).offset(skip).limit(limit).all()
    return nodes

# Get specific node details
@router.get("/nodes/{node_id}", response_model=NodeResponse)
def get_node(
    node_id: str,
    db: Session = Depends(get_db)
):
    db_node = db.query(Node).filter(Node.node_id == node_id).first()
    
    if not db_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )
    
    # Get instance pools for this node
    pools = db.query(InstancePool).filter(InstancePool.node_id == db_node.id).all()
    
    # Get active configuration
    config = db.query(NodeConfig).filter(
        NodeConfig.node_id == db_node.id,
        NodeConfig.is_active == True
    ).first()
    
    return {
        "node_id": db_node.node_id,
        "hostname": db_node.hostname,
        "status": db_node.status,
        "instance_pools": pools,
        "config": config.config_yaml if config else None,
        "last_seen": db_node.last_seen
    }

# Update node status
@router.put("/nodes/{node_id}")
def update_node(
    node_id: str,
    node_update: NodeUpdate,
    db: Session = Depends(get_db)
):
    db_node = db.query(Node).filter(Node.node_id == node_id).first()
    
    if not db_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )
    
    # Update fields
    if node_update.status:
        db_node.status = node_update.status
        
    db.commit()
    
    return {"status": "updated", "node_id": node_id}

# Delete a node
@router.delete("/nodes/{node_id}")
def delete_node(
    node_id: str,
    db: Session = Depends(get_db)
):
    db_node = db.query(Node).filter(Node.node_id == node_id).first()
    
    if not db_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )
    
    db.delete(db_node)
    db.commit()
    
    return {"status": "deleted", "node_id": node_id}
