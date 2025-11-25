import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // --- Simple Hardcoded Auth ---
    // In a real app, we would send a POST request to your backend here
    if (email === 'admin@dummy.com' && password === '123456') {
      // 1. Save session with sample token
      sessionStorage.setItem('authToken', 'sample-token-123');
      // 2. Redirect to Dashboard to show tasks
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-6">Please sign in to your account</p>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@dummy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-xs text-gray-400">
          Hint: Use admin@dummy.com / 123456
        </p>
      </div>
    </div>
  );
}

export default LoginPage;