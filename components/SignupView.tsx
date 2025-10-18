import React, { useState } from 'react';
import { User } from '../types';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import AuthLayout from './AuthLayout';
import * as api from '../services/apiService';

interface SignupViewProps {
  onSignupSuccess: (user: User, token: string) => void;
  switchToLogin: () => void;
}

const SignupView: React.FC<SignupViewProps> = ({ onSignupSuccess, switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    return regex.test(pass);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one letter and one number.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
        const { user, token } = await api.signup({ name, email, phone, password });
        onSignupSuccess(user, token);
    } catch(err: any) {
        setError(err.message || 'Signup failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSignup} className="space-y-4">
        {error && <p className="text-red-300 bg-red-800/50 p-2 rounded-md text-center">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-gray-200" placeholder="Your Name" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-gray-200" placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-gray-200" placeholder="+91 ..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-gray-200" placeholder="********" />
          <PasswordStrengthMeter password={password} />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-gray-200" placeholder="********" />
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors disabled:bg-gray-400">
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <p className="text-sm text-center">
          Already have an account?{' '}
          <button type="button" onClick={switchToLogin} className="font-semibold hover:underline" disabled={isLoading}>
            Log In
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupView;