import { useState } from 'react';
import { Mic } from 'lucide-react';
import FileUpload from './FileUpload';
import LanguageSelector from './LanguageSelector';
import AudioPlayer from './AudioPlayer';
import { useTextToAudio } from '../../hook/useTextToAudio';
import LoadingOverlay from '../progress/LoadingOverlay';

export const ConvertTab = () => {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { audioUrl, convertLoading, convertProgress, convertTextToAudio } = useTextToAudio();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* File Upload */}
      <FileUpload setText={setText} selectedLanguage={selectedLanguage} />

      {/* Text + Convert Section */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Text to Convert</h2>

        <div className="mb-6 w-full md:w-1/2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-4 text-gray-800 border rounded-lg mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type or paste your text..."
        />

        <button
          onClick={() => convertTextToAudio(text, selectedLanguage)}
          disabled={convertLoading || !text.trim()}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {convertLoading ? <Mic className="mr-2 animate-spin" size={20} /> : <Mic className="mr-2" size={20} />}
          Convert to Audio
        </button>

        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>

      {/* Loading Overlay */}
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
