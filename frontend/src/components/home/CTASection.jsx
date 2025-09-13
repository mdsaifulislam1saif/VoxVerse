import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/config';

const CTASection = () => {
  return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already converting text to audio with ease.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={ROUTES.REGISTER}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg font-medium text-lg"
              >
                Create Free Account
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg font-medium text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
  );
};

export default CTASection;
