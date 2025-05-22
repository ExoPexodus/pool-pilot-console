
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Instance Pool Schemas
class InstancePoolBase(BaseModel):
    pool_id: str
    region: str
    compartment_id: str

class InstancePoolCreate(InstancePoolBase):
    display_name: Optional[str] = None
    min_instances: Optional[int] = None
    max_instances: Optional[int] = None
    current_instances: Optional[int] = None

class InstancePoolResponse(InstancePoolBase):
    id: int
    node_id: int
    display_name: Optional[str] = None
    min_instances: Optional[int] = None
    max_instances: Optional[int] = None
    current_instances: Optional[int] = None
    
    class Config:
        orm_mode = True

# Node Schemas
class NodeBase(BaseModel):
    hostname: str
    ip_address: Optional[str] = None

class NodeCreate(NodeBase):
    config: Optional[str] = None
    instance_pools: Optional[List[InstancePoolCreate]] = None

class NodeUpdate(BaseModel):
    status: Optional[str] = None

class NodeResponse(BaseModel):
    node_id: str
    hostname: str
    status: str
    instance_pools: Optional[List[InstancePoolResponse]] = None
    config: Optional[str] = None
    last_seen: Optional[datetime] = None
    api_key: Optional[str] = None
    
    class Config:
        orm_mode = True

class NodeList(BaseModel):
    id: int
    node_id: str
    hostname: str
    status: str
    last_seen: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        orm_mode = True
