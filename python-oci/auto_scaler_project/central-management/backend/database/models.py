
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, JSON, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import datetime

Base = declarative_base()

class Node(Base):
    """Represents an autoscaler node registered with the central management system."""
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(36), unique=True, index=True)  # UUID
    hostname = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=True)
    status = Column(String(20), default="REGISTERED")  # REGISTERED, ACTIVE, OFFLINE, ERROR
    created_at = Column(DateTime, default=func.now())
    last_seen = Column(DateTime, nullable=True)
    api_key = Column(String(255), nullable=False)
    
    # Relationships
    configs = relationship("NodeConfig", back_populates="node", cascade="all, delete-orphan")
    metrics = relationship("NodeMetric", back_populates="node", cascade="all, delete-orphan")
    instance_pools = relationship("InstancePool", back_populates="node", cascade="all, delete-orphan")

class NodeConfig(Base):
    """Stores configuration versions for each node."""
    __tablename__ = "node_configs"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(Integer, ForeignKey("nodes.id", ondelete="CASCADE"))
    version = Column(Integer, default=1)
    config_yaml = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    applied_at = Column(DateTime, nullable=True)
    
    # Relationships
    node = relationship("Node", back_populates="configs")

class InstancePool(Base):
    """Represents an OCI instance pool managed by an autoscaler node."""
    __tablename__ = "instance_pools"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(Integer, ForeignKey("nodes.id", ondelete="CASCADE"))
    pool_id = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=True)
    region = Column(String(50), nullable=False)
    compartment_id = Column(String(255), nullable=False)
    min_instances = Column(Integer, nullable=True)
    max_instances = Column(Integer, nullable=True)
    current_instances = Column(Integer, nullable=True)
    
    # Relationships
    node = relationship("Node", back_populates="instance_pools")
    schedules = relationship("PoolSchedule", back_populates="instance_pool", cascade="all, delete-orphan")

class PoolSchedule(Base):
    """Represents a scaling schedule for an instance pool."""
    __tablename__ = "pool_schedules"

    id = Column(Integer, primary_key=True, index=True)
    instance_pool_id = Column(Integer, ForeignKey("instance_pools.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    cron_expression = Column(String(100), nullable=False)
    target_instances = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    instance_pool = relationship("InstancePool", back_populates="schedules")

class NodeMetric(Base):
    """Stores historical metrics from nodes."""
    __tablename__ = "node_metrics"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(Integer, ForeignKey("nodes.id", ondelete="CASCADE"))
    instance_pool_id = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=func.now())
    cpu_utilization = Column(Float, nullable=True)
    memory_utilization = Column(Float, nullable=True)
    instance_count = Column(Integer, nullable=True)
    scaling_event = Column(Boolean, default=False)
    scaling_direction = Column(String(10), nullable=True)  # UP, DOWN, or NULL
    additional_data = Column(JSON, nullable=True)
    
    # Relationships
    node = relationship("Node", back_populates="metrics")
