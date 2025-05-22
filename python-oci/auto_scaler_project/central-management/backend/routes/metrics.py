
from fastapi import APIRouter, Depends, HTTPException, status, Security, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from database.models import Node, NodeMetric, InstancePool
from schemas.metric import MetricCreate, MetricResponse, MetricSummary
from utils.auth import get_api_key
from typing import List, Dict
from datetime import datetime, timedelta

router = APIRouter()

# Submit metrics from a node
@router.post("/nodes/{node_id}/metrics")
def submit_metrics(
    node_id: str,
    metric: MetricCreate,
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
        
    # Create the metric
    new_metric = NodeMetric(
        node_id=db_node.id,
        instance_pool_id=metric.instance_pool_id,
        cpu_utilization=metric.cpu_utilization,
        memory_utilization=metric.memory_utilization,
        instance_count=metric.instance_count,
        scaling_event=metric.scaling_event,
        scaling_direction=metric.scaling_direction,
        additional_data=metric.additional_data
    )
    
    db.add(new_metric)
    db.commit()
    
    return {"status": "recorded"}

# Get metrics for a specific node and instance pool
@router.get("/nodes/{node_id}/metrics/{pool_id}", response_model=List[MetricResponse])
def get_node_pool_metrics(
    node_id: str,
    pool_id: str,
    hours: int = Query(24, description="Number of hours of data to retrieve"),
    db: Session = Depends(get_db)
):
    # Find the node
    db_node = db.query(Node).filter(Node.node_id == node_id).first()
    
    if not db_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )
        
    # Calculate the time range
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=hours)
    
    # Get metrics for the specified time range
    metrics = db.query(NodeMetric).filter(
        NodeMetric.node_id == db_node.id,
        NodeMetric.instance_pool_id == pool_id,
        NodeMetric.timestamp >= start_time,
        NodeMetric.timestamp <= end_time
    ).order_by(NodeMetric.timestamp.desc()).all()
    
    return metrics

# Get summary metrics for all pools
@router.get("/metrics/summary", response_model=Dict[str, MetricSummary])
def get_metrics_summary(
    db: Session = Depends(get_db)
):
    # Get all instance pools
    pools = db.query(InstancePool).all()
    result = {}
    
    for pool in pools:
        # Calculate statistics for this pool
        stats = db.query(
            func.avg(NodeMetric.cpu_utilization).label("avg_cpu"),
            func.avg(NodeMetric.memory_utilization).label("avg_memory"),
            func.max(NodeMetric.cpu_utilization).label("max_cpu"),
            func.max(NodeMetric.memory_utilization).label("max_memory"),
            func.min(NodeMetric.cpu_utilization).label("min_cpu"),
            func.min(NodeMetric.memory_utilization).label("min_memory"),
            func.max(NodeMetric.instance_count).label("max_instances"),
            func.min(NodeMetric.instance_count).label("min_instances"),
            func.count(NodeMetric.id).label("data_points")
        ).filter(
            NodeMetric.instance_pool_id == pool.pool_id,
            NodeMetric.timestamp >= datetime.utcnow() - timedelta(hours=24)
        ).first()
        
        # Count scaling events
        scaling_events = db.query(func.count(NodeMetric.id)).filter(
            NodeMetric.instance_pool_id == pool.pool_id,
            NodeMetric.scaling_event == True,
            NodeMetric.timestamp >= datetime.utcnow() - timedelta(hours=24)
        ).scalar()
        
        # Add to result if we have data
        if stats and stats.data_points > 0:
            result[pool.pool_id] = {
                "pool_id": pool.pool_id,
                "display_name": pool.display_name,
                "region": pool.region,
                "avg_cpu": float(stats.avg_cpu) if stats.avg_cpu else 0,
                "avg_memory": float(stats.avg_memory) if stats.avg_memory else 0,
                "max_cpu": float(stats.max_cpu) if stats.max_cpu else 0,
                "max_memory": float(stats.max_memory) if stats.max_memory else 0,
                "min_cpu": float(stats.min_cpu) if stats.min_cpu else 0,
                "min_memory": float(stats.min_memory) if stats.min_memory else 0,
                "current_instances": pool.current_instances,
                "max_instances": stats.max_instances,
                "min_instances": stats.min_instances,
                "scaling_events_24h": scaling_events
            }
    
    return result
