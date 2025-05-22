
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Node {
  node_id: string;
  hostname: string;
  status: string;
  ip_address: string;
  last_seen: string;
  created_at: string;
  api_key: string;
  config?: string;
}

interface InstancePool {
  id: number;
  pool_id: string;
  display_name: string;
  region: string;
  current_instances: number;
  min_instances: number;
  max_instances: number;
}

const NodeDetails: React.FC = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const navigate = useNavigate();
  
  const [node, setNode] = useState<Node | null>(null);
  const [instancePools, setInstancePools] = useState<InstancePool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (nodeId === 'new') {
      setLoading(false);
      return;
    }

    const fetchNodeDetails = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with actual API calls
        // const nodeResponse = await axios.get(`/api/nodes/${nodeId}`);
        // const poolsResponse = await axios.get(`/api/nodes/${nodeId}/instance-pools`);
        
        // Mock data for now
        if (nodeId) {
          const mockNode: Node = {
            node_id: nodeId,
            hostname: `autoscaler-${nodeId}`,
            status: 'active',
            ip_address: '192.168.1.100',
            last_seen: new Date().toISOString(),
            created_at: '2023-03-15T10:00:00Z',
            api_key: '8f7h3d9s8f7h3d9s8f7h3d9s8f7h3d9s',
            config: JSON.stringify({
              polling_interval: 60,
              metrics_retention: 86400,
              log_level: 'info'
            }, null, 2)
          };
          
          const mockPools: InstancePool[] = [
            {
              id: 1,
              pool_id: 'ocid1.instancepool.oc1..example1',
              display_name: 'Web Servers Pool',
              region: 'us-ashburn-1',
              current_instances: 4,
              min_instances: 2,
              max_instances: 8
            },
            {
              id: 2,
              pool_id: 'ocid1.instancepool.oc1..example2',
              display_name: 'API Workers Pool',
              region: 'us-ashburn-1',
              current_instances: 2,
              min_instances: 1,
              max_instances: 4
            }
          ];
          
          setNode(mockNode);
          setInstancePools(mockPools);
        }
      } catch (error) {
        console.error('Error fetching node details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNodeDetails();
  }, [nodeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would send data to the API
    alert('Node registration functionality would be implemented here!');
    navigate('/nodes');
  };

  if (nodeId === 'new') {
    return (
      <div>
        <div className="header">
          <h1>Register New Node</h1>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="hostname">Hostname</label>
              <input type="text" className="form-control" id="hostname" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="ip_address">IP Address</label>
              <input type="text" className="form-control" id="ip_address" />
            </div>
            
            <div className="form-group">
              <label htmlFor="config">Configuration JSON</label>
              <textarea 
                className="form-control" 
                id="config" 
                rows={8}
                placeholder="Enter node configuration as JSON"
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary">Register Node</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!node) {
    return <div>Node not found</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>{node.hostname}</h1>
        <div>
          <span 
            className={`status-indicator status-${
              node.status === 'active' ? 'healthy' : 
              node.status === 'warning' ? 'warning' : 'critical'
            }`}
          ></span>
          {node.status}
        </div>
      </div>
      
      <div className="card">
        <h2>Node Information</h2>
        <table className="table">
          <tbody>
            <tr>
              <td><strong>Node ID</strong></td>
              <td>{node.node_id}</td>
            </tr>
            <tr>
              <td><strong>IP Address</strong></td>
              <td>{node.ip_address}</td>
            </tr>
            <tr>
              <td><strong>Last Seen</strong></td>
              <td>{new Date(node.last_seen).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Created</strong></td>
              <td>{new Date(node.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>API Key</strong></td>
              <td>
                <code>{node.api_key.substring(0, 8)}...</code>
                <button className="btn btn-primary" style={{ marginLeft: 10 }}>
                  Regenerate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="card">
        <h2>Configuration</h2>
        <pre>{node.config}</pre>
        <button className="btn btn-primary">Edit Configuration</button>
      </div>
      
      <div className="card">
        <div className="header">
          <h2>Instance Pools</h2>
          <button className="btn btn-primary">Add Instance Pool</button>
        </div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>Current Instances</th>
              <th>Scaling Range</th>
            </tr>
          </thead>
          <tbody>
            {instancePools.map(pool => (
              <tr key={pool.id}>
                <td>{pool.display_name}</td>
                <td>{pool.region}</td>
                <td>{pool.current_instances}</td>
                <td>{pool.min_instances} - {pool.max_instances}</td>
              </tr>
            ))}
            {instancePools.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  No instance pools configured for this node.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NodeDetails;
