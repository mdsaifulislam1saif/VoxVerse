import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, Volume2, Square } from 'lucide-react';

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  // Update audio progress
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setAudioProgress((audioRef.current.currentTime / audioDuration) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setAudioDuration(audioRef.current.duration);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'converted_audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden mt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Play className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Audio Player</h3>
            <p className="text-gray-600">Play and download your converted audio</p>
          </div>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="p-6 space-y-6">
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            {/* Playback Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayback}
                className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={stopAudio}
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-transform active:scale-95"
              >
                <Square className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2 text-gray-600">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(audioDuration)}
                </span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadAudio}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${audioProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
