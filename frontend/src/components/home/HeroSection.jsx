import { Link } from 'react-router-dom';
import { Mic } from 'lucide-react';
import { ROUTES } from '../../config/config';

const HeroSection = ({ isAuthenticated }) => {
  return (
    <div className="text-center mb-16">
      {/* Logo & Heading Section */}
      <div className="mb-8">
        {/* Logo circle with mic icon */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <Mic className="w-10 h-10 text-white" />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Transform Text into{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Audio
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Convert documents, images, and text into natural-sounding audio with advanced 
          AI-powered summarization and multi-language support.
        </p>
      </div>
      {/* Call-To-Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {isAuthenticated ? (
          // Buttons for authenticated users
          <>
            <Link
              to={ROUTES.CONVERTER}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl 
                         hover:bg-blue-700 transition-all duration-300 shadow-lg 
                         hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg"
            >
              Start Converting
            </Link>
            <Link
              to={ROUTES.HISTORY}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl 
                         hover:bg-blue-50 transition-all duration-300 shadow-lg 
                         hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg"
            >
              View History
            </Link>
          </>
        ) : (
          // Buttons for guest users
          <>
            <Link
              to={ROUTES.LOGIN}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl 
                         hover:bg-blue-700 transition-all duration-300 shadow-lg 
                         hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg"
            >
              Get Started
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl 
                         hover:bg-blue-50 transition-all duration-300 shadow-lg 
                         hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg"
            >
              Sign Up Free
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default HeroSection;
