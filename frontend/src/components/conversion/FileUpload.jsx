import { Upload, FileText, Image, Loader2 } from 'lucide-react';
import { useFileUpload } from '../../hook/useFileUpload';

const FileUpload = ({ setText, selectedLanguage }) => {
  const {
    pdfLoading,
    imageLoading,
    pdfInputRef,
    imageInputRef,
    handleFileUpload,
  } = useFileUpload(setText, selectedLanguage);

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
