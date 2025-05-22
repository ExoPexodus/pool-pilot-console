
import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

interface InstancePool {
  id: number;
  pool_id: string;
  display_name: string;
  region: string;
  node_hostname: string;
  current_instances: number;
  min_instances: number;
  max_instances: number;
  last_scaled_at: string;
}

const InstancePools: React.FC = () => {
  const [pools, setPools] = useState<InstancePool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real application, fetch data from the API
    const fetchInstancePools = async () => {
      try {
        setLoading(true);
        
        // In a real app we would use apiClient instead of mocking data
        // const response = await apiClient.get('/instance-pools');
        
        // Mock data for now
        const mockPools: InstancePool[] = [
          {
            id: 1,
            pool_id: 'ocid1.instancepool.oc1..example1',
            display_name: 'Web Servers Pool',
            region: 'us-ashburn-1',
            node_hostname: 'autoscaler-east-1',
            current_instances: 4,
            min_instances: 2,
            max_instances: 8,
            last_scaled_at: '2023-04-25T14:30:00Z'
          },
          {
            id: 2,
            pool_id: 'ocid1.instancepool.oc1..example2',
            display_name: 'API Workers Pool',
            region: 'us-ashburn-1',
            node_hostname: 'autoscaler-east-1',
            current_instances: 2,
            min_instances: 1,
            max_instances: 4,
            last_scaled_at: '2023-04-24T10:15:00Z'
          },
          {
            id: 3,
            pool_id: 'ocid1.instancepool.oc1..example3',
            display_name: 'Database Cluster',
            region: 'us-phoenix-1',
            node_hostname: 'autoscaler-west-1',
            current_instances: 3,
            min_instances: 3,
            max_instances: 6,
            last_scaled_at: '2023-04-20T08:45:00Z'
          },
          {
            id: 4,
            pool_id: 'ocid1.instancepool.oc1..example4',
            display_name: 'Analytics Workers',
            region: 'eu-frankfurt-1',
            node_hostname: 'autoscaler-eu-1',
            current_instances: 5,
            min_instances: 2,
            max_instances: 10,
            last_scaled_at: '2023-04-22T16:20:00Z'
          },
        ];
        
        setPools(mockPools);
      } catch (error) {
        console.error('Error fetching instance pools:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstancePools();
  }, []);

  return (
    <div>
      <div className="header">
        <h1 className="text-2xl font-bold">Instance Pools</h1>
      </div>
      
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-400 border-t-transparent"></div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Managed By</th>
                <th>Current Instances</th>
                <th>Scaling Range</th>
                <th>Last Scaled</th>
              </tr>
            </thead>
            <tbody>
              {pools.map(pool => (
                <tr key={pool.id}>
                  <td className="font-medium">{pool.display_name}</td>
                  <td>{pool.region}</td>
                  <td>{pool.node_hostname}</td>
                  <td className="text-center font-medium text-teal-400">{pool.current_instances}</td>
                  <td>{pool.min_instances} - {pool.max_instances}</td>
                  <td>{new Date(pool.last_scaled_at).toLocaleString()}</td>
                </tr>
              ))}
              {pools.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No instance pools found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InstancePools;
