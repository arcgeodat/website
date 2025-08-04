import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Library, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const timeout = (ms: number) =>
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Login timed out. Please try again later.'));
      }, ms);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await Promise.race([
        login(email, password),
        timeout(3000)
      ]);
      navigate('/dashboard');
    } catch (err) {
      console.log('Error message: ', error)
      // Handle error for best user experience
      if (err instanceof Error) {
        // If the error message is specific, show it; otherwise, show a generic message
        if (err.message.includes('timed out')) {
          setError('Login timed out. Please try again later.');
        } else if (err.message.toLowerCase().includes('401') || err.message.toLowerCase().includes('unauthorized')) {
          setError('Invalid email or password!');
        } else if (err.message.toLowerCase().includes('network error')) {
          setError('Server might be down. Please try again later')
        } else {
          setError(err.message || 'An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Library className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your LibraryMS account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(''); // Clear error on change
                  }}
                  onInvalid={e => {
                    e.preventDefault();
                    if (!email.includes('@')) {
                      setEmailError("Please include an '@' in the email address.");
                    } else {
                      setEmailError("Please enter a valid email address.");
                    }
                  }}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
              {emailError && (
                <div
                  className="flex items-center gap-2 mt-2 bg-gradient-to-r from-yellow-100 to-orange-50 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow animate-fade-in"
                  style={{ fontWeight: 500, fontSize: '0.97rem' }}
                >
                  <svg className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{emailError}</span>
                  <style>
                    {`
                      .animate-fade-in {
                        animation: fadeInLoginError 0.35s cubic-bezier(0.4,0,0.2,1);
                      }
                      @keyframes fadeInLoginError {
                        from { opacity: 0; transform: translateY(12px);}
                        to { opacity: 1; transform: translateY(0);}
                      }
                    `}
                  </style>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-3 bg-gradient-to-r from-red-100 to-pink-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl shadow-md mt-2 animate-fade-in"
                style={{ fontWeight: 500, fontSize: '1rem' }}
              >
                <svg className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
                <style>
                  {`
                    .animate-fade-in {
                      animation: fadeInLoginError 0.35s cubic-bezier(0.4,0,0.2,1);
                    }
                    @keyframes fadeInLoginError {
                      from { opacity: 0; transform: translateY(12px);}
                      to { opacity: 1; transform: translateY(0);}
                    }
                  `}
                </style>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-blue-800">
                <p><strong>Admin:</strong> admin@demo.com / password</p>
                <p><strong>Librarian:</strong> librarian@demo.com / password</p>
                <p><strong>User:</strong> user@demo.com / password</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;