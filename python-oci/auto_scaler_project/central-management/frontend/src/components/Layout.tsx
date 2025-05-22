
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-teal-400">AutoScaler</h1>
        </div>
        <nav className="mt-5">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/" 
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  location.pathname === '/' ? 'bg-gray-700 border-l-4 border-teal-400 pl-3' : ''
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/nodes" 
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  location.pathname.startsWith('/nodes') ? 'bg-gray-700 border-l-4 border-teal-400 pl-3' : ''
                }`}
              >
                Nodes
              </Link>
            </li>
            <li>
              <Link 
                to="/instance-pools" 
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  location.pathname.startsWith('/instance-pools') ? 'bg-gray-700 border-l-4 border-teal-400 pl-3' : ''
                }`}
              >
                Instance Pools
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname.startsWith('/nodes') && (location.pathname === '/nodes' ? 'Nodes' : 'Node Details')}
            {location.pathname === '/instance-pools' && 'Instance Pools'}
          </h2>
          
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md transition"
            >
              <span className="text-sm">{user?.username}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 py-1">
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
