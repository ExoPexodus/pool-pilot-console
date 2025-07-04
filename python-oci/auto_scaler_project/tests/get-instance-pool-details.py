# This is an automatically generated code sample.
# To make this code sample work in your Oracle Cloud tenancy,
# please replace the values for any parameters whose current values do not fit
# your use case (such as resource IDs, strings containing ‘EXAMPLE’ or ‘unique_id’, and
# boolean, number, and enum parameters with values not fitting your use case).

import oci

# Create a default config using DEFAULT profile in default location
# Refer to
# https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm#SDK_and_CLI_Configuration_File
# for more info
config = oci.config.from_file("/Users/rushil/.oci/config", "DEFAULT")


# Initialize service client with default config file
core_client = oci.core.ComputeManagementClient(config)

instance_pool_id="ocid1.instancepool.oc1.ap-mumbai-1.aaaaaaaa4xvc4uehki2wh2fqk7m47t7j6qy4f75swhzcli7ofszrxxswwaea"
# Send the request to service, some parameters are not required, see API
# doc for more info
get_instance_configuration_response = core_client.get_instance_pool(instance_pool_id=instance_pool_id)

# Get the data from response
print(get_instance_configuration_response.data)