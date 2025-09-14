import { useState } from 'react';
import { Mic, FileText } from 'lucide-react';
import { ConvertTab } from '../conversion/ConvertTab';
import { SummarizeTab } from '../summary/SummarizeTab';

const Converter = () => {
  const [activeTab, setActiveTab] = useState('convert');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {/* Text to Audio Tab */}
            <button
              onClick={() => setActiveTab('convert')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'convert'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' // Active tab styling
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50' // Inactive tab styling
              }`}
            >
              <div className="flex items-center justify-center">
                <Mic className="mr-2" size={20} />
                Text to Audio
              </div>
            </button>
            {/* Summarize & Audio Tab */}
            <button
              onClick={() => setActiveTab('summarize')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'summarize'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-500' // Active tab styling
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50' // Inactive tab styling
              }`}
            >
              <div className="flex items-center justify-center">
                <FileText className="mr-2" size={20} /> {/* Icon */}
                Summarize & Audio
              </div>
            </button>
          </nav>
        </div>
      </div>
      {/* Tab Content: conditionally render based on activeTab */}
      {activeTab === 'convert' ? <ConvertTab /> : <SummarizeTab />}
    </div>
  );
};
export default Converter;
