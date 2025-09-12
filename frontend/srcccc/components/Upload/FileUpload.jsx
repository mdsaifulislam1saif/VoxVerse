import { Upload, FileText, Image } from 'lucide-react';
import UploadCard from './UploadCard';

const FileUpload = ({ uploadLoading, handleFileUpload }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Upload className="mr-3 text-blue-600" size={24} />
          Upload Files
        </h2>
        <div className="space-y-4">
          <UploadCard
            type="pdf"
            icon={FileText}
            title="Upload PDF"
            subtitle="Click to browse"
            accept=".pdf"
            uploadLoading={uploadLoading}
            onFileSelect={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'pdf')}
            hoverColor="blue"
          />
          <UploadCard
            type="image"
            icon={Image}
            title="Upload Image"
            subtitle="JPG, PNG, WEBP"
            accept=".jpg,.jpeg,.png,.bmp,.tiff,.webp"
            uploadLoading={uploadLoading}
            onFileSelect={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'image')}
            hoverColor="green"
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;