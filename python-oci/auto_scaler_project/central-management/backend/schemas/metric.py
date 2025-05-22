
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class MetricBase(BaseModel):
    instance_pool_id: str
    cpu_utilization: float
    memory_utilization: float
    instance_count: int
    scaling_event: bool = False
    scaling_direction: Optional[str] = None
    additional_data: Optional[Dict[str, Any]] = None

class MetricCreate(MetricBase):
    pass

class MetricResponse(MetricBase):
    id: int
    node_id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class MetricSummary(BaseModel):
    pool_id: str
    display_name: Optional[str] = None
    region: str
    avg_cpu: float
    avg_memory: float
    max_cpu: float
    max_memory: float
    min_cpu: float
    min_memory: float
    current_instances: Optional[int] = None
    max_instances: Optional[int] = None
    min_instances: Optional[int] = None
    scaling_events_24h: int = 0
