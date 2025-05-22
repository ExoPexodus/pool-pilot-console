
import requests
import threading
import time
import yaml
import os
import logging
from datetime import datetime
import json

class CentralManagementClient:
    def __init__(self, central_api_url, api_key=None, local_config_path="config.yaml"):
        self.central_api_url = central_api_url
        self.api_key = api_key
        self.local_config_path = local_config_path
        self.node_id = None
        self.stop_event = threading.Event()
        self.hostname = os.uname()[1] if hasattr(os, 'uname') else "unknown-host"
        self.logger = logging.getLogger("central_mgmt_client")
        
    def start(self):
        """Start the central management client and register with the central system."""
        try:
            # Register with central system if not already registered
            if not self.api_key:
                self.register()
            
            # Start heartbeat thread
            heartbeat_thread = threading.Thread(target=self.heartbeat_loop)
            heartbeat_thread.daemon = True
            heartbeat_thread.start()
            
            self.logger.info(f"Started central management client for node {self.node_id}")
        except Exception as e:
            self.logger.error(f"Failed to start central management client: {e}")
            
    def register(self):
        """Register this node with the central management system."""
        try:
            # Load current config
            with open(self.local_config_path, 'r') as f:
                config_yaml = f.read()
                config = yaml.safe_load(config_yaml)
                
            # Extract instance pool information
            instance_pools = []
            for pool in config.get("pools", []):
                instance_pools.append({
                    "pool_id": pool["instance_pool_id"],
                    "region": pool["region"],
                    "compartment_id": pool["compartment_id"],
                    "display_name": pool.get("display_name", ""),
                    "min_instances": pool.get("min_instances", 1),
                    "max_instances": pool.get("max_instances", 10),
                    "current_instances": -1  # Will be updated in heartbeat
                })
            
            # Send registration request
            response = requests.post(
                f"{self.central_api_url}/api/register",
                headers={"Content-Type": "application/json"},
                json={
                    "hostname": self.hostname,
                    "ip_address": self._get_ip_address(),
                    "config": config_yaml,
                    "instance_pools": instance_pools
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                self.node_id = data["node_id"]
                self.api_key = data["api_key"]
                self.logger.info(f"Registered with central management as node {self.node_id}")
                
                # Save API key for future use
                self._save_api_key()
            else:
                self.logger.error(f"Failed to register with central management: {response.text}")
        except Exception as e:
            self.logger.error(f"Registration error: {e}")
            
    def heartbeat_loop(self):
        """Send periodic heartbeats to central management."""
        while not self.stop_event.is_set():
            try:
                self.send_heartbeat()
                self.check_config_updates()
                time.sleep(30)  # Send heartbeat every 30 seconds
            except Exception as e:
                self.logger.error(f"Error in heartbeat: {e}")
                time.sleep(60)  # Retry after a minute if there's an error
                
    def send_heartbeat(self):
        """Send a heartbeat to the central management system."""
        if not self.node_id or not self.api_key:
            return
            
        try:
            # Get instance counts from all pools
            instance_counts = self._get_instance_counts()
            
            # Send heartbeat
            response = requests.post(
                f"{self.central_api_url}/api/nodes/{self.node_id}/heartbeat",
                headers={"X-API-Key": self.api_key},
                json={
                    "uptime": self._get_uptime(),
                    "instance_counts": instance_counts
                }
            )
            
            if response.status_code != 200:
                self.logger.warning(f"Failed to send heartbeat: {response.status_code} - {response.text}")
        except Exception as e:
            self.logger.error(f"Error sending heartbeat: {e}")
        
    def check_config_updates(self):
        """Check for configuration updates from central management."""
        if not self.node_id or not self.api_key:
            return
            
        try:
            # Get current config version
            current_version = self._get_config_version()
            
            # Check for configuration updates
            response = requests.get(
                f"{self.central_api_url}/api/nodes/{self.node_id}/config",
                headers={"X-API-Key": self.api_key}
            )
            
            if response.status_code == 200:
                config_data = response.json()
                
                # Compare versions
                if config_data["version"] > current_version:
                    self.logger.info(f"New configuration available (v{config_data['version']})")
                    self.apply_config_update(config_data)
            else:
                self.logger.warning(f"Failed to check config updates: {response.status_code}")
        except Exception as e:
            self.logger.error(f"Error checking config updates: {e}")
        
    def apply_config_update(self, config_data):
        """Apply a new configuration from central management."""
        try:
            # Backup current config
            self._backup_config()
            
            # Write new config
            with open(self.local_config_path, 'w') as f:
                f.write(config_data["config"])
                
            self.logger.info(f"Applied new configuration (v{config_data['version']})")
            
            # Notify central system that config was applied
            requests.put(
                f"{self.central_api_url}/api/nodes/{self.node_id}/config/{config_data['config_id']}/applied",
                headers={"X-API-Key": self.api_key}
            )
            
            # TODO: Signal for config reload if needed
        except Exception as e:
            self.logger.error(f"Error applying config update: {e}")
    
    def send_metrics(self, instance_pool_id, cpu_util, memory_util, instance_count, 
                    scaling_event=False, scaling_direction=None, additional_data=None):
        """Send metrics to the central management system."""
        if not self.node_id or not self.api_key:
            return
            
        try:
            payload = {
                "instance_pool_id": instance_pool_id,
                "cpu_utilization": cpu_util,
                "memory_utilization": memory_util,
                "instance_count": instance_count,
                "scaling_event": scaling_event,
                "scaling_direction": scaling_direction,
                "additional_data": additional_data or {}
            }
            
            response = requests.post(
                f"{self.central_api_url}/api/nodes/{self.node_id}/metrics",
                headers={"X-API-Key": self.api_key},
                json=payload
            )
            
            if response.status_code != 200:
                self.logger.warning(f"Failed to send metrics: {response.status_code}")
        except Exception as e:
            self.logger.error(f"Error sending metrics: {e}")
    
    def stop(self):
        """Stop the central management client."""
        self.stop_event.set()
        self.logger.info("Stopped central management client")
    
    # Helper methods
    def _get_ip_address(self):
        """Get the IP address of this system."""
        try:
            import socket
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return "127.0.0.1"
    
    def _get_uptime(self):
        """Get system uptime in seconds."""
        try:
            from scheduler.utils.time_utils import get_uptime
            return get_uptime()
        except:
            return 0
    
    def _get_instance_counts(self):
        """Get number of instances in each pool."""
        try:
            with open(self.local_config_path, 'r') as f:
                config = yaml.safe_load(f)
            
            result = {}
            for pool in config.get("pools", []):
                # In a real implementation, this would query actual instance counts
                # For now, we'll use dummy values
                result[pool["instance_pool_id"]] = pool.get("current_instances", 1)
            
            return result
        except Exception as e:
            self.logger.error(f"Error getting instance counts: {e}")
            return {}
    
    def _get_config_version(self):
        """Get the current configuration version."""
        try:
            # In a real implementation, this might be stored in a state file
            # For now, just use 0 to always check for updates
            return 0
        except:
            return 0
    
    def _backup_config(self):
        """Create a backup of the current configuration."""
        try:
            import shutil
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            backup_path = f"{self.local_config_path}.{timestamp}.bak"
            shutil.copy2(self.local_config_path, backup_path)
            self.logger.info(f"Configuration backed up to {backup_path}")
        except Exception as e:
            self.logger.error(f"Error backing up config: {e}")
    
    def _save_api_key(self):
        """Save API key for future use."""
        try:
            # In a real implementation, this would be saved securely
            # For simplicity, we'll just log it for now
            self.logger.info(f"API key for node {self.node_id}: {self.api_key}")
        except:
            pass
