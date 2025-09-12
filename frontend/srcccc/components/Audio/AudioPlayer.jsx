import { Play } from 'lucide-react';
import AudioControls from './AudioControls';

const AudioPlayer = ({ 
  audioUrl, 
  audioRef, 
  isPlaying, 
  togglePlayback, 
  downloadAudio, 
  setIsPlaying 
}) => {
  if (!audioUrl) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
          <Play className="text-white" size={16} />
        </div>
        Audio Player
      </h3>
      
      <AudioControls
        isPlaying={isPlaying}
        togglePlayback={togglePlayback}
        downloadAudio={downloadAudio}
      />
      
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        className="w-full"
        controls
      />
    </div>
  );
};

export default AudioPlayer;