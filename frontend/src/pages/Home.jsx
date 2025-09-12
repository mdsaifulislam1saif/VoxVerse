import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Mic, FileText, Upload, Download, Play, Users } from 'lucide-react';
import { ROUTES } from '@utils/constants';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600" />,
      title: 'Multiple File Formats',
      description: 'Support for PDF documents and various image formats for text extraction.'
    },
    {
      icon: <Mic className="h-8 w-8 text-green-600" />,
      title: 'Text to Speech',
      description: 'Convert any text to natural-sounding audio in multiple languages.'
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      title: 'Smart Summarization',
      description: 'Generate concise summaries and convert them to audio automatically.'
    },
    {
      icon: <Download className="h-8 w-8 text-orange-600" />,
      title: 'Export & Download',
      description: 'Download your audio files in MP3 format for offline listening.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Transform Text into{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Audio
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Convert documents, images, and text into natural-sounding audio with advanced 
            AI-powered summarization and multi-language support.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.CONVERTER}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg"
              >
                Start Converting
              </Link>
              <Link
                to={ROUTES.HISTORY}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg"
              >
                View History
              </Link>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg"
              >
                Get Started
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to convert text to audio efficiently and effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to convert your text to audio in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload or Type</h3>
            <p className="text-gray-600">
              Upload PDF documents, images, or directly type your text content.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Options</h3>
            <p className="text-gray-600">
              Select language, summary type, and conversion preferences.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Download Audio</h3>
            <p className="text-gray-600">
              Listen to your audio and download it for offline use.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
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
      )}
    </div>
  );
};

export default Home;