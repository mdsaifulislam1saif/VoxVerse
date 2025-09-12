import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Mic, User, LogOut, FileText, Home } from 'lucide-react';
import { ROUTES } from '@utils/constants';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link to={ROUTES.HOME} className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Text to Audio Converter
            </h1>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link
              to={ROUTES.HOME}
              className="flex items-center text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.CONVERTER}
                  className="flex items-center text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Converter
                </Link>
                
                <Link
                  to={ROUTES.HISTORY}
                  className="flex items-center text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  History
                </Link>
                
                <Link
                  to={ROUTES.PROFILE}
                  className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">{user?.full_name || user?.username}</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;