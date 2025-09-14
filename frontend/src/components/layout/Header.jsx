import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Mic, User, LogOut, FileText, Home, Menu, X, LogIn } from 'lucide-react';
import { ROUTES } from '../../config/config';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Auth state and logout function
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [menuOpen, setMenuOpen] = React.useState(false); // Mobile menu toggle state
  // Handle logout and redirect to home
  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      {/* Container: centers content with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Text to Audio
            </h1>
          </Link>
          {/* Desktop Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Home Link */}
            <NavLink
              to={ROUTES.HOME}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-gray-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                {/* Authenticated User Links */}
                <NavLink
                  to={ROUTES.CONVERTER}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-gray-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Converter
                </NavLink>
                <NavLink
                  to={ROUTES.HISTORY}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-gray-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  <FileText className="h-5 w-5 mr-2" />
                  History
                </NavLink>
                <NavLink
                  to={ROUTES.PROFILE}
                  className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  {user?.full_name || user?.username}
                </NavLink>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              /* Login Link for guests */
              <NavLink
                to={ROUTES.LOGIN}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </NavLink>
            )}
          </nav>
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu (visible when menuOpen is true) */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <nav className="p-4 space-y-2">
            {/* Home Link */}
            <NavLink
              to={ROUTES.HOME}
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                {/* Authenticated User Links */}
                <NavLink
                  to={ROUTES.CONVERTER}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Converter
                </NavLink>
                <NavLink
                  to={ROUTES.HISTORY}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  History
                </NavLink>
                <NavLink
                  to={ROUTES.PROFILE}
                  className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  {user?.full_name || user?.username}
                </NavLink>
                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              /* Login Link for guests */
              <NavLink
                to={ROUTES.LOGIN}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;
