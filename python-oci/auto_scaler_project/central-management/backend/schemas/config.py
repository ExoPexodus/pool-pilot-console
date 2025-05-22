
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ConfigBase(BaseModel):
    config: str

class ConfigCreate(ConfigBase):
    pass

class ConfigUpdate(BaseModel):
    is_active: Optional[bool] = None
    applied_at: Optional[datetime] = None

class ConfigResponse(ConfigBase):
    config_id: int
    node_id: str
    version: int
    created_at: datetime
    applied_at: Optional[datetime] = None

    class Config:
        orm_mode = True
