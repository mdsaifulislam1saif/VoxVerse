import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, Loader2 } from 'lucide-react';
import { apiService } from '@services/api';

const FileUpload = ({ setText, selectedLanguage = 'en' }) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    if (type === 'pdf') setPdfLoading(true);
    if (type === 'image') setImageLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', selectedLanguage);

    try {
      const endpoint = type === 'pdf' ? '/extract/pdf' : '/extract/image';
      const response = await apiService.postFormData(endpoint, formData);
      setText(response.text || '');
    } catch (error) {
      alert(error.message || 'Failed to extract text');
    } finally {
      if (type === 'pdf') {
        setPdfLoading(false);
        pdfInputRef.current.value = ''; 
      }
      if (type === 'image') {
        setImageLoading(false);
        imageInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <Upload className="mr-3 text-blue-600" size={24} />
        Upload Files
      </h2>

      <div className="space-y-4">
        {/* PDF Upload */}
        <div>
          <input
            type="file"
            ref={pdfInputRef}
            id="pdfUpload"
            className="hidden"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e.target.files[0], 'pdf')}
          />
          <label
            htmlFor="pdfUpload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            {pdfLoading ? (
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            ) : (
              <>
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">Upload PDF</span>
              </>
            )}
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <input
            type="file"
            ref={imageInputRef}
            id="imageUpload"
            className="hidden"
            accept=".jpg,.jpeg,.png,.bmp,.tiff,.webp"
            onChange={(e) => handleFileUpload(e.target.files[0], 'image')}
          />
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-400 transition-colors"
          >
            {imageLoading ? (
              <Loader2 className="animate-spin h-8 w-8 text-green-500" />
            ) : (
              <>
                <Image className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">Upload Image</span>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
