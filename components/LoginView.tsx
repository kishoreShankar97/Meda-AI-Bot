import React, { useState } from 'react';
import { User } from '../types';
import AuthLayout from './AuthLayout';
import * as api from '../services/apiService';

interface LoginViewProps {
  onLoginSuccess: (user: User, token: string) => void;
  switchToSignup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, switchToSignup }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Phone number and password are required.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
      const { user, token } = await api.login(phone, password);
      onLoginSuccess(user, token);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleLogin} className="space-y-6">
        {error && <p className="text-red-300 bg-red-800/50 p-2 rounded-md text-center">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-gray-200" placeholder="+91 ..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-gray-200" placeholder="********" />
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors disabled:bg-gray-400">
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <button type="button" onClick={switchToSignup} className="font-semibold hover:underline" disabled={isLoading}>
            Sign Up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginView;