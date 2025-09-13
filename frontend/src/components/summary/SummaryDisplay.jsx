import { Eye, EyeOff } from 'lucide-react';

const SummaryDisplay = ({ summary, showSummary, setShowSummary }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <h3 className="font-semibold text-gray-800">Generated Summary</h3>
      <button onClick={() => setShowSummary(!showSummary)}>
        {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {showSummary && (
      <p className="p-4 bg-green-50 border border-green-200 rounded-lg text-gray-700">{summary}</p>
    )}
  </div>
);

export default SummaryDisplay;
