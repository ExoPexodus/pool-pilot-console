
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-[#0f1523] text-white">
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#131722] border-r border-[#2a3042] transition-all duration-300`}>
        <div className="p-4 border-b border-[#2a3042] flex items-center justify-between">
          {!sidebarCollapsed ? (
            <h1 className="text-xl font-semibold text-teal-400">AutoScaler</h1>
          ) : (
            <h1 className="text-xl font-semibold text-teal-400">AS</h1>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="mt-5">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-2 hover:bg-[#212637] ${
                  location.pathname === '/' ? 'bg-[#212637] border-l-4 border-teal-400 pl-3' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/nodes" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-2 hover:bg-[#212637] ${
                  location.pathname.startsWith('/nodes') ? 'bg-[#212637] border-l-4 border-teal-400 pl-3' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Nodes</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/instance-pools" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-2 hover:bg-[#212637] ${
                  location.pathname.startsWith('/instance-pools') ? 'bg-[#212637] border-l-4 border-teal-400 pl-3' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Instance Pools</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-[#131722] border-b border-[#2a3042] p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname.startsWith('/nodes') && (location.pathname === '/nodes' ? 'Nodes' : 'Node Details')}
            {location.pathname === '/instance-pools' && 'Instance Pools'}
          </h2>
          
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-1 bg-[#212637] hover:bg-[#2a3042] px-3 py-2 rounded-md transition"
            >
              <span className="text-sm">{user?.username || 'User'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#131722] rounded-md shadow-lg border border-[#2a3042] py-1 z-10">
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#212637]"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-[#0f1523] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
