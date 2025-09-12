import { Mic, User, LogOut } from 'lucide-react';

const Header = ({ user, logout }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Text to Audio Converter
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            {user && (
              <div className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{user.full_name || user.username}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition duration-200"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;