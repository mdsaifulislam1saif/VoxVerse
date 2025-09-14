import { FileText } from 'lucide-react';
import { ROUTES } from '../../config/config';

const EmptyState = () => (
  <div className="text-center py-12">
    {/* Icon at the top */}
    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    {/* Heading */}
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No conversions yet
    </h3>
    {/* Description */}
    <p className="text-gray-600 mb-6">
      Start converting text to audio to see your history here.
    </p>
    {/* Call-to-action button linking to converter */}
    <a
      href={ROUTES.CONVERTER}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
    >
      <FileText className="h-5 w-5 mr-2" />
      Start Converting
    </a>
  </div>
);
export default EmptyState;
