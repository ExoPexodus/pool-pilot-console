
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Types
interface NodeSummary {
  node_id: string;
  hostname: string;
  status: string;
  last_seen: string;
}

interface MetricSummary {
  total_nodes: number;
  active_nodes: number;
  total_instance_pools: number;
  total_instances: number;
}

const Dashboard: React.FC = () => {
  const [nodes, setNodes] = useState<NodeSummary[]>([]);
  const [metrics, setMetrics] = useState<MetricSummary>({
    total_nodes: 0,
    active_nodes: 0,
    total_instance_pools: 0,
    total_instances: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real application, fetch data from the API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock data for now
        const mockNodes: NodeSummary[] = [
          { 
            node_id: 'node-1', 
            hostname: 'autoscaler-east-1', 
            status: 'active', 
            last_seen: new Date().toISOString() 
          },
          { 
            node_id: 'node-2', 
            hostname: 'autoscaler-west-1', 
            status: 'active', 
            last_seen: new Date().toISOString() 
          },
          { 
            node_id: 'node-3', 
            hostname: 'autoscaler-eu-1', 
            status: 'warning', 
            last_seen: '2023-04-20T10:30:00Z' 
          },
        ];
        
        const mockMetrics: MetricSummary = {
          total_nodes: 3,
          active_nodes: 2,
          total_instance_pools: 5,
          total_instances: 24
        };
        
        setNodes(mockNodes);
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="header">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <Link to="/nodes/new" className="btn btn-primary">Add Node</Link>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Nodes</h3>
          <p>{metrics.total_nodes}</p>
        </div>
        <div className="metric-card">
          <h3>Active Nodes</h3>
          <p>{metrics.active_nodes}</p>
        </div>
        <div className="metric-card">
          <h3>Instance Pools</h3>
          <p>{metrics.total_instance_pools}</p>
        </div>
        <div className="metric-card">
          <h3>Total Instances</h3>
          <p>{metrics.total_instances}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Nodes</h2>
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-400 border-t-transparent"></div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Hostname</th>
                <th>Last Seen</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(node => (
                <tr key={node.node_id}>
                  <td>
                    <span 
                      className={`status-indicator status-${node.status === 'active' ? 'healthy' : 'warning'}`}
                    ></span>
                    {node.status}
                  </td>
                  <td>{node.hostname}</td>
                  <td>{new Date(node.last_seen).toLocaleString()}</td>
                  <td>
                    <Link to={`/nodes/${node.node_id}`}>View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-header">
            <h3>CPU Usage</h3>
          </div>
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>Chart Placeholder</p>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h3>Memory Usage</h3>
          </div>
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
