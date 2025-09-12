import { Mic } from 'lucide-react';
import PasswordInput from './PasswordInput';
import Loader from '../Loader';

const AuthForm = ({ 
  authMode, 
  authData, 
  setAuthData, 
  showPassword, 
  setShowPassword, 
  loading, 
  handleAuth, 
  switchAuthMode 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {authMode === 'login' ? 'Sign in to convert text to audio' : 'Join us to get started'}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={authData.username}
              onChange={(e) => setAuthData({...authData, username: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your username"
            />
          </div>

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={authData.full_name}
                  onChange={(e) => setAuthData({...authData, full_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <PasswordInput
              value={authData.password}
              onChange={(e) => setAuthData({...authData, password: e.target.value})}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition duration-200 font-medium"
          >
            {loading && <Loader className="mr-2" />}
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={switchAuthMode}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
          >
            {authMode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;