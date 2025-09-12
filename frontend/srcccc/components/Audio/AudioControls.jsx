import { Play, Pause, Download } from 'lucide-react';

const AudioControls = ({ 
  isPlaying, 
  togglePlayback, 
  downloadAudio 
}) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <button
        onClick={togglePlayback}
        className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-lg"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button
        onClick={downloadAudio}
        className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 font-medium"
      >
        <Download className="mr-2" size={16} />
        Download
      </button>
    </div>
  );
};

export default AudioControls;