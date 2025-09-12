import { Mic, FileText } from 'lucide-react';
import SummaryOptions from './SummaryOptions';
import SummaryResult from './SummaryResult';
import Loader from '../Loader';

const TextEditor = ({ 
  text, 
  setText, 
  summary,
  activeTab,
  selectedLanguage,
  setSelectedLanguage,
  selectedSummaryType,
  setSelectedSummaryType,
  loading,
  convertToAudio,
  convertToSummaryThenAudio
}) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Text Input */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {activeTab === 'convert' ? 'Text to Convert' : 'Text to Summarize'}
          </h2>
          
          <SummaryOptions
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedSummaryType={selectedSummaryType}
            setSelectedSummaryType={setSelectedSummaryType}
            activeTab={activeTab}
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here, or upload a file to extract text automatically..."
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200"
          />
        </div>

        <SummaryResult summary={summary} activeTab={activeTab} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {activeTab === 'convert' ? (
            <button
              onClick={() => convertToAudio(text)}
              disabled={loading || !text.trim()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              {loading ? (
                <Loader className="mr-2" />
              ) : (
                <Mic className="mr-2" size={20} />
              )}
              Convert to Audio
            </button>
          ) : (
            <button
              onClick={() => convertToSummaryThenAudio(text)}
              disabled={loading || !text.trim()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              {loading ? (
                <Loader className="mr-2" />
              ) : (
                <FileText className="mr-2" size={20} />
              )}
              Summarize & Convert
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;