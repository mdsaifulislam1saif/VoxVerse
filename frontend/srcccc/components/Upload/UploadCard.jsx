import Loader from '../Loader';

const UploadCard = ({ 
  type, 
  icon: Icon, 
  title, 
  subtitle, 
  accept, 
  uploadLoading, 
  onFileSelect,
  hoverColor = 'blue' 
}) => {
  const hoverClasses = {
    blue: 'hover:bg-blue-50 hover:border-blue-400',
    green: 'hover:bg-green-50 hover:border-green-400'
  };

  return (
    <div>
      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 ${hoverClasses[hoverColor]} transition duration-200`}>
        {uploadLoading ? (
          <Loader className={`h-8 w-8 text-${hoverColor}-500`} size={32} />
        ) : (
          <>
            <Icon className={`h-8 w-8 text-${hoverColor}-500 mb-2`} />
            <span className="text-sm font-medium text-gray-700">{title}</span>
            <span className="text-xs text-gray-500">{subtitle}</span>
          </>
        )}
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={onFileSelect}
        />
      </label>
    </div>
  );
};

export default UploadCard;