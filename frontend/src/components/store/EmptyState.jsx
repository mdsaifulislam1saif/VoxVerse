import { FileText } from 'lucide-react';

const EmptyState = () => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversions yet</h3>
    <p className="text-gray-600 mb-6">Start converting text to audio to see your history here.</p>
    <a
      href="/converter"
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
    >
      <FileText className="h-5 w-5 mr-2" />
      Start Converting
    </a>
  </div>
);

export default EmptyState;
