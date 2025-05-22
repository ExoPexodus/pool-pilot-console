
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  
  return (
    <div>
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>AutoScaler</h1>
        </div>
        <ul className="sidebar-nav">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/nodes" 
              className={location.pathname.startsWith('/nodes') ? 'active' : ''}
            >
              Nodes
            </Link>
          </li>
          <li>
            <Link 
              to="/instance-pools" 
              className={location.pathname.startsWith('/instance-pools') ? 'active' : ''}
            >
              Instance Pools
            </Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
