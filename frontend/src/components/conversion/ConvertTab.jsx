import { useState } from 'react';
import { Mic } from 'lucide-react';
import FileUpload from './FileUpload';
import LanguageSelector from './LanguageSelector';
import AudioPlayer from './AudioPlayer';
import { useTextToAudio } from '../../hook/useTextToAudio';
import LoadingOverlay from '../progress/LoadingOverlay';

export const ConvertTab = () => {
  // Local state for text input and selected language
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  // Custom hook for text-to-audio conversion
  const { 
    audioUrl,         // URL of generated audio file
    convertLoading,   // Whether conversion is in progress
    convertProgress,  // Progress percentage of conversion
    convertTextToAudio // Function to trigger conversion
  } = useTextToAudio();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* === Left Column: File Upload Section === */}
      {/* Upload a file (PDF, image, etc.), extract text, and set into text state */}
      <FileUpload setText={setText} selectedLanguage={selectedLanguage} />
      {/* === Right Column: Text Input + Conversion Section === */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        {/* Section Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Text to Convert</h2>
        {/* Language Selection Dropdown */}
        <div className="mb-6 w-full md:w-1/2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
        {/* Text Area for Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-4 text-gray-800 border rounded-lg mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type or paste your text..."
        />
        {/* Convert Button */}
        <button
          onClick={() => convertTextToAudio(text, selectedLanguage)}
          disabled={convertLoading || !text.trim()}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {/* Icon spins while loading */}
          {convertLoading ? <Mic className="mr-2 animate-spin" size={20} /> : <Mic className="mr-2" size={20} />}
          Convert to Audio
        </button>
        {/* Show audio player only if an audio file is available */}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>
      {/* === Loading Overlay === */}
      {convertLoading && (
        <LoadingOverlay
          title="Converting Your Content"
          description="Please wait while we process your text to audio"
          progress={convertProgress}
        />
      )}
    </div>
  );
};
