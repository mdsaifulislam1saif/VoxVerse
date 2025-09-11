import React, { useState } from 'react';
import { Upload, FileText, Image, Type, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const SummarizeForm = () => {
  const [activeTab, setActiveTab] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Form states
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [summaryType, setSummaryType] = useState('brief');

  const API_BASE_URL = 'http://localhost:8000'; // Change this to your backend URL

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const summaryTypes = [
    { value: 'brief', label: 'Brief Summary' },
    { value: 'detailed', label: 'Detailed Summary' },
    { value: 'bullet_points', label: 'Bullet Points' }
  ];

  const handleFileChange = (file, type) => {
    setError(null);
    setResult(null);
    
    if (type === 'pdf') {
      setPdfFile(file);
    } else if (type === 'image') {
      setImageFile(file);
    }
  };

  const handleTextChange = (text) => {
    setError(null);
    setResult(null);
    setTextInput(text);
  };

  const validateFile = (file, type) => {
    if (!file) return 'Please select a file';
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (type === 'pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Please select a PDF file';
    }

    if (type === 'image') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return 'Please select a valid image file (JPG, PNG, BMP, TIFF, WEBP)';
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      
      if (activeTab === 'pdf') {
        const fileError = validateFile(pdfFile, 'pdf');
        if (fileError) {
          setError(fileError);
          return;
        }

        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('language', language);
        formData.append('summary_type', summaryType);

        response = await fetch(`${API_BASE_URL}/summarize/pdf`, {
          method: 'POST',
          body: formData,
        });

      } else if (activeTab === 'image') {
        const fileError = validateFile(imageFile, 'image');
        if (fileError) {
          setError(fileError);
          return;
        }

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('language', language);
        formData.append('summary_type', summaryType);

        response = await fetch(`${API_BASE_URL}/summarize/image`, {
          method: 'POST',
          body: formData,
        });

      } else if (activeTab === 'text') {
        if (!textInput.trim()) {
          setError('Please enter some text to summarize');
          return;
        }

        response = await fetch(`${API_BASE_URL}/summarize/text`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textInput,
            language: language,
            summary_type: summaryType,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const FileUploadArea = ({ onFileChange, accept, children }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={(e) => onFileChange(e.target.files[0])}
        className="hidden"
        id={`file-upload-${accept}`}
      />
      <label htmlFor={`file-upload-${accept}`} className="cursor-pointer">
        {children}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Document Summarizer
          </h1>
          <p className="text-xl text-gray-600">
            Extract and summarize content from PDFs, images, or text using AI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <TabButton
              id="pdf"
              icon={FileText}
              label="PDF Upload"
              isActive={activeTab === 'pdf'}
              onClick={() => setActiveTab('pdf')}
            />
            <TabButton
              id="image"
              icon={Image}
              label="Image Upload"
              isActive={activeTab === 'image'}
              onClick={() => setActiveTab('image')}
            />
            <TabButton
              id="text"
              icon={Type}
              label="Text Input"
              isActive={activeTab === 'text'}
              onClick={() => setActiveTab('text')}
            />
          </div>

          <div className="space-y-6">
            {/* Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary Type
                </label>
                <select
                  value={summaryType}
                  onChange={(e) => setSummaryType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {summaryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Input Area */}
            {activeTab === 'pdf' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF File
                </label>
                <FileUploadArea
                  accept=".pdf"
                  onFileChange={(file) => handleFileChange(file, 'pdf')}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {pdfFile ? pdfFile.name : 'Click to upload PDF'}
                  </div>
                  <p className="text-sm text-gray-500">
                    Supported: PDF files up to 10MB
                  </p>
                </FileUploadArea>
              </div>
            )}

            {activeTab === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image File
                </label>
                <FileUploadArea
                  accept="image/*"
                  onFileChange={(file) => handleFileChange(file, 'image')}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {imageFile ? imageFile.name : 'Click to upload image'}
                  </div>
                  <p className="text-sm text-gray-500">
                    Supported: JPG, PNG, BMP, TIFF, WEBP up to 10MB
                  </p>
                </FileUploadArea>
              </div>
            )}

            {activeTab === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Text to Summarize
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Paste or type your text here..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {textInput.length} characters
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                'Generate Summary'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="text-green-600" size={24} />
                <h2 className="text-2xl font-bold text-green-800">
                  Summary Generated Successfully
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">File Details</h3>
                  <p><strong>Name:</strong> {result.file_name}</p>
                  <p><strong>Type:</strong> {result.source_type.toUpperCase()}</p>
                  <p><strong>Language:</strong> {result.language}</p>
                  <p><strong>Summary Type:</strong> {result.summary_type}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Content Stats</h3>
                  <p><strong>Original:</strong> {result.original_content.length} characters</p>
                  <p><strong>Summary:</strong> {result.summary_content.length} characters</p>
                  <p><strong>Compression:</strong> {Math.round((1 - result.summary_content.length / result.original_content.length) * 100)}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {result.summary_content}
                  </div>
                </div>

                {result.original_content && (
                  <details className="bg-white p-4 rounded-lg">
                    <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                      View Original Content
                    </summary>
                    <div className="mt-3 text-gray-600 whitespace-pre-wrap text-sm max-h-60 overflow-y-auto">
                      {result.original_content}
                    </div>
                  </details>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default SummarizeForm;
