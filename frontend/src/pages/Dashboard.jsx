import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, Mic, Play, Pause, Download, Loader2 } from 'lucide-react';
import * as conversionService from '../services/conversionService';
import * as extractService from '../services/extractService';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh-cn', name: 'Chinese (Simplified)', flag: '🇨🇳' },
];

const Dashboard = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    setUploadLoading(true);
    setError('');

    try {
      const extractFn = type === 'pdf' ? extractService.extractFromPDF : extractService.extractFromImage;
      const result = await extractFn(file, language);
      setText(result.text);
    } catch (error) {
      setError(`Failed to extract text: ${error.message}`);
    } finally {
      setUploadLoading(false);
    }
  };

  const convertToAudio = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const conversion = await conversionService.convertText({
        text: text.trim(),
        language,
        speed: 1.0,
        format: 'mp3'
      });

      const audioBlob = await conversionService.streamAudio(conversion.id);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      setError(`Failed to convert text: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'converted_audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Convert Text to Audio</h1>
        <p className="text-gray-600">Upload files or enter text to generate high-quality audio</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Upload className="mr-3 text-blue-600" size={24} />
              Upload Files
            </h2>
            
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-colors">
                {uploadLoading ? (
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                ) : (
                  <>
                    <FileText className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Upload PDF</span>
                    <span className="text-xs text-gray-500">Click to browse</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'pdf')}
                  disabled={uploadLoading}
                />
              </label>

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-400 transition-colors">
                {uploadLoading ? (
                  <Loader2 className="animate-spin h-8 w-8 text-green-500" />
                ) : (
                  <>
                    <Image className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Upload Image</span>
                    <span className="text-xs text-gray-500">JPG, PNG, WEBP</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.bmp,.tiff,.webp"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'image')}
                  disabled={uploadLoading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Text Processing */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Text to Convert</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here, or upload a file to extract text automatically..."
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
              />
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={convertToAudio}
                disabled={loading || !text.trim()}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  <Mic className="mr-2" size={20} />
                )}
                Convert to Audio
              </button>
            </div>

            {audioUrl && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Play className="text-white" size={16} />
                  </div>
                  Audio Player
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={togglePlayback}
                    className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-lg"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button
                    onClick={downloadAudio}
                    className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    <Download className="mr-2" size={16} />
                    Download
                  </button>
                </div>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full"
                  controls
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;