
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Node {
  node_id: string;
  hostname: string;
  status: string;
  last_seen: string;
  created_at: string;
}

const Nodes: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, fetch data from the API
    const fetchNodes = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with actual API call
        // const response = await axios.get('/api/nodes');
        
        // Mock data for now
        const mockNodes: Node[] = [
          { 
            node_id: 'node-1', 
            hostname: 'autoscaler-east-1', 
            status: 'active', 
            last_seen: new Date().toISOString(),
            created_at: '2023-03-15T10:00:00Z'
          },
          { 
            node_id: 'node-2', 
            hostname: 'autoscaler-west-1', 
            status: 'active', 
            last_seen: new Date().toISOString(),
            created_at: '2023-03-10T08:30:00Z'
          },
          { 
            node_id: 'node-3', 
            hostname: 'autoscaler-eu-1', 
            status: 'warning', 
            last_seen: '2023-04-20T10:30:00Z',
            created_at: '2023-02-20T14:15:00Z'
          },
          { 
            node_id: 'node-4', 
            hostname: 'autoscaler-ap-1', 
            status: 'inactive', 
            last_seen: '2023-03-25T18:45:00Z',
            created_at: '2023-01-05T09:20:00Z'
          },
        ];
        
        setNodes(mockNodes);
      } catch (error) {
        console.error('Error fetching nodes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNodes();
  }, []);

  return (
    <div>
      <div className="header">
        <h1>Autoscaler Nodes</h1>
        <Link to="/nodes/new" className="btn btn-primary">Register New Node</Link>
      </div>
      
      <div className="card node-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Hostname</th>
                <th>Last Seen</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(node => (
                <tr key={node.node_id}>
                  <td>
                    <span 
                      className={`status-indicator status-${
                        node.status === 'active' ? 'healthy' : 
                        node.status === 'warning' ? 'warning' : 'critical'
                      }`}
                    ></span>
                    {node.status}
                  </td>
                  <td>{node.hostname}</td>
                  <td>{new Date(node.last_seen).toLocaleString()}</td>
                  <td>{new Date(node.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/nodes/${node.node_id}`}>View Details</Link>
                  </td>
                </tr>
              ))}
              {nodes.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    No nodes found. Register a new node to get started.
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

export default Nodes;
