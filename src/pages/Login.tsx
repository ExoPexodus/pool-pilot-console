
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple mock authentication (replace with actual API call)
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('username', username);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1523] p-4">
      <div className="w-full max-w-md">
        <div className="text-left mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">AutoScaler</h1>
          <p className="text-gray-400">Central Management Console</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="bg-[#1a1f2e] border border-gray-800 rounded-md p-6 shadow-lg">
          <div className="mb-4">
            <Label htmlFor="username" className="text-gray-300 mb-1">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-[#131722] border-gray-700 text-white"
              placeholder="admin"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="password" className="text-gray-300 mb-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#131722] border-gray-700 text-white"
              placeholder="••••••••"
            />
            <p className="mt-2 text-xs text-gray-500">
              Default credentials: admin / admin
            </p>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
