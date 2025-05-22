from collectors.base_collector import MetricsCollector
from instance_manager.instance_pool import get_instances_from_instance_pool
import logging
from datetime import datetime, timedelta
import oci
from oci.monitoring import MonitoringClient
import sys

class OCIMetricsCollector(MetricsCollector):
    def __init__(self, monitoring_client, compute_management_client, instance_manager, instance_pool_id, compartment_id):
        """
        Initialize the OCI Metrics Collector.

        Args:
            monitoring_client: OCI MonitoringClient instance.
            compute_management_client: OCI ComputeManagementClient instance.
            instance_manager: InstanceManager to fetch instance details from a pool.
            instance_pool_id: OCID of the instance pool.
            compartment_id: OCID of the compartment.
        """
        logging.debug(f"Initializing OCIMetricsCollector with monitoring_client={type(monitoring_client)}, "
                      f"compute_management_client={type(compute_management_client)}, "
                      f"instance_pool_id={instance_pool_id}, compartment_id={compartment_id}")
        self.monitoring_client = monitoring_client  # For fetching metrics
        self.compute_management_client = compute_management_client  # For instance pool operations
        self.instance_manager = instance_manager
        self.instance_pool_id = instance_pool_id
        self.compartment_id = compartment_id

    def fetch_instance_metrics(self, instance_id):
        """
        Fetch metrics (CPU and RAM utilization) for a specific instance.

        Args:
            instance_id: OCID of the instance.

        Returns:
            Tuple (cpu_utilization, memory_utilization).
        """
        try:
            namespace = "oci_computeagent"
            end_time = datetime.utcnow()
            start_time = end_time - timedelta(minutes=5)

            # Fetch CPU utilization
            cpu_query = f"CpuUtilization[5m]{{resourceId = \"{instance_id}\"}}.max()"
            cpu_response = self.monitoring_client.summarize_metrics_data(
                compartment_id=self.compartment_id,
                summarize_metrics_data_details=oci.monitoring.models.SummarizeMetricsDataDetails(
                    namespace=namespace,
                    query=cpu_query,
                    start_time=start_time,
                    end_time=end_time,
                    resolution="5m"
                )
            )

            # Fetch Memory utilization
            memory_query = f"MemoryUtilization[5m]{{resourceId = \"{instance_id}\"}}.max()"
            memory_response = self.monitoring_client.summarize_metrics_data(
                compartment_id=self.compartment_id,
                summarize_metrics_data_details=oci.monitoring.models.SummarizeMetricsDataDetails(
                    namespace=namespace,
                    query=memory_query,
                    start_time=start_time,
                    end_time=end_time,
                    resolution="5m"
                )
            )

            cpu_utilization = (
                cpu_response.data[0].aggregated_datapoints[0].value
                if cpu_response.data else 0
            )
            memory_utilization = (
                memory_response.data[0].aggregated_datapoints[0].value
                if memory_response.data else 0
            )

            return cpu_utilization, memory_utilization
        except Exception as e:
            logging.error(f"Failed to fetch metrics for instance {instance_id}: {e}")
            return 0, 0

    def get_metrics(self):
        """
        Fetch average CPU and RAM utilization across all instances in the pool.

        Returns:
            Tuple (avg_cpu_utilization, avg_memory_utilization).
        Raises:
            RuntimeError: If metrics cannot be fetched for any critical reason.
        """
        try:
            logging.debug(f"Starting metric collection for instance pool: {self.instance_pool_id}")

            # Fetch all instances in the pool
            instances = get_instances_from_instance_pool(
                self.compute_management_client,  # Pass the correct client here
                self.instance_pool_id,
                self.compartment_id
            )

            if not instances:
                raise RuntimeError(f"No instances found in pool {self.instance_pool_id}. Terminating execution.")

            logging.debug(f"Instances found: {[instance.id for instance in instances]}")

            total_cpu = 0
            total_memory = 0
            instance_count = len(instances)
            logging.debug(f"Number of instances in pool: {instance_count}")

            # Fetch metrics for each instance
            for instance in instances:
                instance_id = instance.id
                logging.debug(f"Fetching metrics for instance: {instance_id}")

                try:
                    cpu, memory = self.fetch_instance_metrics(instance_id)
                    logging.debug(f"Metrics for instance {instance_id} - CPU: {cpu}%, RAM: {memory}%")

                    total_cpu += cpu
                    total_memory += memory
                except Exception as metric_error:
                    raise RuntimeError(
                        f"Failed to fetch metrics for instance {instance_id}: {metric_error}"
                    )

            avg_cpu = total_cpu / instance_count if instance_count > 0 else 0
            avg_memory = total_memory / instance_count if instance_count > 0 else 0

            logging.info(f"Average CPU: {avg_cpu}%, Average RAM: {avg_memory}%")
            return avg_cpu, avg_memory

        except RuntimeError as re:
            logging.error(f"RuntimeError while fetching OCI metrics: {re}")
            sys.exit(1)
            raise  # Re-raise the RuntimeError to halt execution
        except Exception as e:
            logging.error(f"Unexpected error while fetching OCI metrics for pool {self.instance_pool_id}: {e}")
            raise RuntimeError(f"Critical failure in metrics collection: {e}")