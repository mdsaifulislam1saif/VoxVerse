import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', className = '' }) => {
  // Map size prop to TailwindCSS height & width classes
  const sizeClasses = {
    small: 'h-4 w-4',    // small spinner
    default: 'h-8 w-8',  // medium spinner (default)
    large: 'h-12 w-12'   // large spinner
  };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Spinner Icon with size and color */}
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
    </div>
  );
};
export default LoadingSpinner;
