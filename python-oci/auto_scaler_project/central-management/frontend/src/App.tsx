
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Nodes from './pages/Nodes';
import NodeDetails from './pages/NodeDetails';
import InstancePools from './pages/InstancePools';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="nodes" element={<Nodes />} />
        <Route path="nodes/:nodeId" element={<NodeDetails />} />
        <Route path="instance-pools" element={<InstancePools />} />
      </Route>
    </Routes>
  );
}

export default App;
